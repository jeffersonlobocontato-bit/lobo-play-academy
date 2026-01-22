import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoboPlayLogo } from "@/components/LoboPlayLogo";
import { supabase } from "@/integrations/supabase/client";

type OrderStatus = "checking" | "pending" | "paid" | "error";

const SucessoPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<OrderStatus>("checking");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [pollCount, setPollCount] = useState(0);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    document.title = "Confirmando Pagamento... | LoboPlay Academy";

    if (!sessionId) {
      setStatus("error");
      return;
    }

    checkOrderStatus();
  }, [sessionId]);

  useEffect(() => {
    // Poll for status updates if still pending
    if (status === "pending" && pollCount < 30) {
      const timer = setTimeout(() => {
        checkOrderStatus();
        setPollCount((c) => c + 1);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, pollCount]);

  const checkOrderStatus = async () => {
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .select("*")
        .eq("stripe_session_id", sessionId)
        .single();

      if (error) {
        console.error("Error fetching order:", error);
        if (pollCount === 0) {
          // First check - order might not exist yet
          setStatus("pending");
        }
        return;
      }

      setOrderDetails(order);

      if (order.status === "paid") {
        setStatus("paid");
        document.title = "Pagamento Confirmado! | LoboPlay Academy";
      } else if (order.status === "refunded") {
        setStatus("error");
      } else {
        setStatus("pending");
      }
    } catch (error) {
      console.error("Error checking order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-4xl mx-auto flex justify-center">
            <LoboPlayLogo />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            {status === "checking" && (
              <>
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Verificando pagamento...
                </h1>
                <p className="text-muted-foreground">
                  Aguarde um momento enquanto confirmamos seu pagamento.
                </p>
              </>
            )}

            {status === "pending" && (
              <>
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Processando pagamento...
                </h1>
                <p className="text-muted-foreground mb-4">
                  Seu pagamento está sendo processado. Isso pode levar alguns instantes.
                </p>
                <p className="text-sm text-muted-foreground">
                  Não feche esta página. Você será redirecionado automaticamente.
                </p>
              </>
            )}

            {status === "paid" && (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-primary" />
                </motion.div>

                <h1 className="text-3xl font-bold text-foreground mb-4">
                  Pagamento Confirmado! 🎉
                </h1>

                <p className="text-lg text-muted-foreground mb-8">
                  Parabéns! Seu acesso ao curso foi liberado.
                </p>

                <div className="card-glass rounded-xl p-6 mb-8 text-left">
                  <h2 className="font-semibold text-foreground mb-4">
                    Próximos passos:
                  </h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Você receberá um email com seus dados de acesso
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Faça login no portal para começar as aulas
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      Entre na comunidade exclusiva de alunos
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="btn-glow">
                    <Link to="/login">
                      Acessar o Curso
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                </div>
              </>
            )}

            {status === "error" && (
              <>
                <div className="w-20 h-20 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-destructive" />
                </div>

                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Algo deu errado
                </h1>

                <p className="text-muted-foreground mb-8">
                  Não foi possível confirmar seu pagamento. Se você realizou o
                  pagamento, entre em contato conosco.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link to="/vendas">Tentar Novamente</Link>
                  </Button>
                  <Button asChild>
                    <a
                      href="https://wa.me/5511999999999?text=Olá! Fiz um pagamento mas não recebi acesso ao curso."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar no WhatsApp
                    </a>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
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

export default SucessoPage;
