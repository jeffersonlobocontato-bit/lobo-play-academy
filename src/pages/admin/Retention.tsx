import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  Trophy, 
  Flame, 
  Award,
  Users,
  Clock,
  RotateCcw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// Mock data for retention metrics
const retentionData = [
  { week: 'Sem 1', retained: 100, churned: 0 },
  { week: 'Sem 2', retained: 85, churned: 15 },
  { week: 'Sem 3', retained: 72, churned: 13 },
  { week: 'Sem 4', retained: 65, churned: 7 },
  { week: 'Sem 5', retained: 58, churned: 7 },
  { week: 'Sem 6', retained: 55, churned: 3 },
  { week: 'Sem 7', retained: 52, churned: 3 },
  { week: 'Sem 8', retained: 50, churned: 2 },
];

const cohortData = [
  { cohort: 'Dez/24', week1: 100, week2: 85, week3: 72, week4: 65 },
  { cohort: 'Nov/24', week1: 100, week2: 82, week3: 68, week4: 60 },
  { cohort: 'Out/24', week1: 100, week2: 88, week3: 75, week4: 68 },
];

const badges = [
  { id: 1, name: 'Primeira Aula', description: 'Completou a primeira aula', icon: '🎯', earned: 45 },
  { id: 2, name: 'Semana Intensa', description: '7 dias seguidos de estudo', icon: '🔥', earned: 23 },
  { id: 3, name: 'Mestre DEL', description: 'Completou módulo 1', icon: '🏆', earned: 18 },
  { id: 4, name: 'Estudante Dedicado', description: '10 horas de estudo', icon: '📚', earned: 12 },
  { id: 5, name: 'Conclusão Perfeita', description: 'Completou o curso', icon: '🎓', earned: 8 },
];

const topStudents = [
  { name: 'João Silva', streak: 15, xp: 2450, position: 1 },
  { name: 'Maria Santos', streak: 12, xp: 2100, position: 2 },
  { name: 'Pedro Oliveira', streak: 10, xp: 1850, position: 3 },
  { name: 'Ana Costa', streak: 8, xp: 1620, position: 4 },
  { name: 'Carlos Lima', streak: 7, xp: 1450, position: 5 },
];

export default function Retention() {
  const [stats, setStats] = useState({
    churnRate: 8.5,
    avgSessionDuration: '12:30',
    returnRate: 65,
    completionRate: 42,
    avgStreak: 4.2,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Retenção de Alunos</h2>
        <p className="text-muted-foreground">Métricas de engajamento e gamificação</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Churn</p>
                <p className="text-2xl font-bold text-destructive">{stats.churnRate}%</p>
              </div>
              <TrendingDown className="h-8 w-8 text-destructive opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Mensal</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sessão Média</p>
                <p className="text-2xl font-bold">{stats.avgSessionDuration}</p>
              </div>
              <Clock className="h-8 w-8 text-primary opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Por acesso</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Retorno</p>
                <p className="text-2xl font-bold text-green-500">{stats.returnRate}%</p>
              </div>
              <RotateCcw className="h-8 w-8 text-green-500 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Semanal</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conclusão</p>
                <p className="text-2xl font-bold text-primary">{stats.completionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Do curso</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Streak Médio</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.avgStreak}</p>
              </div>
              <Flame className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Retention Curve */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Curva de Retenção</CardTitle>
            <CardDescription>Percentual de alunos retidos ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionData}>
                  <defs>
                    <linearGradient id="colorRetained" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${value}%`, 'Retidos']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="retained" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorRetained)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cohort Analysis */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Análise de Cohort</CardTitle>
            <CardDescription>Retenção por mês de entrada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2">Cohort</th>
                    <th className="text-center py-2 px-2">Sem 1</th>
                    <th className="text-center py-2 px-2">Sem 2</th>
                    <th className="text-center py-2 px-2">Sem 3</th>
                    <th className="text-center py-2 px-2">Sem 4</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((row, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-2 font-medium">{row.cohort}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center">
                          <div 
                            className="px-3 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `hsl(var(--primary) / ${row.week1 / 100})`,
                              color: row.week1 > 50 ? 'hsl(var(--primary-foreground))' : 'inherit'
                            }}
                          >
                            {row.week1}%
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center">
                          <div 
                            className="px-3 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `hsl(var(--primary) / ${row.week2 / 100})`,
                              color: row.week2 > 50 ? 'hsl(var(--primary-foreground))' : 'inherit'
                            }}
                          >
                            {row.week2}%
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center">
                          <div 
                            className="px-3 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `hsl(var(--primary) / ${row.week3 / 100})`,
                              color: row.week3 > 50 ? 'hsl(var(--primary-foreground))' : 'inherit'
                            }}
                          >
                            {row.week3}%
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center">
                          <div 
                            className="px-3 py-1 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: `hsl(var(--primary) / ${row.week4 / 100})`,
                              color: row.week4 > 50 ? 'hsl(var(--primary-foreground))' : 'inherit'
                            }}
                          >
                            {row.week4}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Badges */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Conquistas (Badges)
            </CardTitle>
            <CardDescription>Badges conquistados pelos alunos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {badges.map((badge) => (
                <div key={badge.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="font-medium">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{badge.earned} alunos</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Ranking de Alunos
            </CardTitle>
            <CardDescription>Top 5 alunos mais engajados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStudents.map((student) => (
                <div key={student.position} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      student.position === 1 ? 'bg-yellow-500 text-black' :
                      student.position === 2 ? 'bg-gray-300 text-black' :
                      student.position === 3 ? 'bg-amber-700 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {student.position}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Flame className="h-3 w-3 text-orange-500" />
                        {student.streak} dias
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{student.xp.toLocaleString()} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Tips */}
      <Card className="card-glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">🎯 Estratégias de Retenção</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              Streaks (Sequências)
            </h4>
            <p className="text-muted-foreground">
              Alunos com streak ativo têm 3x mais chance de concluir o curso. 
              Envie notificações para manter a sequência.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Badges e Conquistas
            </h4>
            <p className="text-muted-foreground">
              Gamificação aumenta engajamento em 40%. 
              Crie badges para marcos importantes.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              Metas Semanais
            </h4>
            <p className="text-muted-foreground">
              Defina metas alcançáveis como "Complete 2 aulas esta semana" 
              para manter o ritmo.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              Comunidade
            </h4>
            <p className="text-muted-foreground">
              Alunos em grupos de estudo têm 50% menos churn. 
              Considere criar uma comunidade.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
