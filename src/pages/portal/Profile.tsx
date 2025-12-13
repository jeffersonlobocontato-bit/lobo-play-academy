import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoboPlayLogo from '@/components/LoboPlayLogo';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Trophy, 
  BookOpen,
  Settings,
  LogOut,
  User,
  Mail,
  Flame,
  Star,
  Save
} from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState('');

  // Fetch profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch user streaks
  const { data: streaks } = useQuery({
    queryKey: ['user-streaks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch completed courses count
  const { data: completedCoursesCount } = useQuery({
    queryKey: ['completed-courses-count', user?.id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .not('completed_at', 'is', null);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('user_id', user!.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil');
    },
  });

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  const stats = [
    { 
      label: 'XP Total', 
      value: streaks?.total_xp || 0, 
      icon: Star,
      color: 'text-yellow-500'
    },
    { 
      label: 'Streak Atual', 
      value: `${streaks?.current_streak || 0} dias`, 
      icon: Flame,
      color: 'text-orange-500'
    },
    { 
      label: 'Maior Streak', 
      value: `${streaks?.longest_streak || 0} dias`, 
      icon: Flame,
      color: 'text-red-500'
    },
    { 
      label: 'Cursos Concluídos', 
      value: completedCoursesCount || 0, 
      icon: Trophy,
      color: 'text-primary'
    },
  ];

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
            <Button variant="ghost" className="w-full justify-start">
              <Trophy className="w-5 h-5 mr-3" />
              Certificados
            </Button>
          </Link>
          <Link to="/portal/perfil">
            <Button variant="secondary" className="w-full justify-start">
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
          <h1 className="font-heading font-bold">Meu Perfil</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="font-heading text-2xl lg:text-3xl font-bold mb-2">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais
            </p>
          </div>

          {/* Avatar Section */}
          <div className="p-6 rounded-xl bg-card border border-border/50 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="font-heading font-bold text-2xl text-primary">
                  {fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg">
                  {fullName || 'Usuário'}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-card border border-border/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="font-heading font-bold text-2xl">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          <div className="p-6 rounded-xl bg-card border border-border/50">
            <h2 className="font-heading font-semibold mb-4">Editar Informações</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    value={user?.email || ''}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  O e-mail não pode ser alterado
                </p>
              </div>

              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 p-6 rounded-xl bg-destructive/10 border border-destructive/20">
            <h2 className="font-heading font-semibold text-destructive mb-2">Zona de Perigo</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Ações irreversíveis. Tenha cuidado.
            </p>
            <Button 
              variant="destructive" 
              onClick={signOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="flex items-center justify-around py-3">
          <Link to="/portal" className="flex flex-col items-center gap-1 text-muted-foreground">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Cursos</span>
          </Link>
          <Link to="/portal/certificados" className="flex flex-col items-center gap-1 text-muted-foreground">
            <Trophy className="w-5 h-5" />
            <span className="text-xs">Certificados</span>
          </Link>
          <Link to="/portal/perfil" className="flex flex-col items-center gap-1 text-primary">
            <Settings className="w-5 h-5" />
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
