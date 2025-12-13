import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Lock, 
  Clock,
  BookOpen
} from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  order_index: number;
  is_free: boolean;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
}

export default function CoursePage() {
  const { courseId } = useParams();
  const { user } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      return data as Course;
    },
  });

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: async () => {
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (modulesError) throw modulesError;

      // Fetch lessons for each module
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (module) => {
          const { data: lessonsData } = await supabase
            .from('lessons')
            .select('*')
            .eq('module_id', module.id)
            .order('order_index');

          // Check completion status for each lesson
          const lessonsWithProgress = await Promise.all(
            (lessonsData || []).map(async (lesson) => {
              if (!user) return { ...lesson, completed: false };
              
              const { data: progress } = await supabase
                .from('lesson_progress')
                .select('completed_at')
                .eq('lesson_id', lesson.id)
                .eq('user_id', user.id)
                .maybeSingle();

              return {
                ...lesson,
                completed: !!progress?.completed_at,
              };
            })
          );

          return {
            ...module,
            lessons: lessonsWithProgress,
          };
        })
      );

      return modulesWithLessons as Module[];
    },
    enabled: !!courseId,
  });

  const totalLessons = modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  const completedLessons = modules?.reduce(
    (acc, m) => acc + m.lessons.filter((l) => l.completed).length,
    0
  ) || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find next lesson to continue
  const findNextLesson = () => {
    if (!modules) return null;
    for (const module of modules) {
      for (const lesson of module.lessons) {
        if (!lesson.completed) {
          return { moduleId: module.id, lessonId: lesson.id };
        }
      }
    }
    // All completed, return first lesson
    if (modules[0]?.lessons[0]) {
      return { moduleId: modules[0].id, lessonId: modules[0].lessons[0].id };
    }
    return null;
  };

  const nextLesson = findNextLesson();

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  if (courseLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">Curso não encontrado</h1>
          <Link to="/portal">
            <Button variant="outline">Voltar ao Portal</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container-tight py-4">
          <div className="flex items-center gap-4">
            <Link to="/portal">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="font-heading font-bold text-lg line-clamp-1">{course.title}</h1>
              <p className="text-sm text-muted-foreground">
                {completedLessons}/{totalLessons} aulas concluídas
              </p>
            </div>
            {nextLesson && (
              <Link to={`/portal/curso/${courseId}/aula/${nextLesson.lessonId}`}>
                <Button variant="hero">
                  <Play className="w-4 h-4 mr-2" />
                  {completedLessons === 0 ? 'Começar' : 'Continuar'}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="container-tight py-6">
        {/* Progress Card */}
        <div className="p-6 rounded-xl bg-card border border-border/50 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-heading font-semibold">Seu Progresso</h2>
                <p className="text-sm text-muted-foreground">
                  {progressPercent === 100 ? 'Curso concluído!' : 'Continue aprendendo'}
                </p>
              </div>
            </div>
            <span className="font-heading text-3xl font-bold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3" />
        </div>

        {/* Course Description */}
        {course.description && (
          <div className="mb-6">
            <h2 className="font-heading font-semibold mb-2">Sobre o curso</h2>
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        )}

        {/* Modules Accordion */}
        <div className="space-y-4">
          <h2 className="font-heading font-semibold">Conteúdo do Curso</h2>
          
          {!modules || modules.length === 0 ? (
            <div className="p-8 rounded-xl bg-card border border-border/50 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">Nenhum módulo disponível</p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={[modules[0]?.id]} className="space-y-3">
              {modules.map((module, moduleIndex) => {
                const moduleCompletedLessons = module.lessons.filter((l) => l.completed).length;
                const moduleProgress = module.lessons.length > 0 
                  ? Math.round((moduleCompletedLessons / module.lessons.length) * 100) 
                  : 0;

                return (
                  <AccordionItem 
                    key={module.id} 
                    value={module.id}
                    className="rounded-xl bg-card border border-border/50 overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="font-heading font-bold text-sm text-primary">
                            {moduleIndex + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-heading font-semibold text-sm">{module.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {moduleCompletedLessons}/{module.lessons.length} aulas • {moduleProgress}% concluído
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 mt-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <Link
                            key={lesson.id}
                            to={`/portal/curso/${courseId}/aula/${lesson.id}`}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : lesson.is_free ? (
                                <Play className="w-5 h-5 text-primary" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{lesson.title}</p>
                              {lesson.duration_seconds && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(lesson.duration_seconds)}
                                </p>
                              )}
                            </div>
                            {lesson.is_free && !lesson.completed && (
                              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                Grátis
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </main>
    </div>
  );
}
