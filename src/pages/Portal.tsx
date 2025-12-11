import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  BarChart3, 
  Settings, 
  LogOut,
  Play,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import LoboPlayLogo from '@/components/LoboPlayLogo';

interface EnrolledCourse {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastAccessed: string;
  instructor: string;
}

const enrolledCourses: EnrolledCourse[] = [
  {
    id: '1',
    title: 'Marketing Digital Completo',
    progress: 65,
    totalLessons: 48,
    completedLessons: 31,
    lastAccessed: 'Hoje',
    instructor: 'Carlos Silva',
  },
  {
    id: '2',
    title: 'Desenvolvimento Web Full Stack',
    progress: 30,
    totalLessons: 64,
    completedLessons: 19,
    lastAccessed: 'Ontem',
    instructor: 'Ana Santos',
  },
  {
    id: '3',
    title: 'Design UX/UI Profissional',
    progress: 100,
    totalLessons: 36,
    completedLessons: 36,
    lastAccessed: 'Há 3 dias',
    instructor: 'Pedro Costa',
  },
];

const stats = [
  { label: 'Cursos Ativos', value: '3', icon: BookOpen },
  { label: 'Horas Estudadas', value: '48h', icon: Clock },
  { label: 'Certificados', value: '1', icon: Trophy },
  { label: 'Conclusão Média', value: '65%', icon: BarChart3 },
];

const PortalPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col">
        <div className="p-6">
          <LoboPlayLogo className="h-10" />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link to="/portal">
            <Button variant="secondary" className="w-full justify-start">
              <BookOpen className="w-5 h-5 mr-3" />
              Meus Cursos
            </Button>
          </Link>
          <Link to="/portal/certificados">
            <Button variant="ghost" className="w-full justify-start">
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
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-card border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <LoboPlayLogo className="h-8" />
          <Link to="/portal/perfil">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="font-heading font-bold text-primary">JS</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
              Olá, João! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue de onde parou e alcance seus objetivos.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-4 lg:p-6 rounded-xl bg-card border border-border/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="font-heading font-bold text-2xl lg:text-3xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Continue Learning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl">Continue Aprendendo</h2>
              <Link to="/cursos">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl bg-card border border-border/50 card-hover"
                >
                  {/* Course Thumbnail */}
                  <div className="relative aspect-video rounded-lg bg-lobo-navy-light mb-4 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-lobo-slate/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {course.progress === 100 ? (
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      ) : (
                        <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg btn-glow">
                          <Play className="w-6 h-6 text-primary-foreground ml-1" />
                        </button>
                      )}
                    </div>
                    {course.progress === 100 && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium">
                        Concluído
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <h3 className="font-heading font-semibold mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    por {course.instructor}
                  </p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {course.completedLessons}/{course.totalLessons} aulas
                      </span>
                      <span className="font-medium text-primary">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  {/* Last Accessed */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Acessado: {course.lastAccessed}
                    </span>
                    <Link to={`/portal/curso/${course.id}`}>
                      <Button variant="hero" size="sm">
                        {course.progress === 100 ? 'Revisar' : 'Continuar'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 lg:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-lobo-slate/10 border border-primary/20"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Explore novos cursos
                </h3>
                <p className="text-muted-foreground">
                  Descubra mais cursos para continuar sua jornada de aprendizado.
                </p>
              </div>
              <Link to="/cursos">
                <Button variant="hero" size="lg">
                  Ver Catálogo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3">
          <Link to="/portal" className="flex flex-col items-center gap-1 text-primary">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Cursos</span>
          </Link>
          <Link to="/portal/certificados" className="flex flex-col items-center gap-1 text-muted-foreground">
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
};

export default PortalPage;
