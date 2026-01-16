import { useState } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, FileText, CreditCard, Banknote, Eye, Download, Truck } from 'lucide-react';

interface MockOrder {
  id: string;
  customer: string;
  customerType: 'individual' | 'company';
  vehicle: string;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  paymentType: 'cash' | 'credit';
  date: string;
}

const mockOrders: MockOrder[] = [
  { id: 'CMD-001', customer: 'Jean Dupont', customerType: 'individual', vehicle: 'Tesla Model 3', total: 45990, status: 'pending', paymentType: 'credit', date: '2024-01-15' },
  { id: 'CMD-002', customer: 'Marie Martin', customerType: 'individual', vehicle: 'BMW Série 3', total: 52500, status: 'confirmed', paymentType: 'cash', date: '2024-01-14' },
  { id: 'CMD-003', customer: 'SAS Transports Durand', customerType: 'company', vehicle: 'Vespa Elettrica x3', total: 22470, status: 'delivered', paymentType: 'credit', date: '2024-01-13' },
  { id: 'CMD-004', customer: 'Pierre Leroy', customerType: 'individual', vehicle: 'Peugeot e-208', total: 39900, status: 'pending', paymentType: 'cash', date: '2024-01-12' },
  { id: 'CMD-005', customer: 'Garage Auto Plus', customerType: 'company', vehicle: 'Honda PCX 125 x5', total: 19995, status: 'confirmed', paymentType: 'credit', date: '2024-01-11' },
];

export default function AdminOrders() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = `${order.id} ${order.customer} ${order.vehicle}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);

  const statusColors = {
    pending: 'bg-warning text-warning-foreground',
    confirmed: 'bg-accent text-accent-foreground',
    delivered: 'bg-success text-success-foreground',
  };

  const statusLabels = {
    pending: 'En cours',
    confirmed: 'Confirmée',
    delivered: 'Livrée',
  };

  const stats = {
    pending: mockOrders.filter((o) => o.status === 'pending').length,
    confirmed: mockOrders.filter((o) => o.status === 'confirmed').length,
    delivered: mockOrders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">Gestion des commandes</h1>
          <p className="text-muted-foreground">{mockOrders.length} commandes au total</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-warning" />
                En cours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold font-display">{stats.pending}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                Confirmées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold font-display">{stats.confirmed}</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                Livrées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold font-display">{stats.delivered}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une commande..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="pending">En cours</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commande</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.date}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.customerType === 'company' ? 'Société' : 'Particulier'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.vehicle}</TableCell>
                  <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {order.paymentType === 'credit' ? (
                        <><CreditCard className="h-3 w-3" /> Crédit</>
                      ) : (
                        <><Banknote className="h-3 w-3" /> Comptant</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Voir détails">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Documents">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Télécharger">
                        <Download className="h-4 w-4" />
                      </Button>
                      {order.status !== 'delivered' && (
                        <Button variant="ghost" size="icon" title="Marquer livrée">
                          <Truck className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
