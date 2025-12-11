import { motion } from 'framer-motion';
import { Award, Clock, Users, HeadphonesIcon, PlayCircle, Shield } from 'lucide-react';

const features = [
  {
    icon: PlayCircle,
    title: 'Conteúdo de Qualidade',
    description: 'Aulas gravadas em alta qualidade com instrutores especialistas e material atualizado.',
  },
  {
    icon: Clock,
    title: 'Acesso Vitalício',
    description: 'Estude no seu ritmo com acesso ilimitado aos cursos e todas as atualizações futuras.',
  },
  {
    icon: Award,
    title: 'Certificado Reconhecido',
    description: 'Receba um certificado de conclusão válido para adicionar ao seu currículo.',
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Conecte-se com outros alunos e instrutores em nossa comunidade exclusiva.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Suporte Dedicado',
    description: 'Tire suas dúvidas diretamente com instrutores e nossa equipe de suporte.',
  },
  {
    icon: Shield,
    title: 'Garantia de 7 Dias',
    description: 'Se não gostar, devolvemos 100% do seu dinheiro sem perguntas.',
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
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Por que escolher a LoboPlay?</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Tudo que você precisa para{' '}
            <span className="text-gradient">evoluir</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Nossa plataforma foi desenvolvida pensando em oferecer a melhor experiência 
            de aprendizado online para você.
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
      </div>
    </section>
  );
};

export default FeaturesSection;
