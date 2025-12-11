import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Mail, Filter, Trash2, ExternalLink } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  converted_at: string | null;
  created_at: string;
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, sourceFilter, statusFilter]);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar leads',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter((lead) => lead.source === sourceFilter);
    }

    if (statusFilter === 'converted') {
      filtered = filtered.filter((lead) => lead.converted_at);
    } else if (statusFilter === 'pending') {
      filtered = filtered.filter((lead) => !lead.converted_at);
    }

    setFilteredLeads(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Fonte', 'UTM Source', 'UTM Medium', 'UTM Campaign', 'Convertido', 'Data'];
    const rows = filteredLeads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone || '',
      lead.source,
      lead.utm_source || '',
      lead.utm_medium || '',
      lead.utm_campaign || '',
      lead.converted_at ? 'Sim' : 'Não',
      new Date(lead.created_at).toLocaleDateString('pt-BR'),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'CSV exportado!',
      description: `${filteredLeads.length} leads exportados com sucesso.`,
    });
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLeads(leads.filter((lead) => lead.id !== id));
      toast({
        title: 'Lead removido',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover lead',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const markAsConverted = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ converted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      fetchLeads();
      toast({
        title: 'Lead marcado como convertido!',
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const uniqueSources = Array.from(new Set(leads.map((lead) => lead.source)));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gerenciar Leads</h2>
        <p className="text-muted-foreground">Lista de emails capturados via e-book</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{leads.length}</div>
            <p className="text-xs text-muted-foreground">Total de Leads</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">
              {leads.filter((l) => l.converted_at).length}
            </div>
            <p className="text-xs text-muted-foreground">Convertidos</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">
              {leads.filter((l) => !l.converted_at).length}
            </div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">
              {leads.length > 0
                ? ((leads.filter((l) => l.converted_at).length / leads.length) * 100).toFixed(1)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Taxa de Conversão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="card-glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Lista de Leads</CardTitle>
              <CardDescription>{filteredLeads.length} leads encontrados</CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Fonte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fontes</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="converted">Convertidos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead>UTM</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{lead.source}</Badge>
                  </TableCell>
                  <TableCell>
                    {lead.utm_source && (
                      <span className="text-xs text-muted-foreground">
                        {lead.utm_source}
                        {lead.utm_campaign && ` / ${lead.utm_campaign}`}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {lead.converted_at ? (
                      <Badge className="bg-green-500">Convertido</Badge>
                    ) : (
                      <Badge variant="outline">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {!lead.converted_at && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsConverted(lead.id)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLead(lead.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLeads.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              {loading ? 'Carregando...' : 'Nenhum lead encontrado'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
