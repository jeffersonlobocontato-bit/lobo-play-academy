import { motion } from 'framer-motion';
import { Clock, BookOpen, Star, Users, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const courseModules = [
  'Fundamentos do Método DEL',
  'Análise Sintática para IA',
  'Extração Semântica Avançada',
  'Mapeamento Lexical',
  'Construção do DNA Autoral',
  'Aplicação Prática em Agentes',
];

const bonuses = [
  { title: 'Templates de Prompts DEL', description: 'Modelos prontos para usar' },
  { title: 'Comunidade Exclusiva', description: 'Acesso ao grupo de alunos' },
  { title: 'Atualizações Vitalícias', description: 'Novos conteúdos sem custo extra' },
];

export const CoursesSection = () => {
  return (
    <section id="cursos" className="section-padding">
      <div className="container-tight">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Curso Completo</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            O Código Invisível dos{' '}
            <span className="text-gradient">SuperAgentes de IA</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            O guia prático definitivo para criar agentes de inteligência artificial 
            que escrevem com DNA autoral e zero alucinações.
          </p>
        </motion.div>

        {/* Course Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-3xl bg-card border border-primary/30 overflow-hidden shadow-2xl">
            {/* Header Banner */}
            <div className="relative bg-gradient-to-r from-primary/20 via-lobo-navy to-lobo-slate/50 p-8 text-center">
              <div className="absolute top-4 right-4">
                <span className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold animate-pulse">
                  🔥 OFERTA ESPECIAL
                </span>
              </div>
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-2">
                Método DEL Completo
              </h3>
              <p className="text-muted-foreground">Por Jefferson Lobo • +20 anos em Marketing e Comunicação</p>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left - Modules */}
                <div>
                  <h4 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    O que você vai aprender:
                  </h4>
                  <ul className="space-y-3">
                    {courseModules.map((module, index) => (
                      <li key={index} className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        {module}
                      </li>
                    ))}
                  </ul>

                  {/* Bonuses */}
                  <h4 className="font-heading font-bold text-lg mt-8 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Bônus Inclusos:
                  </h4>
                  <ul className="space-y-3">
                    {bonuses.map((bonus, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm">{bonus.title}</p>
                          <p className="text-xs text-muted-foreground">{bonus.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right - CTA */}
                <div className="bg-secondary/30 rounded-2xl p-6 md:p-8">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Acesso</p>
                      <p className="font-bold text-sm">Vitalício</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Para</p>
                      <p className="font-bold text-sm">Todos</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-background/50">
                      <Star className="w-5 h-5 text-primary mx-auto mb-1 fill-primary" />
                      <p className="text-xs text-muted-foreground">Garantia</p>
                      <p className="font-bold text-sm">7 Dias</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground line-through">De R$ 97,00</p>
                    <p className="text-sm text-green-400 font-semibold">Por apenas:</p>
                    <p className="font-heading text-5xl font-bold text-primary my-2">
                      R$ 14<span className="text-2xl">,00</span>
                    </p>
                    <p className="text-xs text-muted-foreground">Pagamento único • Acesso imediato</p>
                  </div>

                  {/* CTA Button */}
                  <a 
                    href="https://hotmart.com/pt-br/marketplace/produtos/o-codigo-invisivel-dos-superagentes-de-inteligencia-artificial/O101044688E" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="hero" size="xl" className="w-full mb-4">
                      QUERO CRIAR SUPERAGENTES
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </a>

                  {/* Guarantee */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <span>Garantia incondicional de 7 dias</span>
                  </div>

                  {/* Trust Elements */}
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <p className="text-xs text-center text-muted-foreground mb-3">
                      Pagamento 100% seguro via:
                    </p>
                    <div className="flex justify-center gap-4 text-muted-foreground">
                      <span className="text-xs">💳 Cartão</span>
                      <span className="text-xs">📱 Pix</span>
                      <span className="text-xs">📄 Boleto</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <h4 className="font-heading font-bold text-lg mb-4 text-center">Para quem é este curso?</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  {['Comunicadores', 'Marketeiros', 'Estrategistas', 'Desenvolvedores'].map((audience) => (
                    <div key={audience} className="p-4 rounded-xl bg-secondary/30">
                      <p className="font-semibold text-sm">{audience}</p>
                    </div>
                  ))}
                </div>
                <p className="text-center text-muted-foreground text-sm mt-4">
                  E qualquer pessoa interessada em aplicar IA com foco em autenticidade e comunicação efetiva.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;