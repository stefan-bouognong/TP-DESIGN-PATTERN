import { useState, useEffect } from 'react';
import { ordersService, OrderResponse } from '@/api/orders.service';
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

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Charger toutes les commandes (ou celles d’un client si nécessaire)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Exemple : récupérer toutes les commandes
        // Ici tu peux filtrer par clientId si besoin
        const response = await ordersService.getClientOrders(1); 
        setOrders(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = `${order.id} ${order.clientName} ${order.items.map(i => i.vehicleModel).join(', ')}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

  const statusColors = {
    PENDING: 'bg-warning text-warning-foreground',
    CONFIRMED: 'bg-accent text-accent-foreground',
    DELIVERED: 'bg-success text-success-foreground',
  };

  const statusLabels = {
    PENDING: 'En cours',
    CONFIRMED: 'Confirmée',
    DELIVERED: 'Livrée',
  };

  const stats = {
    PENDING: orders.filter(o => o.status === 'PENDING').length,
    CONFIRMED: orders.filter(o => o.status === 'CONFIRMED').length,
    DELIVERED: orders.filter(o => o.status === 'DELIVERED').length,
  };

  if (loading) return <p className="p-8">Chargement des commandes...</p>;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* ...Stats et filtres identiques... */}
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
              {filteredOrders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="font-medium">{order.clientName}</p>
                        <Badge variant="outline" className="text-xs">
                          {order.clientType === 'COMPANY' ? 'Société' : 'Particulier'}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.items.map(i => i.vehicleModel).join(', ')}</TableCell>
                  <TableCell className="font-medium">{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="gap-1">
                      {order.orderType === 'CREDIT' ? (
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
                      <Button variant="ghost" size="icon" title="Voir détails"><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Documents"><FileText className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" title="Télécharger"><Download className="h-4 w-4" /></Button>
                      {order.status !== 'DELIVERED' && (
                        <Button variant="ghost" size="icon" title="Marquer livrée"><Truck className="h-4 w-4" /></Button>
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
