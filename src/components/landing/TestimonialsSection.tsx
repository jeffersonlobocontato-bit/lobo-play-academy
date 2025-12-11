import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  course: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria Fernanda',
    role: 'Empreendedora Digital',
    avatar: '',
    content: 'Depois de fazer o curso de Marketing Digital, consegui aumentar as vendas do meu negócio em 300%. O conteúdo é incrível e muito prático!',
    rating: 5,
    course: 'Marketing Digital Completo',
  },
  {
    id: '2',
    name: 'João Pedro Silva',
    role: 'Desenvolvedor Frontend',
    avatar: '',
    content: 'Migrei de carreira graças aos cursos da LoboPlay. Hoje trabalho como desenvolvedor em uma grande empresa de tecnologia.',
    rating: 5,
    course: 'Desenvolvimento Web Full Stack',
  },
  {
    id: '3',
    name: 'Ana Carolina',
    role: 'UX Designer',
    avatar: '',
    content: 'A qualidade dos cursos é excepcional. Os instrutores são experientes e o suporte é muito atencioso. Recomendo demais!',
    rating: 5,
    course: 'Design UX/UI Profissional',
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
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Depoimentos</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            O que nossos{' '}
            <span className="text-gradient">alunos</span>{' '}
            dizem
          </h2>
          <p className="text-muted-foreground text-lg">
            Histórias reais de transformação de quem já passou pela nossa plataforma.
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
              <p className="text-foreground/90 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

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

              {/* Course Badge */}
              <div className="mt-4">
                <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {testimonial.course}
                </span>
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
            <p className="font-heading font-bold text-4xl text-primary">10k+</p>
            <p className="text-muted-foreground mt-1">Alunos Satisfeitos</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">50+</p>
            <p className="text-muted-foreground mt-1">Cursos Disponíveis</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">4.9</p>
            <p className="text-muted-foreground mt-1">Avaliação Média</p>
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-4xl text-primary">95%</p>
            <p className="text-muted-foreground mt-1">Taxa de Aprovação</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
