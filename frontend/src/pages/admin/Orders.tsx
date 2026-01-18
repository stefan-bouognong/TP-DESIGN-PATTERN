import { useState, useEffect } from 'react';
import { ordersService, OrderResponse } from '@/api/orders.service';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { OrdersTable } from './orders/OrdersTable';
import { OrderDetailsModal } from './orders/OrderDetailsModal';


export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await ordersService.getAll();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleViewDetails = (order: OrderResponse) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleChangeStatus = async (orderId: number, status: string) => {
    try {
      const res = await ordersService.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? res.data : o));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-8">Chargement...</p>;

  return (
    <AdminLayout>
      <div className="p-8">
        <OrdersTable orders={orders} onViewDetails={handleViewDetails} onStatusChange={handleChangeStatus} />
        <OrderDetailsModal order={selectedOrder} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </AdminLayout>
  );
}
