import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoboPlayLogo } from "@/components/LoboPlayLogo";
import { CountdownTimer } from "@/components/funnel/CountdownTimer";
import { useCartStatus } from "@/components/funnel/CartStatus";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const benefits = [
  "Método DEL completo (DNA + Eliminação + Lançamento)",
  "Templates de prompts prontos para usar",
  "Acesso à comunidade exclusiva",
  "Certificado de conclusão",
  "Atualizações vitalícias",
  "Suporte prioritário por 1 ano",
];

const VendasPage = () => {
  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [offer, setOffer] = useState<any>(null);
  const { isOpen, isLoading: cartLoading, timeUntilClose, timeUntilOpen } = useCartStatus();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Oferta Especial | LoboPlay Academy";
    fetchOffer();
  }, []);

  const fetchOffer = async () => {
    const { data } = await supabase
      .from("offers")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setOffer(data);
    }
  };

  const handleCheckout = async () => {
    if (!offer) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Oferta não encontrada. Tente recarregar a página.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const leadId = localStorage.getItem("lobo_lead_id");

      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          body: {
            offer_id: offer.id,
            lead_id: leadId || undefined,
            success_url: `${window.location.origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: window.location.href,
          },
        }
      );

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não retornada");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar pagamento",
        description:
          error.message || "Ocorreu um erro. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-4 px-4 border-b border-border">
          <div className="max-w-5xl mx-auto flex justify-center">
            <LoboPlayLogo />
          </div>
        </header>

        {/* Urgency Banner */}
        {isOpen && timeUntilClose && (
          <div className="bg-destructive/10 border-b border-destructive/20 py-3">
            <div className="max-w-5xl mx-auto px-4 text-center">
              <p className="text-sm text-foreground mb-2 font-medium">
                ⚠️ As inscrições encerram em:
              </p>
              <CountdownTimer
                targetDate={timeUntilClose}
                variant="compact"
                showLabels={false}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Torne-se um{" "}
                <span className="text-gradient">Expert em Agentes de IA</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Domine o Método DEL e crie agentes que transformam negócios, 
                com DNA autoral único e zero alucinações.
              </p>
            </motion.div>

            {/* Offer Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <div className="card-glass rounded-2xl p-6 md:p-8 border-2 border-primary/30">
                <div className="text-center mb-8">
                  <span className="inline-block px-4 py-1 bg-primary/20 text-primary text-sm font-medium rounded-full mb-4">
                    OFERTA ESPECIAL
                  </span>

                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Método DEL Completo
                  </h2>

                  <p className="text-muted-foreground">
                    Tudo que você precisa para criar agentes profissionais
                  </p>
                </div>

                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                {offer && (
                  <div className="text-center mb-6">
                    {offer.original_price_cents && (
                      <p className="text-muted-foreground line-through text-lg">
                        De {formatPrice(offer.original_price_cents)}
                      </p>
                    )}
                    <p className="text-4xl font-bold text-foreground">
                      {formatPrice(offer.price_cents)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ou 12x de {formatPrice(Math.round(offer.price_cents / 12))}
                    </p>
                  </div>
                )}

                {/* CTA */}
                {cartLoading ? (
                  <div className="text-center py-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : isOpen ? (
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading || !offer}
                    size="lg"
                    className="w-full btn-glow text-lg py-6"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Quero Me Inscrever Agora
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                ) : timeUntilOpen ? (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      As inscrições abrem em:
                    </p>
                    <CountdownTimer
                      targetDate={timeUntilOpen}
                      variant="default"
                    />
                    <Link to="/lp">
                      <Button variant="outline" className="mt-6">
                        Entrar na Lista de Espera
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
                      <AlertCircle className="w-5 h-5" />
                      <span>Inscrições encerradas</span>
                    </div>
                    <Link to="/lp">
                      <Button variant="outline">
                        Entrar na Lista de Espera
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-primary" />
                    Compra segura
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    Acesso imediato
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 text-primary" />
                    7 dias de garantia
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span>+500 alunos já estão transformando seus negócios</span>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LoboPlay Academy. Todos os direitos
              reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VendasPage;
