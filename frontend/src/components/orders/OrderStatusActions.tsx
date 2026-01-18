import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Truck, Check } from 'lucide-react';
import { OrderResponse } from '@/api/orders.service';

interface Props {
  order: OrderResponse;
  onChangeStatus: (orderId: number, status: string) => void;
}

export const OrderStatusActions: FC<Props> = ({ order, onChangeStatus }) => {
  if (order.status === 'DELIVERED') return null;

  return (
    <>
      {order.status === 'PENDING' && (
        <Button variant="ghost" size="icon" title="Passer à Confirmée" onClick={() => onChangeStatus(order.id, 'SHIPPED')}>
          <Check className="h-4 w-4" />
        </Button>
      )}
      {order.status === 'SHIPPED' && (
        <Button variant="ghost" size="icon" title="Passer à Livrée" onClick={() => onChangeStatus(order.id, 'DELIVERED')}>
          <Truck className="h-4 w-4" />
        </Button>
      )}
    </>
  );
};
