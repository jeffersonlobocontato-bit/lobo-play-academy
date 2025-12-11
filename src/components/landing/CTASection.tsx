import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTASection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lobo-orange-glow/20 rounded-full blur-3xl" />

      <div className="container-tight relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6"
          >
            <Zap className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-400">Última chance com este preço</span>
          </motion.div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            Ainda criando agentes{' '}
            <span className="text-gradient">genéricos e sem identidade?</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Enquanto você lê isso, profissionais estão usando o Método DEL para criar agentes 
            que se comunicam com autenticidade e geram resultados reais.
          </p>

          {/* Urgency Box */}
          <div className="max-w-md mx-auto mb-10 p-6 rounded-2xl bg-card border border-border/50">
            <p className="text-sm text-muted-foreground mb-4">
              Por apenas <span className="text-primary font-bold text-2xl">R$ 14,00</span> você tem:
            </p>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Método DEL completo e detalhado
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Templates prontos para usar
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Acesso vitalício ao conteúdo
              </li>
              <li className="flex items-center gap-2 text-sm">
                <span className="text-green-500">✓</span> Atualizações futuras inclusas
              </li>
            </ul>
            
            <a 
              href="https://hotmart.com/pt-br/marketplace/produtos/o-codigo-invisivel-dos-superagentes-de-inteligencia-artificial/O101044688E" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Button variant="hero" size="xl" className="w-full animate-pulse-glow">
                SIM! QUERO CRIAR SUPERAGENTES
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-sm">Pagamento 100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              <span className="text-sm">Acesso Imediato</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-sm">Garantia de 7 dias</span>
            </div>
          </div>

          {/* Final Push */}
          <p className="mt-8 text-sm text-muted-foreground italic">
            "O DNA autoral é o que separa agentes genéricos de SuperAgentes que geram resultados."
            <br />
            <span className="text-primary font-semibold">— Jefferson Lobo</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;