import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Video, Trash2, Edit, GripVertical, Save, Loader2 } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  duration_seconds: number;
  order_index: number;
  is_free: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnail_url: string | null;
  video_url: string | null;
  hotmart_url: string | null;
  is_published: boolean;
  modules: Module[];
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail_url: '',
    video_url: '',
    hotmart_url: '',
    is_published: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch modules for each course
      const coursesWithModules = await Promise.all(
        (coursesData || []).map(async (course) => {
          const { data: modulesData } = await supabase
            .from('modules')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index');

          // Fetch lessons for each module
          const modulesWithLessons = await Promise.all(
            (modulesData || []).map(async (module) => {
              const { data: lessonsData } = await supabase
                .from('lessons')
                .select('*')
                .eq('module_id', module.id)
                .order('order_index');

              return { ...module, lessons: lessonsData || [] };
            })
          );

          return { ...course, modules: modulesWithLessons };
        })
      );

      setCourses(coursesWithModules);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar cursos',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCourse = async () => {
    setSaving(true);
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(formData)
          .eq('id', editingCourse.id);

        if (error) throw error;
        toast({ title: 'Curso atualizado!' });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert(formData);

        if (error) throw error;
        toast({ title: 'Curso criado!' });
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Curso removido!' });
      fetchCourses();
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: isPublished })
        .eq('id', id);

      if (error) throw error;
      fetchCourses();
      toast({ 
        title: isPublished ? 'Curso publicado!' : 'Curso despublicado' 
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      thumbnail_url: '',
      video_url: '',
      hotmart_url: '',
      is_published: false,
    });
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      price: course.price,
      thumbnail_url: course.thumbnail_url || '',
      video_url: course.video_url || '',
      hotmart_url: course.hotmart_url || '',
      is_published: course.is_published,
    });
    setIsDialogOpen(true);
  };

  const addModule = async (courseId: string) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      const orderIndex = course?.modules.length || 0;

      const { error } = await supabase
        .from('modules')
        .insert({
          course_id: courseId,
          title: 'Novo Módulo',
          order_index: orderIndex,
        });

      if (error) throw error;
      fetchCourses();
      toast({ title: 'Módulo adicionado!' });
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar módulo',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addLesson = async (moduleId: string) => {
    try {
      const module = courses
        .flatMap((c) => c.modules)
        .find((m) => m.id === moduleId);
      const orderIndex = module?.lessons.length || 0;

      const { error } = await supabase
        .from('lessons')
        .insert({
          module_id: moduleId,
          title: 'Nova Aula',
          order_index: orderIndex,
        });

      if (error) throw error;
      fetchCourses();
      toast({ title: 'Aula adicionada!' });
    } catch (error: any) {
      toast({
        title: 'Erro ao adicionar aula',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}min`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciar Cursos</h2>
          <p className="text-muted-foreground">Crie e edite cursos, módulos e aulas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCourse(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Editar Curso' : 'Novo Curso'}</DialogTitle>
              <DialogDescription>
                Preencha as informações do curso
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="O Código Invisível dos SuperAgentes"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do curso..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotmart">URL Hotmart</Label>
                  <Input
                    id="hotmart"
                    value={formData.hotmart_url}
                    onChange={(e) => setFormData({ ...formData, hotmart_url: e.target.value })}
                    placeholder="https://hotmart.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">URL do Vídeo de Apresentação</Label>
                <Input
                  id="video"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
                <Label htmlFor="published">Publicar curso</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveCourse} disabled={saving} className="btn-glow">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                {editingCourse ? 'Salvar Alterações' : 'Criar Curso'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course.id} className="card-glass">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>{course.title}</CardTitle>
                      <Badge variant={course.is_published ? 'default' : 'secondary'}>
                        {course.is_published ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </div>
                    <CardDescription className="mt-1">
                      {course.modules.length} módulos • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} aulas
                    </CardDescription>
                    <p className="text-sm font-semibold text-primary mt-2">
                      R$ {course.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={course.is_published}
                    onCheckedChange={(checked) => togglePublish(course.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCourse(course.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <span>Módulo {moduleIndex + 1}: {module.title}</span>
                        <Badge variant="outline" className="ml-2">
                          {module.lessons.length} aulas
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <span>Aula {lessonIndex + 1}: {lesson.title}</span>
                              {lesson.is_free && (
                                <Badge variant="secondary">Grátis</Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatDuration(lesson.duration_seconds)}
                            </span>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addLesson(module.id)}
                          className="w-full mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Aula
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <Button
                variant="outline"
                size="sm"
                onClick={() => addModule(course.id)}
                className="w-full mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Módulo
              </Button>
            </CardContent>
          </Card>
        ))}

        {courses.length === 0 && !loading && (
          <Card className="card-glass">
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Nenhum curso criado</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro curso para começar
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="btn-glow">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Curso
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
