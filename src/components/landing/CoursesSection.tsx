import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Star, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  duration: string;
  modules: number;
  students: number;
  rating: number;
  image: string;
  category: string;
  featured?: boolean;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Marketing Digital Completo',
    description: 'Domine todas as estratégias de marketing digital: SEO, Ads, Social Media e muito mais.',
    instructor: 'Carlos Silva',
    price: 297,
    originalPrice: 497,
    duration: '48h',
    modules: 12,
    students: 3420,
    rating: 4.9,
    image: '',
    category: 'Marketing',
    featured: true,
  },
  {
    id: '2',
    title: 'Desenvolvimento Web Full Stack',
    description: 'Aprenda a criar aplicações web completas com React, Node.js e banco de dados.',
    instructor: 'Ana Santos',
    price: 397,
    originalPrice: 597,
    duration: '64h',
    modules: 16,
    students: 2180,
    rating: 4.8,
    image: '',
    category: 'Tecnologia',
  },
  {
    id: '3',
    title: 'Design UX/UI Profissional',
    description: 'Crie interfaces incríveis e experiências de usuário memoráveis.',
    instructor: 'Pedro Costa',
    price: 247,
    originalPrice: 397,
    duration: '36h',
    modules: 10,
    students: 1850,
    rating: 4.9,
    image: '',
    category: 'Design',
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

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
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Nossos Cursos</span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
            Cursos que{' '}
            <span className="text-gradient">transformam</span>{' '}
            carreiras
          </h2>
          <p className="text-muted-foreground text-lg">
            Conheça nossos cursos mais populares e comece sua jornada de transformação hoje mesmo.
          </p>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              className="group rounded-2xl bg-card border border-border/50 overflow-hidden card-hover"
            >
              {/* Image */}
              <div className="relative aspect-video bg-lobo-navy-light overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-lobo-slate/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-foreground" />
                  </div>
                </div>
                {course.featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      Destaque
                    </span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-sm text-foreground text-xs font-medium">
                    {course.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.modules} módulos
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.students.toLocaleString()}
                  </div>
                </div>

                {/* Rating & Instructor */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-primary fill-primary" />
                      <span className="font-semibold text-sm">{course.rating}</span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">por {course.instructor}</span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div>
                    {course.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        R$ {course.originalPrice}
                      </span>
                    )}
                    <p className="font-heading font-bold text-2xl text-primary">
                      R$ {course.price}
                    </p>
                  </div>
                  <Link to={`/curso/${course.id}`}>
                    <Button variant="hero" size="sm">
                      Ver Curso
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/cursos">
            <Button variant="outline" size="lg">
              Ver Todos os Cursos
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;
