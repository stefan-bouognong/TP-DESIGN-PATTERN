import { useEffect, useState } from 'react';
import { OrderDocumentsModal } from './OrderDocumentsModal';
import { OrderResponse, ordersService } from '@/api/orders.service';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { Modal } from '@/components/ui/Modal';
import { useAuthStore } from '@/store/useAuthStore';
import { Layout } from '@/components/layout/Layout';

export const Orders = () => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<OrderResponse | null>(null);

  const user = useAuthStore((state) => state.user);

  //  Chargement des commandes
  useEffect(() => {
    const fetchOrders = async () => {
    //   if (!user?.clientId) return;

      try {
        const response = await ordersService.getClientOrders(5);
        console.log(response)
        setOrders(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des commandes', error);
      }
    };

    fetchOrders();
  }, [user?.clientId]);

  return (
    <>
    <Layout showFooter={true}>
        <div className='container py-8'>

      <OrdersTable
        orders={orders}
        onViewDetails={(order) => console.log(order)}
        onDownload={(order) => {
          setSelectedOrder(order);
          setOpen(true);
        }}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        {selectedOrder && (
          <OrderDocumentsModal
            orderId={selectedOrder.id}
            onClose={() => setOpen(false)}
          />
        )}
      </Modal>
      
        </div>
    </Layout>
    </>
  );
};
