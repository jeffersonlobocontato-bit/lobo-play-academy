import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, ArrowRight, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoboPlayLogo } from "@/components/LoboPlayLogo";
import { useCartStatus } from "@/components/funnel/CartStatus";

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  available: boolean;
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "O que é o Método DEL",
    description: "Entenda os fundamentos e por que esse método é diferente de tudo que você já viu.",
    duration: "25 min",
    videoUrl: "https://player.vimeo.com/video/example1",
    available: true,
  },
  {
    id: 2,
    title: "DNA Autoral do seu Agente",
    description: "Como criar agentes únicos que refletem sua personalidade e expertise.",
    duration: "32 min",
    videoUrl: "https://player.vimeo.com/video/example2",
    available: true,
  },
  {
    id: 3,
    title: "Eliminando Alucinações",
    description: "Técnicas avançadas para garantir respostas precisas e confiáveis.",
    duration: "28 min",
    videoUrl: "https://player.vimeo.com/video/example3",
    available: true,
  },
];

const CPLPage = () => {
  const { slug } = useParams();
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0]);
  const [watchedLessons, setWatchedLessons] = useState<number[]>([]);
  const { isOpen: isCartOpen } = useCartStatus();

  useEffect(() => {
    document.title = `${selectedLesson.title} | LoboPlay Academy`;
    
    // Load watched lessons from localStorage
    const saved = localStorage.getItem("lobo_watched_lessons");
    if (saved) {
      setWatchedLessons(JSON.parse(saved));
    }
  }, [selectedLesson]);

  const markAsWatched = (lessonId: number) => {
    if (!watchedLessons.includes(lessonId)) {
      const updated = [...watchedLessons, lessonId];
      setWatchedLessons(updated);
      localStorage.setItem("lobo_watched_lessons", JSON.stringify(updated));
    }
  };

  const allWatched = lessons.every((l) => watchedLessons.includes(l.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="py-4 px-4 border-b border-border">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <LoboPlayLogo />
            {isCartOpen && (
              <Button asChild variant="outline" className="hidden md:flex">
                <Link to="/vendas">
                  Quero me inscrever
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Video Area */}
              <div className="lg:col-span-2">
                <motion.div
                  key={selectedLesson.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aspect-video bg-card rounded-xl overflow-hidden border border-border mb-6"
                >
                  {/* Replace with actual video player */}
                  <div className="w-full h-full flex items-center justify-center bg-secondary/50">
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => markAsWatched(selectedLesson.id)}
                      >
                        <Play className="w-8 h-8 text-primary-foreground ml-1" />
                      </div>
                      <p className="text-muted-foreground">
                        Clique para assistir: {selectedLesson.title}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                    {selectedLesson.title}
                  </h1>
                  <p className="text-muted-foreground mb-6">
                    {selectedLesson.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {selectedLesson.duration}
                    </div>
                    {watchedLessons.includes(selectedLesson.id) && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <CheckCircle className="w-4 h-4" />
                        Assistida
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Lessons Sidebar */}
              <div className="lg:col-span-1">
                <div className="card-glass rounded-xl p-4">
                  <h2 className="font-semibold text-foreground mb-4">
                    Aulas do Treinamento
                  </h2>

                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedLesson.id === lesson.id
                            ? "bg-primary/20 border border-primary/50"
                            : "bg-secondary/30 border border-transparent hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              watchedLessons.includes(lesson.id)
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"
                            }`}
                          >
                            {watchedLessons.includes(lesson.id) ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span className="text-sm font-medium">
                                {index + 1}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground text-sm truncate">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* CTA */}
                  {allWatched && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-4 border-t border-border"
                    >
                      <p className="text-sm text-muted-foreground mb-3">
                        Você completou o treinamento! 🎉
                      </p>
                      <Button asChild className="w-full btn-glow">
                        <Link to="/vendas">
                          Quero Continuar Aprendendo
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </motion.div>
                  )}

                  {isCartOpen && !allWatched && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/vendas">
                          Ver Oferta Especial
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CPLPage;
