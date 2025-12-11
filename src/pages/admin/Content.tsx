import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, Loader2, Plus, Trash2, GripVertical } from 'lucide-react';

interface LandingContent {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaUrl: string;
  };
  features: {
    title: string;
    subtitle: string;
  };
  course: {
    price: string;
    originalPrice: string;
    ctaUrl: string;
  };
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  is_active: boolean;
  order_index: number;
}

const defaultContent: LandingContent = {
  hero: {
    badge: '🔥 ÚLTIMO DIA COM 95% OFF',
    title: 'O Código Invisível dos SuperAgentes de IA',
    subtitle: 'Domine o Método DEL e crie Agentes de IA com DNA Autoral que nunca alucinam',
    ctaText: 'QUERO CRIAR MEU SUPERAGENTE',
    ctaUrl: 'https://hotmart.com/pt-br/marketplace/produtos/o-codigo-invisivel-dos-superagentes-de-inteligencia-artificial/O101044688E',
  },
  features: {
    title: 'Por que o Método DEL é Diferente?',
    subtitle: 'A única metodologia brasileira que garante agentes sem alucinações',
  },
  course: {
    price: 'R$ 14,00',
    originalPrice: 'R$ 297,00',
    ctaUrl: 'https://hotmart.com/pt-br/marketplace/produtos/o-codigo-invisivel-dos-superagentes-de-inteligencia-artificial/O101044688E',
  },
};

export default function Content() {
  const [content, setContent] = useState<LandingContent>(defaultContent);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContent();
    fetchTestimonials();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('landing_content')
        .select('*');

      if (data && data.length > 0) {
        const contentMap: Record<string, any> = {};
        data.forEach((item) => {
          contentMap[item.section_key] = item.content;
        });

        setContent({
          hero: contentMap.hero || defaultContent.hero,
          features: contentMap.features || defaultContent.features,
          course: contentMap.course || defaultContent.course,
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('order_index');

      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const saveContent = async (sectionKey: string, sectionContent: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('landing_content')
        .upsert({
          section_key: sectionKey,
          content: sectionContent,
        }, {
          onConflict: 'section_key',
        });

      if (error) throw error;

      toast({
        title: 'Conteúdo salvo!',
        description: 'As alterações foram salvas com sucesso.',
      });
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

  const saveTestimonial = async (testimonial: Partial<Testimonial>) => {
    try {
      if (testimonial.id) {
        const { error } = await supabase
          .from('testimonials')
          .update({
            name: testimonial.name,
            role: testimonial.role,
            content: testimonial.content,
            rating: testimonial.rating,
            is_active: testimonial.is_active,
          })
          .eq('id', testimonial.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert({
            name: testimonial.name || '',
            role: testimonial.role,
            content: testimonial.content || '',
            rating: testimonial.rating,
            is_active: testimonial.is_active,
          });

        if (error) throw error;
      }

      fetchTestimonials();
      toast({
        title: 'Depoimento salvo!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      fetchTestimonials();
      toast({
        title: 'Depoimento removido!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const addNewTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: '',
      name: 'Novo Depoimento',
      role: 'Cargo/Empresa',
      content: 'Escreva o depoimento aqui...',
      rating: 5,
      is_active: true,
      order_index: testimonials.length,
    };
    setTestimonials([...testimonials, newTestimonial]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Conteúdo</h2>
        <p className="text-muted-foreground">Edite os textos da landing page</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="course">Curso</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Primeira seção da landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-badge">Badge de Urgência</Label>
                <Input
                  id="hero-badge"
                  value={content.hero.badge}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, badge: e.target.value }
                  })}
                  placeholder="🔥 ÚLTIMO DIA COM 95% OFF"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-title">Título Principal</Label>
                <Input
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Subtítulo</Label>
                <Textarea
                  id="hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-cta">Texto do Botão</Label>
                  <Input
                    id="hero-cta"
                    value={content.hero.ctaText}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, ctaText: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hero-url">URL do Botão</Label>
                  <Input
                    id="hero-url"
                    value={content.hero.ctaUrl}
                    onChange={(e) => setContent({
                      ...content,
                      hero: { ...content.hero, ctaUrl: e.target.value }
                    })}
                  />
                </div>
              </div>

              <Button 
                onClick={() => saveContent('hero', content.hero)}
                disabled={saving}
                className="btn-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
              <CardDescription>Seção de benefícios e diferenciais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="features-title">Título</Label>
                <Input
                  id="features-title"
                  value={content.features.title}
                  onChange={(e) => setContent({
                    ...content,
                    features: { ...content.features, title: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features-subtitle">Subtítulo</Label>
                <Textarea
                  id="features-subtitle"
                  value={content.features.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    features: { ...content.features, subtitle: e.target.value }
                  })}
                  rows={2}
                />
              </div>

              <Button 
                onClick={() => saveContent('features', content.features)}
                disabled={saving}
                className="btn-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Features
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Section */}
        <TabsContent value="course">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
              <CardDescription>Preço e link de compra</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course-price">Preço Atual</Label>
                  <Input
                    id="course-price"
                    value={content.course.price}
                    onChange={(e) => setContent({
                      ...content,
                      course: { ...content.course, price: e.target.value }
                    })}
                    placeholder="R$ 14,00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course-original">Preço Original (riscado)</Label>
                  <Input
                    id="course-original"
                    value={content.course.originalPrice}
                    onChange={(e) => setContent({
                      ...content,
                      course: { ...content.course, originalPrice: e.target.value }
                    })}
                    placeholder="R$ 297,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course-url">URL de Checkout (Hotmart)</Label>
                <Input
                  id="course-url"
                  value={content.course.ctaUrl}
                  onChange={(e) => setContent({
                    ...content,
                    course: { ...content.course, ctaUrl: e.target.value }
                  })}
                />
              </div>

              <Button 
                onClick={() => saveContent('course', content.course)}
                disabled={saving}
                className="btn-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Curso
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials */}
        <TabsContent value="testimonials">
          <Card className="card-glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Depoimentos</CardTitle>
                  <CardDescription>Gerenciar depoimentos de alunos</CardDescription>
                </div>
                <Button onClick={addNewTestimonial} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.id || index} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <span className="text-sm text-muted-foreground">#{index + 1}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => testimonial.id && deleteTestimonial(testimonial.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input
                          value={testimonial.name}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index] = { ...testimonial, name: e.target.value };
                            setTestimonials(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cargo/Empresa</Label>
                        <Input
                          value={testimonial.role || ''}
                          onChange={(e) => {
                            const updated = [...testimonials];
                            updated[index] = { ...testimonial, role: e.target.value };
                            setTestimonials(updated);
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Depoimento</Label>
                      <Textarea
                        value={testimonial.content}
                        onChange={(e) => {
                          const updated = [...testimonials];
                          updated[index] = { ...testimonial, content: e.target.value };
                          setTestimonials(updated);
                        }}
                        rows={3}
                      />
                    </div>

                    <Button 
                      onClick={() => saveTestimonial(testimonial)}
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </Card>
              ))}

              {testimonials.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum depoimento cadastrado
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
