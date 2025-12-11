import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Loader2, Shield, Mail, MessageCircle, Globe } from 'lucide-react';

interface Settings {
  general: {
    siteName: string;
    siteDescription: string;
    supportEmail: string;
    whatsappNumber: string;
  };
  social: {
    instagram: string;
    youtube: string;
    linkedin: string;
    tiktok: string;
  };
  notifications: {
    emailNewLead: boolean;
    emailNewStudent: boolean;
    webhookUrl: string;
  };
}

const defaultSettings: Settings = {
  general: {
    siteName: 'LoboPlay',
    siteDescription: 'Plataforma de cursos sobre Inteligência Artificial',
    supportEmail: 'contato@loboplay.com',
    whatsappNumber: '',
  },
  social: {
    instagram: '',
    youtube: '',
    linkedin: '',
    tiktok: '',
  },
  notifications: {
    emailNewLead: true,
    emailNewStudent: true,
    webhookUrl: '',
  },
};

export default function Settings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('settings')
        .select('*');

      if (data && data.length > 0) {
        const settingsMap: Record<string, any> = {};
        data.forEach((item) => {
          settingsMap[item.key] = item.value;
        });

        setSettings({
          general: settingsMap.general || defaultSettings.general,
          social: settingsMap.social || defaultSettings.social,
          notifications: settingsMap.notifications || defaultSettings.notifications,
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (key: string, value: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key,
          value,
        }, {
          onConflict: 'key',
        });

      if (error) throw error;

      toast({
        title: 'Configurações salvas!',
        description: 'As alterações foram aplicadas com sucesso.',
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">Gerencie as configurações da plataforma</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="social">Redes Sociais</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Informações básicas da plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Nome do Site</Label>
                <Input
                  id="siteName"
                  value={settings.general.siteName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteName: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Descrição</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, siteDescription: e.target.value }
                  })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, supportEmail: e.target.value }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp (com DDI)</Label>
                  <Input
                    id="whatsapp"
                    value={settings.general.whatsappNumber}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, whatsappNumber: e.target.value }
                    })}
                    placeholder="+5511999999999"
                  />
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('general', settings.general)}
                disabled={saving}
                className="btn-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Settings */}
        <TabsContent value="social">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Redes Sociais
              </CardTitle>
              <CardDescription>Links para suas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={settings.social.instagram}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube">YouTube</Label>
                  <Input
                    id="youtube"
                    value={settings.social.youtube}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, youtube: e.target.value }
                    })}
                    placeholder="https://youtube.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={settings.social.linkedin}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, linkedin: e.target.value }
                    })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok">TikTok</Label>
                  <Input
                    id="tiktok"
                    value={settings.social.tiktok}
                    onChange={(e) => setSettings({
                      ...settings,
                      social: { ...settings.social, tiktok: e.target.value }
                    })}
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
              </div>

              <Button 
                onClick={() => saveSettings('social', settings.social)}
                disabled={saving}
                className="btn-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Redes Sociais
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Configure alertas e integrações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Novo Lead (E-book)</p>
                    <p className="text-sm text-muted-foreground">
                      Receber email quando alguém baixar o e-book
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNewLead}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNewLead: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">Novo Aluno</p>
                    <p className="text-sm text-muted-foreground">
                      Receber email quando alguém se matricular
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNewStudent}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNewStudent: checked }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook">Webhook URL (Zapier/Make)</Label>
                <Input
                  id="webhook"
                  value={settings.notifications.webhookUrl}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, webhookUrl: e.target.value }
                  })}
                  placeholder="https://hooks.zapier.com/..."
                />
                <p className="text-xs text-muted-foreground">
                  Será chamado para cada novo lead ou aluno
                </p>
              </div>

              <Button 
                onClick={() => saveSettings('notifications', settings.notifications)}
                disabled={saving}
                className="btn-glow"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Salvar Notificações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
              <CardDescription>Configurações de segurança e acesso</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Autenticação</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  A autenticação é gerenciada automaticamente pelo Lovable Cloud.
                  Email de confirmação está desativado para facilitar testes.
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Email + Senha</Badge>
                  <Badge variant="secondary">Auto-confirm ativo</Badge>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">Row Level Security (RLS)</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Todas as tabelas estão protegidas com políticas de segurança.
                  Apenas administradores podem acessar dados sensíveis.
                </p>
                <Badge className="bg-green-500">RLS Ativo</Badge>
              </div>

              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
                <h4 className="font-medium text-destructive mb-2">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Ações irreversíveis. Tenha cuidado ao executar.
                </p>
                <Button variant="destructive" size="sm" disabled>
                  Deletar todos os dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
