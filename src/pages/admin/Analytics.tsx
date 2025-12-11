import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell,
  PieChart, Pie, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Monitor, Smartphone, Globe } from 'lucide-react';

const funnelData = [
  { name: 'Visitas na LP', value: 1000, fill: 'hsl(var(--primary))' },
  { name: 'Scroll 50%', value: 650, fill: 'hsl(33 100% 55%)' },
  { name: 'Clique no CTA', value: 200, fill: 'hsl(33 100% 45%)' },
  { name: 'Checkout', value: 80, fill: 'hsl(33 100% 40%)' },
  { name: 'Compra', value: 25, fill: 'hsl(215 25% 40%)' },
];

const deviceData = [
  { name: 'Desktop', value: 45, fill: 'hsl(var(--primary))' },
  { name: 'Mobile', value: 50, fill: 'hsl(33 100% 55%)' },
  { name: 'Tablet', value: 5, fill: 'hsl(215 25% 50%)' },
];

const sourceData = [
  { name: 'Direto', value: 35, fill: 'hsl(var(--primary))' },
  { name: 'Google', value: 30, fill: 'hsl(33 100% 55%)' },
  { name: 'Instagram', value: 20, fill: 'hsl(215 25% 50%)' },
  { name: 'WhatsApp', value: 10, fill: 'hsl(150 60% 45%)' },
  { name: 'Outros', value: 5, fill: 'hsl(215 20% 65%)' },
];

const weeklyData = [
  { date: '01/12', visitas: 120, leads: 8, conversoes: 2 },
  { date: '02/12', visitas: 145, leads: 12, conversoes: 3 },
  { date: '03/12', visitas: 180, leads: 15, conversoes: 4 },
  { date: '04/12', visitas: 135, leads: 10, conversoes: 2 },
  { date: '05/12', visitas: 200, leads: 18, conversoes: 5 },
  { date: '06/12', visitas: 165, leads: 14, conversoes: 3 },
  { date: '07/12', visitas: 190, leads: 16, conversoes: 4 },
];

export default function Analytics() {
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLeads: 0,
    conversionRate: 0,
    avgTimeOnPage: '2:45',
  });

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    const { count: viewsCount } = await supabase
      .from('page_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view');

    const { count: leadsCount } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });

    const rate = viewsCount && viewsCount > 0 
      ? ((leadsCount || 0) / viewsCount * 100).toFixed(1) 
      : '0';

    setStats({
      totalViews: viewsCount || 0,
      totalLeads: leadsCount || 0,
      conversionRate: parseFloat(rate),
      avgTimeOnPage: '2:45',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Análise completa de conversões e comportamento</p>
        </div>

        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            <TabsTrigger value="7d">7 dias</TabsTrigger>
            <TabsTrigger value="30d">30 dias</TabsTrigger>
            <TabsTrigger value="90d">90 dias</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total de Visitas</p>
            <div className="flex items-center mt-2 text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">Leads Capturados</p>
            <div className="flex items-center mt-2 text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
            <div className="flex items-center mt-2 text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% vs período anterior
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.avgTimeOnPage}</div>
            <p className="text-xs text-muted-foreground">Tempo Médio na Página</p>
            <div className="flex items-center mt-2 text-xs text-red-500">
              <TrendingDown className="h-3 w-3 mr-1" />
              -15s vs período anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Chart */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Jornada do visitante até a compra</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                  >
                    <LabelList 
                      position="right" 
                      fill="hsl(var(--foreground))" 
                      stroke="none" 
                      dataKey="name" 
                    />
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {funnelData.map((step, index) => {
                const prevValue = index > 0 ? funnelData[index - 1].value : step.value;
                const dropRate = ((prevValue - step.value) / prevValue * 100).toFixed(1);
                const convRate = ((step.value / funnelData[0].value) * 100).toFixed(1);

                return (
                  <div key={step.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: step.fill }}
                      />
                      <span className="font-medium">{step.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold">{step.value.toLocaleString()}</span>
                      <Badge variant={index === 0 ? 'default' : 'secondary'}>
                        {convRate}%
                      </Badge>
                      {index > 0 && (
                        <span className="text-xs text-red-500">-{dropRate}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Traffic Over Time */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Tráfego ao Longo do Tempo</CardTitle>
            <CardDescription>Visitas, leads e conversões</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorVisitas2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                    fill="url(#colorVisitas2)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stroke="hsl(33 100% 55%)" 
                    fill="transparent" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Dispositivos</CardTitle>
            <CardDescription>Distribuição por tipo de dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-primary" />
                <span className="text-sm">Desktop: 45%</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-orange-400" />
                <span className="text-sm">Mobile: 50%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Fontes de Tráfego</CardTitle>
          <CardDescription>De onde vêm seus visitantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{source.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${source.value}%`,
                          backgroundColor: source.fill 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12">{source.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
