import { useState } from 'react';
import { Play, ArrowRight, Star, Zap, Brain, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { VideoModal } from '@/components/VideoModal';

export const HeroSection = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-hero-pattern">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-lobo-slate/30 rounded-full blur-3xl" />
      </div>

      <div className="container-tight relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Urgency Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6"
            >
              <Zap className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-400">Método Exclusivo • Vagas Limitadas</span>
            </motion.div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight mb-6">
              Crie Agentes de IA com{' '}
              <span className="text-gradient">DNA Autoral</span>{' '}
              e Elimine Alucinações
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-xl mx-auto lg:mx-0">
              Descubra o <strong className="text-primary">Método DEL</strong> (Decomposição de Estrutura de Linguagem) 
              e aprenda a criar SuperAgentes que escrevem com a sua identidade, coerência e precisão absoluta.
            </p>

            {/* Pain Points */}
            <div className="bg-card/50 border border-border/50 rounded-xl p-4 mb-8 max-w-xl mx-auto lg:mx-0">
              <p className="text-sm text-muted-foreground italic">
                "Cansado de IAs que dão respostas genéricas? Frustrado com alucinações que prejudicam sua marca? 
                Está tentando escalar soluções sem direção?"
              </p>
              <p className="text-sm text-primary font-semibold mt-2">
                ✓ O Método DEL resolve isso de uma vez por todas.
              </p>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Brain className="w-5 h-5" />
                  <span className="font-heading font-bold text-2xl">100%</span>
                </div>
                <p className="text-sm text-muted-foreground">Prático</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="font-heading font-bold text-2xl">7 dias</span>
                </div>
                <p className="text-sm text-muted-foreground">Garantia</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Star className="w-5 h-5 fill-primary" />
                  <span className="font-heading font-bold text-2xl">R$14</span>
                </div>
                <p className="text-sm text-muted-foreground">Investimento</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image/Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-4"
            id="video"
          >
            {/* Online Badge - Above Card */}
            <div className="hidden lg:flex justify-end">
              <div className="p-4 rounded-xl card-glass animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  </div>
                  <span className="text-sm font-medium">Alunos online agora</span>
                </div>
              </div>
            </div>

            <div className="card-glass rounded-2xl p-6 card-hover">
              {/* Video Thumbnail - 9:16 for Shorts */}
              <div className="relative aspect-[9/16] max-w-[280px] max-h-[450px] mx-auto rounded-xl overflow-hidden bg-lobo-navy-light">
                <img 
                  src="https://img.youtube.com/vi/Pmt9RuXhqiU/maxresdefault.jpg"
                  alt="Vídeo do Método DEL"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={() => setVideoOpen(true)}
                    className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg btn-glow group cursor-pointer hover:scale-105 transition-transform"
                  >
                    <Play className="w-8 h-8 text-primary-foreground ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
                {/* Course Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">O Código Invisível</p>
                    <p className="text-xs text-muted-foreground">SuperAgentes de IA</p>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Método</p>
                  <p className="font-heading font-bold text-primary">DEL</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Zero</p>
                  <p className="font-heading font-bold text-primary">Código</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Acesso</p>
                  <p className="font-heading font-bold text-primary">Imediato</p>
                </div>
              </div>

              {/* Author Badge - Inside Card */}
              <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-bold text-primary text-sm">JL</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Jefferson Lobo</p>
                    <p className="text-xs text-muted-foreground">Criador do Método DEL</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Buttons - Below the grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <a href="https://hotmart.com/pt-br/marketplace/produtos/o-codigo-invisivel-dos-superagentes-de-inteligencia-artificial/O101044688E" target="_blank" rel="noopener noreferrer">
            <Button variant="hero" size="xl" className="w-full sm:w-auto animate-pulse-glow">
              Quero Dominar o Método DEL
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
          <a href="#video">
            <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
              <Play className="w-5 h-5" />
              Ver Apresentação
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Video Modal */}
      <VideoModal 
        open={videoOpen} 
        onOpenChange={setVideoOpen}
        youtubeId="Pmt9RuXhqiU"
        isShorts={true}
      />
    </section>
  );
};

export default HeroSection;
