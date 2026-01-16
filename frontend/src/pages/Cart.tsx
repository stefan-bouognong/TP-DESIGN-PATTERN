import { Layout } from '@/components/layout/Layout';
import { CartItemCard } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { useCart } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

export default function Cart() {
  const { items, history, historyIndex } = useCart();

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Votre panier
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <p>{items.length} véhicule{items.length > 1 ? 's' : ''}</p>
            {history.length > 1 && (
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {historyIndex + 1}/{history.length} états
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.length === 0 ? (
              <CartSummary />
            ) : (
              items.map((item) => (
                <CartItemCard key={item.vehicle.id} item={item} />
              ))
            )}
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
