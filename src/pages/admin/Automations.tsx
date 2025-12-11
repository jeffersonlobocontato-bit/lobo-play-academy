import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Zap, Mail, MessageCircle, Webhook, Clock, Trash2, Edit } from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger_type: string;
  condition_days: number;
  action_type: string;
  message_template: string | null;
  is_active: boolean;
  created_at: string;
}

const triggerTypes = [
  { value: 'inactive_student', label: 'Aluno Inativo', icon: Clock },
  { value: 'module_stuck', label: 'Travou no Módulo', icon: Zap },
  { value: 'drop_off', label: 'Abandono de Aula', icon: Zap },
  { value: 'course_almost_complete', label: 'Curso Quase Completo', icon: Zap },
  { value: 'course_complete', label: 'Curso Completo', icon: Zap },
  { value: 'new_lead', label: 'Novo Lead', icon: Mail },
];

const actionTypes = [
  { value: 'email', label: 'Enviar Email', icon: Mail },
  { value: 'whatsapp', label: 'Enviar WhatsApp', icon: MessageCircle },
  { value: 'webhook', label: 'Webhook (Zapier/Make)', icon: Webhook },
];

export default function Automations() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    trigger_type: '',
    condition_days: 3,
    action_type: '',
    message_template: '',
    is_active: true,
  });

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRules(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar automações',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRule = async () => {
    try {
      if (editingRule) {
        const { error } = await supabase
          .from('automation_rules')
          .update(formData)
          .eq('id', editingRule.id);

        if (error) throw error;
        toast({ title: 'Automação atualizada!' });
      } else {
        const { error } = await supabase
          .from('automation_rules')
          .insert(formData);

        if (error) throw error;
        toast({ title: 'Automação criada!' });
      }

      setIsDialogOpen(false);
      setEditingRule(null);
      resetForm();
      fetchRules();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Automação removida!' });
      fetchRules();
    } catch (error: any) {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleRule = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      fetchRules();
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
      name: '',
      trigger_type: '',
      condition_days: 3,
      action_type: '',
      message_template: '',
      is_active: true,
    });
  };

  const openEditDialog = (rule: AutomationRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      trigger_type: rule.trigger_type,
      condition_days: rule.condition_days,
      action_type: rule.action_type,
      message_template: rule.message_template || '',
      is_active: rule.is_active,
    });
    setIsDialogOpen(true);
  };

  const getTriggerLabel = (type: string) => {
    return triggerTypes.find((t) => t.value === type)?.label || type;
  };

  const getActionLabel = (type: string) => {
    return actionTypes.find((a) => a.value === type)?.label || type;
  };

  const getActionIcon = (type: string) => {
    const action = actionTypes.find((a) => a.value === type);
    return action?.icon || Zap;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Automações</h2>
          <p className="text-muted-foreground">Configure alertas e ações automáticas</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingRule(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="btn-glow">
              <Plus className="h-4 w-4 mr-2" />
              Nova Automação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Editar Automação' : 'Nova Automação'}</DialogTitle>
              <DialogDescription>
                Configure quando e como a automação será executada
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Automação</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Reengajar alunos inativos"
                />
              </div>

              <div className="space-y-2">
                <Label>Gatilho (Quando executar)</Label>
                <Select
                  value={formData.trigger_type}
                  onValueChange={(value) => setFormData({ ...formData, trigger_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gatilho" />
                  </SelectTrigger>
                  <SelectContent>
                    {triggerTypes.map((trigger) => (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div className="flex items-center gap-2">
                          <trigger.icon className="h-4 w-4" />
                          {trigger.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.trigger_type && formData.trigger_type !== 'new_lead' && (
                <div className="space-y-2">
                  <Label htmlFor="days">Condição (dias)</Label>
                  <Input
                    id="days"
                    type="number"
                    min={1}
                    value={formData.condition_days}
                    onChange={(e) => setFormData({ ...formData, condition_days: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.trigger_type === 'inactive_student' && 'Disparar após X dias sem atividade'}
                    {formData.trigger_type === 'module_stuck' && 'Disparar se ficar X dias no mesmo módulo'}
                    {formData.trigger_type === 'drop_off' && 'Disparar X dias após abandono'}
                    {formData.trigger_type === 'course_almost_complete' && 'Disparar quando faltar X% para concluir'}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Ação (O que fazer)</Label>
                <Select
                  value={formData.action_type}
                  onValueChange={(value) => setFormData({ ...formData, action_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a ação" />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypes.map((action) => (
                      <SelectItem key={action.value} value={action.value}>
                        <div className="flex items-center gap-2">
                          <action.icon className="h-4 w-4" />
                          {action.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.action_type && formData.action_type !== 'webhook' && (
                <div className="space-y-2">
                  <Label htmlFor="template">Template da Mensagem</Label>
                  <Textarea
                    id="template"
                    value={formData.message_template}
                    onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
                    placeholder="Olá {nome}, notamos que você não acessou o curso há alguns dias..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {'{nome}'} para o nome do aluno e {'{curso}'} para o nome do curso
                  </p>
                </div>
              )}

              {formData.action_type === 'webhook' && (
                <div className="space-y-2">
                  <Label htmlFor="webhook">URL do Webhook</Label>
                  <Input
                    id="webhook"
                    value={formData.message_template}
                    onChange={(e) => setFormData({ ...formData, message_template: e.target.value })}
                    placeholder="https://hooks.zapier.com/..."
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Automação ativa</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={saveRule} className="btn-glow">
                {editingRule ? 'Salvar Alterações' : 'Criar Automação'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.map((rule) => {
          const ActionIcon = getActionIcon(rule.action_type);
          
          return (
            <Card key={rule.id} className="card-glass">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${rule.is_active ? 'bg-primary/20' : 'bg-muted'}`}>
                      <ActionIcon className={`h-6 w-6 ${rule.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{rule.name}</h3>
                        <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                          {rule.is_active ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          <strong>Gatilho:</strong> {getTriggerLabel(rule.trigger_type)}
                          {rule.condition_days > 0 && ` (${rule.condition_days} dias)`}
                        </span>
                        <span>
                          <strong>Ação:</strong> {getActionLabel(rule.action_type)}
                        </span>
                      </div>

                      {rule.message_template && rule.action_type !== 'webhook' && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {rule.message_template}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={(checked) => toggleRule(rule.id, checked)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteRule(rule.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {rules.length === 0 && !loading && (
          <Card className="card-glass">
            <CardContent className="py-12 text-center">
              <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Nenhuma automação configurada</h3>
              <p className="text-muted-foreground mb-4">
                Crie sua primeira automação para engajar seus alunos automaticamente
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="btn-glow">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Automação
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tips */}
      <Card className="card-glass border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Dicas de Automação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Aluno Inativo:</strong> Envie um lembrete após 3-5 dias sem acesso</p>
          <p>• <strong>Módulo Travado:</strong> Ofereça ajuda se o aluno ficar muito tempo na mesma aula</p>
          <p>• <strong>Curso Quase Completo:</strong> Motive o aluno quando estiver perto de terminar</p>
          <p>• <strong>Webhook:</strong> Integre com Zapier ou Make para ações avançadas</p>
        </CardContent>
      </Card>
    </div>
  );
}
