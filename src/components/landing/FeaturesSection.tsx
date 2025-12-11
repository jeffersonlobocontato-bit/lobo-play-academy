import { motion } from 'framer-motion';
import { Brain, Target, Fingerprint, Shield, Code2, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Fingerprint,
    title: 'DNA Textual Autoral',
    description: 'Estruture o DNA linguístico da sua marca ou do autor para criar agentes que escrevem com identidade única.',
  },
  {
    icon: Brain,
    title: 'Baseado em Teorias Linguísticas',
    description: 'Método fundamentado em análise sintática, semântica e lexical para resultados cientificamente precisos.',
  },
  {
    icon: Shield,
    title: 'Elimine Alucinações',
    description: 'Análise profunda que garante respostas coerentes e elimina os erros típicos de IAs genéricas.',
  },
  {
    icon: Target,
    title: 'Controle Total',
    description: 'Domine sintaxe, semântica e vocabulário para ter controle absoluto sobre as respostas dos seus agentes.',
  },
  {
    icon: Code2,
    title: 'Sem Programação',
    description: 'Aplique o método em qualquer setor, mesmo sem conhecimento técnico de programação.',
  },
  {
    icon: Sparkles,
    title: 'Fidelidade à Identidade',
    description: 'Mantenha 100% de fidelidade à voz e identidade da marca ou do criador em todas as interações.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export const FeaturesSection = () => {
  return (
    <section id="sobre" className="section-padding bg-card/50">
      <div className="container-tight">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">O Método DEL</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Por que o Método DEL{' '}
            <span className="text-gradient">revoluciona</span>{' '}
            a criação de agentes?
          </h2>
          <p className="text-muted-foreground text-lg">
            Decomposição de Estrutura de Linguagem: a técnica brasileira que está transformando 
            como profissionais criam agentes de IA com resultados autênticos e precisos.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 lg:p-8 rounded-2xl bg-card border border-border/50 card-hover"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Problem/Solution Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-lobo-slate/10 border border-primary/20"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-bold text-xl text-red-400 mb-4">❌ Sem o Método DEL:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Respostas genéricas que não representam sua marca
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Alucinações que prejudicam a credibilidade
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Falta de consistência na comunicação
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Horas perdidas ajustando prompts sem resultado
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-green-400 mb-4">✓ Com o Método DEL:</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Agentes com DNA autoral único e autêntico
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Zero alucinações com análise profunda
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Consistência perfeita em todas as interações
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  Resultados reais desde a primeira aplicação
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;