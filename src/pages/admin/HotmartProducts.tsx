import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Package, Link as LinkIcon } from 'lucide-react';

interface HotmartProduct {
  id: string;
  hotmart_product_id: string;
  product_name: string | null;
  course_id: string | null;
  created_at: string;
  courses?: {
    id: string;
    title: string;
  } | null;
}

interface Course {
  id: string;
  title: string;
}

export default function HotmartProducts() {
  const [isOpen, setIsOpen] = useState(false);
  const [hotmartProductId, setHotmartProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['hotmart-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hotmart_products')
        .select('*, courses(id, title)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as HotmartProduct[];
    },
  });

  const { data: courses } = useQuery({
    queryKey: ['courses-for-mapping'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');
      
      if (error) throw error;
      return data as Course[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('hotmart_products')
        .insert({
          hotmart_product_id: hotmartProductId,
          product_name: productName || null,
          course_id: selectedCourseId || null,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotmart-products'] });
      toast.success('Produto Hotmart mapeado com sucesso!');
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro ao mapear produto: ' + error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hotmart_products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hotmart-products'] });
      toast.success('Mapeamento removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover: ' + error.message);
    },
  });

  const resetForm = () => {
    setHotmartProductId('');
    setProductName('');
    setSelectedCourseId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotmartProductId.trim()) {
      toast.error('ID do produto Hotmart é obrigatório');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Produtos Hotmart</h1>
          <p className="text-muted-foreground">
            Mapeie produtos da Hotmart para cursos da plataforma
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Mapeamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mapear Produto Hotmart</DialogTitle>
              <DialogDescription>
                Vincule um produto da Hotmart a um curso da plataforma para automatizar matrículas.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hotmart-id">ID do Produto Hotmart *</Label>
                <Input
                  id="hotmart-id"
                  placeholder="Ex: 1234567"
                  value={hotmartProductId}
                  onChange={(e) => setHotmartProductId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Encontre o ID na URL do produto na Hotmart
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-name">Nome do Produto (opcional)</Label>
                <Input
                  id="product-name"
                  placeholder="Ex: Curso de Marketing Digital"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Curso na Plataforma</Label>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(!courses || courses.length === 0) && (
                  <p className="text-xs text-destructive">
                    Nenhum curso cadastrado. Crie um curso primeiro.
                  </p>
                )}
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Salvando...' : 'Salvar Mapeamento'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <div className="flex items-start gap-3">
          <LinkIcon className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-sm">Como funciona?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quando uma compra é confirmada na Hotmart, o webhook verifica o ID do produto 
              e matricula automaticamente o aluno no curso correspondente.
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Hotmart</TableHead>
              <TableHead>Nome do Produto</TableHead>
              <TableHead>Curso Vinculado</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[80px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : !products || products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Package className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-muted-foreground">Nenhum produto mapeado</p>
                  <p className="text-sm text-muted-foreground">
                    Clique em "Novo Mapeamento" para começar
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono text-sm">
                    {product.hotmart_product_id}
                  </TableCell>
                  <TableCell>{product.product_name || '-'}</TableCell>
                  <TableCell>
                    {product.courses?.title || (
                      <span className="text-muted-foreground">Não vinculado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(product.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
