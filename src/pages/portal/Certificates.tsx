import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import LoboPlayLogo from '@/components/LoboPlayLogo';
import { 
  ArrowLeft,
  Trophy, 
  Download,
  Calendar,
  BookOpen,
  Settings,
  LogOut
} from 'lucide-react';

interface CompletedCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  completed_at: string;
}

export default function Certificates() {
  const { user, signOut } = useAuth();

  const { data: completedCourses, isLoading } = useQuery({
    queryKey: ['completed-courses', user?.id],
    queryFn: async () => {
      // Get user's enrollments
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id, completed_at')
        .eq('user_id', user!.id)
        .not('completed_at', 'is', null);
      
      if (enrollmentsError) throw enrollmentsError;
      if (!enrollments || enrollments.length === 0) return [];

      // Get course details
      const courseIds = enrollments.map(e => e.course_id);
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .in('id', courseIds);
      
      if (coursesError) throw coursesError;

      // Combine data
      return enrollments.map(enrollment => {
        const course = courses?.find(c => c.id === enrollment.course_id);
        return {
          id: course?.id || '',
          title: course?.title || 'Curso',
          description: course?.description,
          thumbnail_url: course?.thumbnail_url,
          completed_at: enrollment.completed_at,
        };
      }).filter(c => c.id) as CompletedCourse[];
    },
    enabled: !!user,
  });

  const handleDownloadCertificate = (course: CompletedCourse) => {
    // TODO: Implement certificate generation
    // For now, show a placeholder message
    alert(`Certificado de "${course.title}" será gerado em breve!`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col">
        <div className="p-6">
          <LoboPlayLogo className="h-10" />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link to="/portal">
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="w-5 h-5 mr-3" />
              Meus Cursos
            </Button>
          </Link>
          <Link to="/portal/certificados">
            <Button variant="secondary" className="w-full justify-start">
              <Trophy className="w-5 h-5 mr-3" />
              Certificados
            </Button>
          </Link>
          <Link to="/portal/perfil">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-3" />
              Meu Perfil
            </Button>
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center gap-4 p-4">
          <Link to="/portal">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-heading font-bold">Certificados</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
              Meus Certificados
            </h1>
            <p className="text-muted-foreground">
              Certificados dos cursos que você concluiu
            </p>
          </div>

          {isLoading ? (
            <div className="animate-pulse text-muted-foreground">Carregando...</div>
          ) : !completedCourses || completedCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-primary/50" />
              </div>
              <h2 className="font-heading font-semibold text-xl mb-2">
                Nenhum certificado ainda
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Complete um curso para receber seu certificado de conclusão
              </p>
              <Link to="/portal">
                <Button variant="hero">Ver meus cursos</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {completedCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 rounded-xl bg-card border border-border/50 card-hover"
                >
                  {/* Certificate Preview */}
                  <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-br from-primary/20 via-background to-lobo-slate/20 border border-primary/20 mb-4 flex items-center justify-center">
                    <div className="text-center p-4">
                      <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="font-heading font-bold text-sm">Certificado de Conclusão</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {course.title}
                      </p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <h3 className="font-heading font-semibold mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Concluído em {new Date(course.completed_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleDownloadCertificate(course)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Certificado
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3">
          <Link to="/portal" className="flex flex-col items-center gap-1 text-muted-foreground">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Cursos</span>
          </Link>
          <Link to="/portal/certificados" className="flex flex-col items-center gap-1 text-primary">
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Certificados</span>
          </Link>
          <Link to="/portal/perfil" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
