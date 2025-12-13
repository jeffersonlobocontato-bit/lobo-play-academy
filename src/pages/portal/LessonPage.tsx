import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  List,
  Play,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_seconds: number | null;
  order_index: number;
  module_id: string;
}

interface LessonWithProgress extends Lesson {
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  course_id: string;
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Video progress tracking
  const videoRef = useRef<HTMLVideoElement>(null);
  const [watchProgress, setWatchProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const lastSavedPositionRef = useRef(0);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch current lesson
  const { data: lesson, isLoading: lessonLoading } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (error) throw error;
      return data as Lesson;
    },
  });

  // Fetch module info
  const { data: module } = useQuery({
    queryKey: ['module', lesson?.module_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .eq('id', lesson!.module_id)
        .single();
      
      if (error) throw error;
      return data as Module;
    },
    enabled: !!lesson?.module_id,
  });

  // Fetch all lessons in the course for navigation
  const { data: allLessons } = useQuery({
    queryKey: ['course-all-lessons', courseId],
    queryFn: async () => {
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id, title, order_index')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (modulesError) throw modulesError;

      const lessonsWithModules: (LessonWithProgress & { module_title: string })[] = [];
      
      for (const mod of modules) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('module_id', mod.id)
          .order('order_index');

        for (const lesson of lessons || []) {
          let completed = false;
          if (user) {
            const { data: progress } = await supabase
              .from('lesson_progress')
              .select('completed_at')
              .eq('lesson_id', lesson.id)
              .eq('user_id', user.id)
              .maybeSingle();
            completed = !!progress?.completed_at;
          }
          lessonsWithModules.push({
            ...lesson,
            module_title: mod.title,
            completed,
          });
        }
      }

      return lessonsWithModules;
    },
    enabled: !!courseId,
  });

  // Check if current lesson is completed
  const { data: lessonProgress } = useQuery({
    queryKey: ['lesson-progress', lessonId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('*')
        .eq('lesson_id', lessonId)
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user && !!lessonId,
  });

  const isCompleted = !!lessonProgress?.completed_at;

  // Mark lesson as complete mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!user || !lessonId) return;

      if (lessonProgress) {
        // Update existing progress
        const { error } = await supabase
          .from('lesson_progress')
          .update({ completed_at: new Date().toISOString() })
          .eq('id', lessonProgress.id);
        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from('lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            completed_at: new Date().toISOString(),
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lesson-progress'] });
      queryClient.invalidateQueries({ queryKey: ['course-all-lessons'] });
      queryClient.invalidateQueries({ queryKey: ['course-modules'] });
      toast.success('Aula marcada como concluída!');
    },
    onError: () => {
      toast.error('Erro ao marcar aula como concluída');
    },
  });

  // Save video progress to database
  const saveProgress = useCallback(async (currentTime: number, duration: number) => {
    if (!user || !lessonId || duration === 0) return;
    
    const progressPercent = (currentTime / duration) * 100;
    const watchTimeIncrement = Math.floor(currentTime - lastSavedPositionRef.current);
    
    if (watchTimeIncrement < 5) return; // Only save if at least 5 seconds passed
    
    try {
      if (lessonProgress) {
        await supabase
          .from('lesson_progress')
          .update({
            last_position_seconds: Math.floor(currentTime),
            watch_time_seconds: (lessonProgress.watch_time_seconds || 0) + watchTimeIncrement,
          })
          .eq('id', lessonProgress.id);
      } else {
        await supabase
          .from('lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lessonId,
            last_position_seconds: Math.floor(currentTime),
            watch_time_seconds: Math.floor(currentTime),
          });
        queryClient.invalidateQueries({ queryKey: ['lesson-progress', lessonId, user.id] });
      }
      lastSavedPositionRef.current = currentTime;
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  }, [user, lessonId, lessonProgress, queryClient]);

  // Handle video time update
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setWatchProgress((currentTime / duration) * 100);
    }
  }, []);

  // Handle video duration change
  const handleDurationChange = useCallback(() => {
    if (!videoRef.current) return;
    setVideoDuration(videoRef.current.duration);
  }, []);

  // Handle video loaded - restore position
  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current || !lessonProgress?.last_position_seconds) return;
    const savedPosition = lessonProgress.last_position_seconds;
    if (savedPosition > 0 && savedPosition < videoRef.current.duration - 5) {
      videoRef.current.currentTime = savedPosition;
      lastSavedPositionRef.current = savedPosition;
    }
  }, [lessonProgress?.last_position_seconds]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    saveIntervalRef.current = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        saveProgress(videoRef.current.currentTime, videoRef.current.duration);
      }
    }, 30000);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [saveProgress]);

  // Save progress when leaving the page
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        saveProgress(videoRef.current.currentTime, videoRef.current.duration);
      }
    };
  }, [saveProgress]);

  // Reset progress when lesson changes
  useEffect(() => {
    setWatchProgress(0);
    setVideoDuration(0);
    lastSavedPositionRef.current = 0;
  }, [lessonId]);

  // Find prev/next lessons
  const currentIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentIndex > 0 ? allLessons?.[currentIndex - 1] : null;
  const nextLesson = currentIndex < (allLessons?.length ?? 0) - 1 ? allLessons?.[currentIndex + 1] : null;

  // Parse video URL for embed
  const getVideoEmbed = (url: string | null) => {
    if (!url) return null;

    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Direct video URL
    return url;
  };

  const videoEmbed = getVideoEmbed(lesson?.video_url || null);

  if (lessonLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">Aula não encontrada</h1>
          <Link to={`/portal/curso/${courseId}`}>
            <Button variant="outline">Voltar ao Curso</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link to={`/portal/curso/${courseId}`} className="flex items-center gap-2 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao curso
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
          <h2 className="font-heading font-semibold text-sm mb-4">Conteúdo do Curso</h2>
          <div className="space-y-1">
            {allLessons?.map((l, index) => (
              <Link
                key={l.id}
                to={`/portal/curso/${courseId}/aula/${l.id}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  l.id === lessonId 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-muted/50"
                )}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  {l.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span className="text-sm line-clamp-2">{l.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center gap-4 p-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <List className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{module?.title}</p>
              <h1 className="font-heading font-bold line-clamp-1">{lesson.title}</h1>
              {videoDuration > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={watchProgress} className="h-1.5 flex-1 max-w-xs" />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {Math.round(watchProgress)}% assistido
                  </span>
                </div>
              )}
            </div>
            <Button
              variant={isCompleted ? "outline" : "hero"}
              onClick={() => !isCompleted && completeMutation.mutate()}
              disabled={isCompleted || completeMutation.isPending}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Concluída
                </>
              ) : (
                'Marcar como concluída'
              )}
            </Button>
          </div>
        </header>

        {/* Video Player */}
        <div className="flex-1">
          <div className="aspect-video bg-black">
            {videoEmbed ? (
              videoEmbed.includes('youtube') || videoEmbed.includes('vimeo') ? (
                <iframe
                  src={videoEmbed}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video 
                  ref={videoRef}
                  src={videoEmbed} 
                  controls 
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onDurationChange={handleDurationChange}
                  onLoadedMetadata={handleLoadedMetadata}
                  onPause={() => saveProgress(videoRef.current?.currentTime || 0, videoRef.current?.duration || 0)}
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p>Vídeo não disponível</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content */}
          <div className="p-6 max-w-4xl mx-auto">
            {lesson.description && (
              <div className="mb-8">
                <h2 className="font-heading font-semibold mb-2">Sobre esta aula</h2>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              {prevLesson ? (
                <Link to={`/portal/curso/${courseId}/aula/${prevLesson.id}`}>
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link to={`/portal/curso/${courseId}/aula/${nextLesson.id}`}>
                  <Button variant="hero">
                    Próxima
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to={`/portal/curso/${courseId}`}>
                  <Button variant="hero">
                    Finalizar Curso
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
