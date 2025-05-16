import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, CalendarClock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type Lead = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  calculator_results: any | null;
  created_at: string;
  updated_at: string;
  status: string;
  calendly_url: string | null;
  notes: string | null;
};

export default function LeadsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setLeads(data || []);
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      toast({
        title: 'Error fetching leads',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(leadId: string, status: string) {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

      if (error) {
        throw error;
      }

      // Update the leads state
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status } : lead
      ));

      toast({
        title: 'Status updated',
        description: `Lead status updated to ${status}`,
      });
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      toast({
        title: 'Error updating lead',
        description: error.message,
        variant: 'destructive',
      });
    }
  }

  function getLeadStatusBadge(status: string) {
    switch (status) {
      case 'new':
        return <Badge variant="default">New</Badge>;
      case 'contacted':
        return <Badge variant="secondary">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Qualified</Badge>;
      case 'converted':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Converted</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  function renderSummary(results: any) {
    if (!results?.summary) return 'No data';
    
    const { totalCO2, totalCost, categoryResults } = results.summary;
    
    return (
      <div className="space-y-2 text-sm">
        <div><strong>Total CO₂:</strong> {Number(totalCO2).toFixed(2)} kg</div>
        <div><strong>Total Cost:</strong> €{Number(totalCost).toFixed(2)}</div>
        {categoryResults && (
          <div>
            <strong>Categories:</strong>
            <ul className="pl-4 list-disc">
              {categoryResults.map((cat: any, i: number) => (
                <li key={i}>{cat.category}: {Number(cat.total).toFixed(2)} kg</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leads Management</h1>
        <Button onClick={fetchLeads} variant="outline" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Refresh'}
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="converted">Converted</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <LeadsTable 
            leads={leads} 
            loading={loading} 
            onUpdateStatus={updateLeadStatus} 
            getStatusBadge={getLeadStatusBadge}
            renderSummary={renderSummary}
          />
        </TabsContent>
        
        <TabsContent value="new">
          <LeadsTable 
            leads={leads.filter(lead => lead.status === 'new')} 
            loading={loading} 
            onUpdateStatus={updateLeadStatus} 
            getStatusBadge={getLeadStatusBadge}
            renderSummary={renderSummary}
          />
        </TabsContent>
        
        <TabsContent value="contacted">
          <LeadsTable 
            leads={leads.filter(lead => lead.status === 'contacted')} 
            loading={loading} 
            onUpdateStatus={updateLeadStatus} 
            getStatusBadge={getLeadStatusBadge}
            renderSummary={renderSummary}
          />
        </TabsContent>
        
        <TabsContent value="qualified">
          <LeadsTable 
            leads={leads.filter(lead => lead.status === 'qualified')} 
            loading={loading} 
            onUpdateStatus={updateLeadStatus} 
            getStatusBadge={getLeadStatusBadge}
            renderSummary={renderSummary}
          />
        </TabsContent>
        
        <TabsContent value="converted">
          <LeadsTable 
            leads={leads.filter(lead => lead.status === 'converted')} 
            loading={loading} 
            onUpdateStatus={updateLeadStatus} 
            getStatusBadge={getLeadStatusBadge}
            renderSummary={renderSummary}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LeadsTable({ 
  leads, 
  loading, 
  onUpdateStatus, 
  getStatusBadge,
  renderSummary
}: { 
  leads: Lead[], 
  loading: boolean,
  onUpdateStatus: (id: string, status: string) => void,
  getStatusBadge: (status: string) => React.ReactNode,
  renderSummary: (results: any) => React.ReactNode
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-52">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col justify-center items-center h-52">
          <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">No leads found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>CO₂ Data</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map(lead => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">
                  {format(new Date(lead.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{lead.name || '-'}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.company || '-'}</TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell className="max-w-lg">
                  {lead.calculator_results ? renderSummary(lead.calculator_results) : 'No data'}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`mailto:${lead.email}`, '_blank')}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open('https://calendly.com/circa-demo/30min', '_blank')}>
                      <CalendarClock className="h-4 w-4" />
                    </Button>
                    <select 
                      className="p-1 rounded text-xs border border-input"
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 