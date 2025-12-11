import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carla Mendes',
    role: 'Consultora de Marketing',
    avatar: '',
    content: 'Finalmente entendi como fazer a IA "falar" com a voz da minha marca. O Método DEL é simples, mas incrivelmente poderoso. Meus clientes notaram a diferença imediata.',
    rating: 5,
    result: 'Reduziu 70% do tempo de criação de conteúdo',
  },
  {
    id: '2',
    name: 'Roberto Alves',
    role: 'Empreendedor Digital',
    avatar: '',
    content: 'Estava frustrado com respostas genéricas. Com o DEL, criei um agente que realmente entende meu negócio e comunica do jeito que eu comunicaria. Revolucionário!',
    rating: 5,
    result: 'Criou 3 agentes autorais em 1 semana',
  },
  {
    id: '3',
    name: 'Patrícia Costa',
    role: 'Copywriter',
    avatar: '',
    content: 'Como profissional de escrita, tinha receio de usar IA. O Método DEL me mostrou que é possível manter a autenticidade. Agora uso como assistente fiel ao meu estilo.',
    rating: 5,
    result: 'Aumentou produtividade em 300%',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

export const TestimonialsSection = () => {
  return (
    <section id="depoimentos" className="section-padding bg-card/50">
      <div className="container-tight">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Resultados Reais</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Quem aplicou o{' '}
            <span className="text-gradient">Método DEL</span>{' '}
            aprova
          </h2>
          <p className="text-muted-foreground text-lg">
            Veja como profissionais estão transformando seus agentes de IA com resultados concretos.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="relative p-6 lg:p-8 rounded-2xl bg-card border border-border/50 card-hover"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary/20">
                <Quote className="w-10 h-10" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground/90 leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              {/* Result Badge */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 mb-6">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-green-400">{testimonial.result}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="font-heading font-bold text-primary text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/20"
        >
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">100%</p>
            <p className="text-muted-foreground mt-1">Método Prático</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">0</p>
            <p className="text-muted-foreground mt-1">Código Necessário</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">7</p>
            <p className="text-muted-foreground mt-1">Dias de Garantia</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">R$14</p>
            <p className="text-muted-foreground mt-1">Investimento Total</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;