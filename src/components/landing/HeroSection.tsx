import { Link } from 'react-router-dom';
import { Play, ArrowRight, Star, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-pattern">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-lobo-slate/30 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
            >
              <Star className="w-4 h-4 text-primary fill-primary" />
              <span className="text-sm font-medium text-primary">+10.000 alunos transformados</span>
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
              Domine novas{' '}
              <span className="text-gradient">habilidades</span>{' '}
              e acelere sua carreira
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Cursos online de alta qualidade com certificação, suporte especializado 
              e acesso vitalício. Aprenda no seu ritmo, de qualquer lugar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link to="/cursos">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  Ver Cursos
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/#video">
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  <Play className="w-5 h-5" />
                  Assistir Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Users className="w-5 h-5" />
                  <span className="font-heading font-bold text-2xl">10k+</span>
                </div>
                <p className="text-sm text-muted-foreground">Alunos</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-heading font-bold text-2xl">50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Cursos</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Star className="w-5 h-5 fill-primary" />
                  <span className="font-heading font-bold text-2xl">4.9</span>
                </div>
                <p className="text-sm text-muted-foreground">Avaliação</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative card-glass rounded-2xl p-6 card-hover">
              {/* Video Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-lobo-navy-light">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg btn-glow group">
                    <Play className="w-8 h-8 text-primary-foreground ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                {/* Mock Video Thumbnail Content */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Curso em Destaque</p>
                    <p className="text-xs text-muted-foreground">Marketing Digital Completo</p>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Módulos</p>
                  <p className="font-heading font-bold text-primary">12</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Horas</p>
                  <p className="font-heading font-bold text-primary">48h</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Certificado</p>
                  <p className="font-heading font-bold text-primary">Sim</p>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 p-4 rounded-xl card-glass animate-float hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                </div>
                <span className="text-sm font-medium">247 online agora</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
