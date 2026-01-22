import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Clock, Users, Shield } from "lucide-react";
import { LeadCaptureForm } from "@/components/funnel/LeadCaptureForm";
import { LoboPlayLogo } from "@/components/LoboPlayLogo";

const LandingPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Track page view
    document.title = "Treinamento Exclusivo | Método DEL";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-6 px-4">
          <div className="max-w-4xl mx-auto flex justify-center">
            <LoboPlayLogo />
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 md:py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left - Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  Treinamento Gratuito
                </span>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-6">
                  Descubra Como Criar{" "}
                  <span className="text-gradient">Agentes de IA</span> que
                  Realmente Funcionam
                </h1>

                <p className="text-lg text-muted-foreground mb-8">
                  Aprenda o Método DEL e crie agentes com DNA autoral único, 
                  sem alucinações e que geram resultados reais para seu negócio.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">3 aulas práticas</span>
                      <p className="text-sm text-muted-foreground">
                        Conteúdo direto ao ponto, sem enrolação
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">+500 alunos</span>
                      <p className="text-sm text-muted-foreground">
                        Já transformaram seus negócios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">100% online e gratuito</span>
                      <p className="text-sm text-muted-foreground">
                        Acesso imediato após o cadastro
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right - Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="card-glass rounded-2xl p-6 md:p-8">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Cadastre-se gratuitamente
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      E receba acesso ao treinamento exclusivo
                    </p>
                  </div>

                  <LeadCaptureForm
                    source="landing"
                    redirectUrl="/obrigado"
                    buttonText="Quero Participar!"
                    showPhone
                  />

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Seus dados estão seguros. Não enviamos spam.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 border-t border-border">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LoboPlay Academy. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
