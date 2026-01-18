import { FC } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { OrderResponse } from '@/api/orders.service';

interface Props {
  order: OrderResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: FC<Props> = ({ order, isOpen, onClose }) => {
  if (!order) return null;
        console.log(order)
  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          <h2>Détails de la commande {order.id}</h2>
        </ModalHeader>
        <ModalBody>
          <p><strong>Client:</strong> {order.clientName}</p>
          <p><strong>Adresse livraison:</strong> {order.shippingAddress}</p>
          <p><strong>Adresse facturation:</strong> {order.billingAddress}</p>
          <p><strong>Montant total:</strong> {order.subtotal} €</p>
          <p><strong>Status:</strong> {order.status}</p>
          <h3 className="mt-4 font-semibold">Articles</h3>
          <ul>
            {order.items.map(item => (
              <li key={item.id}>{item.vehicleModel} x {item.quantity} = {item.unitPrice} FCFA</li>
            ))}
          </ul>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Fermer</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
