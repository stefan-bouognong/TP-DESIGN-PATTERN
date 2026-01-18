import { FC } from 'react';
import { OrderResponse } from '@/api/orders.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Download, Truck } from 'lucide-react';
import { OrderStatusActions } from './OrderStatusActions';

interface OrdersTableProps {
  orders: OrderResponse[];
  onViewDetails: (order: OrderResponse) => void;
  onStatusChange: (orderId: number, status: string) => void;
}

export const OrdersTable: FC<OrdersTableProps> = ({ orders, onViewDetails, onStatusChange }) => {
  const statusColors = {
    PENDING: 'bg-warning text-warning-foreground',
    CONFIRMED: 'bg-accent text-accent-foreground',
    SHIPPED: 'bg-success text-success-foreground',
  };

  const statusLabels = {
    PENDING: 'En cours',
    CONFIRMED: 'Confirmée',
    SHIPPED: 'Livrée',
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(price);

  return (
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
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell># {order.clientId}</TableCell>
              <TableCell>{order.items.map(i => i.vehicleModel).join(', ')}</TableCell>
              <TableCell className="font-medium">{formatPrice(order.totalAmount)}</TableCell>
              <TableCell>
                <Badge variant="outline">{order.orderType === 'CREDIT' ? 'Crédit' : 'Comptant'}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
              </TableCell>
              <TableCell className="text-right flex justify-end gap-1">
                <Button variant="ghost" size="icon" onClick={() => onViewDetails(order)} title="Voir détails">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Documents">
                  <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Télécharger">
                  <Download className="h-4 w-4" />
                </Button>
                <OrderStatusActions order={order} onChangeStatus={onStatusChange} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
