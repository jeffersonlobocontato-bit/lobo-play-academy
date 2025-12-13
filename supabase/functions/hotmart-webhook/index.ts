import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

interface HotmartBuyer {
  email: string;
  name: string;
  phone?: string;
}

interface HotmartProduct {
  id: string;
  name: string;
}

interface HotmartPurchase {
  transaction: string;
  status: string;
}

interface HotmartWebhookPayload {
  event: string;
  data: {
    buyer: HotmartBuyer;
    product: HotmartProduct;
    purchase: HotmartPurchase;
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const hotmartSecret = Deno.env.get("HOTMART_WEBHOOK_SECRET");

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Validate Hotmart webhook token
    const hottok = req.headers.get("x-hotmart-hottok");
    
    if (hotmartSecret && hottok !== hotmartSecret) {
      console.error("Invalid Hotmart webhook token");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: HotmartWebhookPayload = await req.json();
    console.log("Hotmart webhook received:", JSON.stringify(payload, null, 2));

    const { event, data } = payload;
    const { buyer, product, purchase } = data;

    // Log the transaction
    const { error: logError } = await supabase
      .from("hotmart_transactions")
      .upsert({
        hotmart_transaction_id: purchase.transaction,
        hotmart_product_id: product.id.toString(),
        buyer_email: buyer.email.toLowerCase(),
        buyer_name: buyer.name,
        status: purchase.status,
        event_type: event,
        raw_payload: payload,
        processed: false,
      }, {
        onConflict: "hotmart_transaction_id"
      });

    if (logError) {
      console.error("Error logging transaction:", logError);
    }

    // Handle different event types
    if (event === "PURCHASE_COMPLETE" || event === "PURCHASE_APPROVED") {
      await handlePurchaseComplete(supabase, buyer, product, purchase);
    } else if (event === "PURCHASE_REFUNDED" || event === "PURCHASE_CANCELED") {
      await handlePurchaseRefunded(supabase, buyer, product, purchase);
    }

    // Mark transaction as processed
    await supabase
      .from("hotmart_transactions")
      .update({ processed: true })
      .eq("hotmart_transaction_id", purchase.transaction);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Webhook error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function handlePurchaseComplete(
  supabase: any,
  buyer: HotmartBuyer,
  product: HotmartProduct,
  purchase: HotmartPurchase
) {
  const email = buyer.email.toLowerCase();
  console.log(`Processing purchase for ${email}, product: ${product.id}`);

  // 1. Check if user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let userId: string | null = null;
  let isNewUser = false;
  let tempPassword: string | null = null;

  const existingUser = existingUsers?.users?.find(
    (u: any) => u.email?.toLowerCase() === email
  );

  if (existingUser) {
    userId = existingUser.id;
    console.log(`User already exists: ${userId}`);
  } else {
    // Create new user with temporary password
    tempPassword = generateTempPassword();
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        full_name: buyer.name,
        source: "hotmart",
      },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      throw createError;
    }

    userId = newUser.user.id;
    isNewUser = true;
    console.log(`Created new user: ${userId}`);
  }

  // 2. Find course mapping
  const { data: productMapping } = await supabase
    .from("hotmart_products")
    .select("course_id")
    .eq("hotmart_product_id", product.id.toString())
    .maybeSingle();

  if (productMapping?.course_id) {
    // 3. Create enrollment
    const { error: enrollError } = await supabase
      .from("enrollments")
      .upsert({
        user_id: userId,
        course_id: productMapping.course_id,
        enrolled_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,course_id",
        ignoreDuplicates: true
      });

    if (enrollError) {
      console.error("Error creating enrollment:", enrollError);
    } else {
      console.log(`Enrollment created for user ${userId} in course ${productMapping.course_id}`);
    }
  } else {
    console.log(`No course mapping found for Hotmart product ${product.id}. Enrollment will be created when mapping is added.`);
  }

  // 4. Update lead as converted
  await supabase
    .from("leads")
    .update({ converted_at: new Date().toISOString() })
    .eq("email", email);

  // 5. Send welcome email
  try {
    const siteUrl = Deno.env.get("SITE_URL") || "https://loboplay.com";
    
    await supabase.functions.invoke("send-email", {
      body: {
        to: email,
        template: "welcome",
        data: {
          name: buyer.name,
          isNewUser,
          tempPassword,
          loginUrl: `${siteUrl}/auth`,
          productName: product.name,
        },
      },
    });
    console.log(`Welcome email sent to ${email}`);
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
  }
}

async function handlePurchaseRefunded(
  supabase: any,
  buyer: HotmartBuyer,
  product: HotmartProduct,
  purchase: HotmartPurchase
) {
  const email = buyer.email.toLowerCase();
  console.log(`Processing refund for ${email}, product: ${product.id}`);

  // Find user
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(
    (u: any) => u.email?.toLowerCase() === email
  );

  if (!existingUser) {
    console.log("User not found for refund");
    return;
  }

  // Find course mapping and remove enrollment
  const { data: productMapping } = await supabase
    .from("hotmart_products")
    .select("course_id")
    .eq("hotmart_product_id", product.id.toString())
    .maybeSingle();

  if (productMapping?.course_id) {
    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("user_id", existingUser.id)
      .eq("course_id", productMapping.course_id);

    if (error) {
      console.error("Error removing enrollment:", error);
    } else {
      console.log(`Enrollment removed for user ${existingUser.id}`);
    }
  }
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
