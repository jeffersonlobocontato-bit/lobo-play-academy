import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  TrendingUp, 
  MousePointerClick, 
  DollarSign,
  Mail,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardStats {
  totalLeads: number;
  totalStudents: number;
  pageViews: number;
  ctaClicks: number;
  conversionRate: number;
  recentLeads: { name: string; email: string; created_at: string }[];
}

const mockChartData = [
  { name: 'Seg', visitas: 120, leads: 8, cliques: 45 },
  { name: 'Ter', visitas: 150, leads: 12, cliques: 52 },
  { name: 'Qua', visitas: 180, leads: 15, cliques: 68 },
  { name: 'Qui', visitas: 140, leads: 10, cliques: 42 },
  { name: 'Sex', visitas: 200, leads: 18, cliques: 78 },
  { name: 'Sáb', visitas: 90, leads: 5, cliques: 30 },
  { name: 'Dom', visitas: 75, leads: 3, cliques: 25 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalStudents: 0,
    pageViews: 0,
    ctaClicks: 0,
    conversionRate: 0,
    recentLeads: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true });

      // Fetch enrollments count (students)
      const { count: studentsCount } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true });

      // Fetch page views
      const { count: viewsCount } = await supabase
        .from('page_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_view');

      // Fetch CTA clicks
      const { count: clicksCount } = await supabase
        .from('page_events')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'cta_click');

      // Fetch recent leads
      const { data: recentLeads } = await supabase
        .from('leads')
        .select('name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const conversionRate = viewsCount && viewsCount > 0 
        ? ((leadsCount || 0) / viewsCount * 100).toFixed(1) 
        : '0';

      setStats({
        totalLeads: leadsCount || 0,
        totalStudents: studentsCount || 0,
        pageViews: viewsCount || 0,
        ctaClicks: clicksCount || 0,
        conversionRate: parseFloat(conversionRate),
        recentLeads: recentLeads || [],
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Leads',
      value: stats.totalLeads,
      change: '+12%',
      trend: 'up',
      icon: Mail,
      description: 'E-books baixados',
    },
    {
      title: 'Alunos Ativos',
      value: stats.totalStudents,
      change: '+5%',
      trend: 'up',
      icon: Users,
      description: 'Matrículas ativas',
    },
    {
      title: 'Visualizações',
      value: stats.pageViews,
      change: '+18%',
      trend: 'up',
      icon: Eye,
      description: 'Landing page',
    },
    {
      title: 'Cliques no CTA',
      value: stats.ctaClicks,
      change: '-3%',
      trend: 'down',
      icon: MousePointerClick,
      description: 'Botão de compra',
    },
    {
      title: 'Taxa de Conversão',
      value: `${stats.conversionRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      description: 'Visita → Lead',
    },
    {
      title: 'Receita Estimada',
      value: 'R$ 196,00',
      change: '+8%',
      trend: 'up',
      icon: DollarSign,
      description: 'Últimos 30 dias',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do desempenho da sua plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => (
          <Card key={index} className="card-glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">vs semana anterior</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Visitas e Leads</CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData}>
                  <defs>
                    <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="visitas" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorVisitas)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Conversões por Dia</CardTitle>
            <CardDescription>Leads e cliques no CTA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cliques" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Leads Recentes</CardTitle>
          <CardDescription>Últimos e-books baixados</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentLeads.length > 0 ? (
            <div className="space-y-4">
              {stats.recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhum lead capturado ainda. Compartilhe sua landing page!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
