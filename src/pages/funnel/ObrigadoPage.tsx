import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoboPlayLogo } from "@/components/LoboPlayLogo";

const ObrigadoPage = () => {
  useEffect(() => {
    document.title = "Cadastro Confirmado! | LoboPlay Academy";
  }, []);

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
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-primary" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Parabéns! 🎉
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              Seu cadastro foi confirmado com sucesso!
            </p>

            <div className="card-glass rounded-2xl p-6 md:p-8 mb-8 text-left">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Próximos passos:
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Verifique seu email
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Enviamos um email com todas as informações de acesso.
                      Confira também a pasta de spam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Acesse a primeira aula
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Clique no botão abaixo para começar agora mesmo!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="btn-glow group">
              <Link to="/cpl">
                Acessar Primeira Aula
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
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

export default ObrigadoPage;
