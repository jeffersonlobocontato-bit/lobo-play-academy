import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutRequest {
  offer_id: string;
  lead_id?: string;
  success_url?: string;
  cancel_url?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { offer_id, lead_id, success_url, cancel_url }: CheckoutRequest = await req.json();

    console.log("Creating checkout session for offer:", offer_id, "lead:", lead_id);

    // 1. Fetch the offer with course info
    const { data: offer, error: offerError } = await supabase
      .from("offers")
      .select("*, courses(*)")
      .eq("id", offer_id)
      .eq("is_active", true)
      .single();

    if (offerError || !offer) {
      console.error("Offer not found:", offerError);
      return new Response(
        JSON.stringify({ error: "Oferta não encontrada ou inativa" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Check if cart window is open (timezone America/Sao_Paulo)
    const now = new Date();
    const { data: cartWindow, error: cartError } = await supabase
      .from("cart_windows")
      .select("*")
      .eq("is_active", true)
      .lte("open_at", now.toISOString())
      .gte("close_at", now.toISOString())
      .maybeSingle();

    if (!cartWindow) {
      console.log("No active cart window found");
      return new Response(
        JSON.stringify({ 
          error: "Carrinho fechado", 
          message: "O período de inscrições não está aberto no momento." 
        }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Cart window open:", cartWindow.name);

    // 3. Fetch lead info if provided
    let customerEmail: string | undefined;
    let customerName: string | undefined;

    if (lead_id) {
      const { data: lead } = await supabase
        .from("leads")
        .select("email, name")
        .eq("id", lead_id)
        .single();

      if (lead) {
        customerEmail = lead.email;
        customerName = lead.name;
      }
    }

    // 4. Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // 5. Create or get Stripe Price
    let stripePriceId = offer.stripe_price_id;

    if (!stripePriceId) {
      console.log("Creating Stripe product and price for offer:", offer.name);
      
      // Create product if needed
      let stripeProductId = offer.stripe_product_id;
      if (!stripeProductId) {
        const product = await stripe.products.create({
          name: offer.name,
          description: offer.description || undefined,
        });
        stripeProductId = product.id;
      }

      // Create price
      const price = await stripe.prices.create({
        product: stripeProductId,
        unit_amount: offer.price_cents,
        currency: "brl",
      });
      stripePriceId = price.id;

      // Update offer with Stripe IDs
      await supabase
        .from("offers")
        .update({
          stripe_product_id: stripeProductId,
          stripe_price_id: stripePriceId,
        })
        .eq("id", offer_id);
    }

    // 6. Determine URLs
    const baseUrl = success_url?.split("/sucesso")[0] || "https://lobo-play-academy.lovable.app";
    const finalSuccessUrl = success_url || `${baseUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`;
    const finalCancelUrl = cancel_url || `${baseUrl}/vendas`;

    // 7. Create Checkout Session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card", "boleto", "pix"],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: finalSuccessUrl,
      cancel_url: finalCancelUrl,
      metadata: {
        offer_id: offer_id,
        lead_id: lead_id || "",
        course_id: offer.course_id || "",
        cart_window_id: cartWindow.id,
      },
      payment_intent_data: {
        metadata: {
          offer_id: offer_id,
          lead_id: lead_id || "",
          course_id: offer.course_id || "",
        },
      },
    };

    // Add customer email if available
    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    console.log("Checkout session created:", session.id);

    // 8. Create pending order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        offer_id: offer_id,
        lead_id: lead_id || null,
        amount_cents: offer.price_cents,
        currency: "BRL",
        status: "pending",
        stripe_session_id: session.id,
        customer_email: customerEmail || null,
        customer_name: customerName || null,
        metadata: {
          cart_window_id: cartWindow.id,
          course_id: offer.course_id,
        },
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      // Don't fail the checkout, just log the error
    } else {
      console.log("Order created:", order.id);
    }

    return new Response(
      JSON.stringify({ 
        url: session.url,
        session_id: session.id,
        order_id: order?.id,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao criar sessão de pagamento";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
