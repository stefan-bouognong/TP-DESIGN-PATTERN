import { FC } from 'react';
import { OrderResponse } from '@/api/orders.service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Download } from 'lucide-react';

interface OrdersTableProps {
  orders: OrderResponse[];
  onViewDetails: (order: OrderResponse) => void;
  onDownload: (order: OrderResponse) => void;
}

export const OrdersTable: FC<OrdersTableProps> = ({
  orders,
  onViewDetails,
  onDownload,
}) => {
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

  return (
    <div className="rounded-xl border bg-card overflow-hidden ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Commande</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>
                {order.items.map(i => i.vehicleModel).join(', ')}
              </TableCell>
              <TableCell>{order.subtotal}</TableCell>
              <TableCell>
                <Badge className={statusColors[order.status]}>
                  {statusLabels[order.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onViewDetails(order)}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDownload(order)}
                  title="Télécharger les documents"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
