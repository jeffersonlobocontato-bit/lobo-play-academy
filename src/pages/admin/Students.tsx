import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Search, Eye, Clock, BookOpen, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  progress: number;
  last_activity: string;
  total_watch_time: number;
  streak: number;
}

// Mock data for demonstration
const mockStudents: Student[] = [
  {
    id: '1',
    full_name: 'João Silva',
    email: 'joao@email.com',
    created_at: '2024-12-01',
    progress: 75,
    last_activity: '2024-12-10',
    total_watch_time: 3600,
    streak: 5,
  },
  {
    id: '2',
    full_name: 'Maria Santos',
    email: 'maria@email.com',
    created_at: '2024-12-03',
    progress: 45,
    last_activity: '2024-12-08',
    total_watch_time: 2100,
    streak: 3,
  },
  {
    id: '3',
    full_name: 'Pedro Oliveira',
    email: 'pedro@email.com',
    created_at: '2024-12-05',
    progress: 20,
    last_activity: '2024-12-05',
    total_watch_time: 900,
    streak: 0,
  },
];

const mockLessonProgress = [
  { lesson: 'Introdução ao DEL', completion: 95, avgWatchTime: 12, dropOff: 5 },
  { lesson: 'DNA Autoral', completion: 78, avgWatchTime: 18, dropOff: 22 },
  { lesson: 'Extração Sintática', completion: 65, avgWatchTime: 25, dropOff: 35 },
  { lesson: 'Semântica Aplicada', completion: 52, avgWatchTime: 20, dropOff: 48 },
  { lesson: 'Eliminando Alucinações', completion: 45, avgWatchTime: 22, dropOff: 55 },
];

const mockStudentActivity = [
  { date: 'Seg', minutes: 45 },
  { date: 'Ter', minutes: 30 },
  { date: 'Qua', minutes: 60 },
  { date: 'Qui', minutes: 0 },
  { date: 'Sex', minutes: 75 },
  { date: 'Sáb', minutes: 20 },
  { date: 'Dom', minutes: 0 },
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles && profiles.length > 0) {
        // Map real data with mock progress
        const studentsWithProgress = profiles.map((profile, index) => ({
          id: profile.id,
          full_name: profile.full_name || 'Sem nome',
          email: profile.email || '',
          created_at: profile.created_at,
          progress: mockStudents[index % mockStudents.length]?.progress || 0,
          last_activity: profile.updated_at,
          total_watch_time: mockStudents[index % mockStudents.length]?.total_watch_time || 0,
          streak: mockStudents[index % mockStudents.length]?.streak || 0,
        }));
        setStudents(studentsWithProgress);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatWatchTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusBadge = (progress: number, lastActivity: string) => {
    const daysSinceActivity = Math.floor(
      (Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceActivity > 7) {
      return <Badge variant="destructive">Inativo</Badge>;
    }
    if (progress >= 80) {
      return <Badge className="bg-green-500">Avançado</Badge>;
    }
    if (progress >= 40) {
      return <Badge className="bg-yellow-500 text-black">Em progresso</Badge>;
    }
    return <Badge variant="secondary">Iniciante</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Análise de Alunos</h2>
        <p className="text-muted-foreground">Comportamento e progresso dos alunos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progresso Médio</p>
                <p className="text-2xl font-bold">
                  {Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length || 0)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alunos Ativos</p>
                <p className="text-2xl font-bold">
                  {students.filter((s) => {
                    const days = Math.floor(
                      (Date.now() - new Date(s.last_activity).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return days <= 7;
                  }).length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Risco</p>
                <p className="text-2xl font-bold text-destructive">
                  {students.filter((s) => {
                    const days = Math.floor(
                      (Date.now() - new Date(s.last_activity).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return days > 7;
                  }).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lesson Performance */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Desempenho por Aula</CardTitle>
          <CardDescription>Taxa de conclusão e pontos de abandono</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockLessonProgress.map((lesson, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{lesson.lesson}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Tempo médio: {lesson.avgWatchTime}min
                    </span>
                    <Badge variant={lesson.dropOff > 30 ? 'destructive' : 'secondary'}>
                      {lesson.dropOff}% abandono
                    </Badge>
                  </div>
                </div>
                <Progress value={lesson.completion} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="card-glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Alunos</CardTitle>
              <CardDescription>Clique em um aluno para ver detalhes</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Progresso</TableHead>
                <TableHead>Tempo de Estudo</TableHead>
                <TableHead>Última Atividade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.full_name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.progress} className="w-20 h-2" />
                      <span className="text-sm">{student.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatWatchTime(student.total_watch_time)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(student.last_activity).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(student.progress, student.last_activity)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredStudents.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              Nenhum aluno encontrado
            </p>
          )}
        </CardContent>
      </Card>

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStudent?.full_name}</DialogTitle>
            <DialogDescription>{selectedStudent?.email}</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-primary">{selectedStudent.progress}%</p>
                  <p className="text-sm text-muted-foreground">Progresso</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold">{formatWatchTime(selectedStudent.total_watch_time)}</p>
                  <p className="text-sm text-muted-foreground">Tempo de Estudo</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-yellow-500">{selectedStudent.streak}</p>
                  <p className="text-sm text-muted-foreground">Dias Seguidos</p>
                </div>
              </div>

              {/* Activity Chart */}
              <div>
                <h4 className="font-medium mb-4">Atividade Semanal</h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockStudentActivity}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value) => [`${value} min`, 'Tempo']}
                      />
                      <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
