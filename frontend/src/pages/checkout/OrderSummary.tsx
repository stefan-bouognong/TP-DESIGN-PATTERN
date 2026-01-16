import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { CartItem } from '@/contexts/CartContext';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  taxes: number;
  total: number;
  deliveryCountry: string;
  formatPrice: (price: number) => string;
}

export function OrderSummary({
  items,
  subtotal,
  taxes,
  total,
  deliveryCountry,
  formatPrice
}: OrderSummaryProps) {
  return (
    <div className="sticky top-24 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.vehicle.id} className="flex items-center gap-3">
              <img
                alt={item.vehicle.name}
                className="h-12 w-16 rounded-lg object-cover bg-muted"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.vehicle.name}</p>
                <p className="text-xs text-muted-foreground">
                  Qté: {item.quantity}
                </p>
              </div>
              <p className="text-sm font-medium">{formatPrice(item.vehicle.price)}</p>
            </div>
          ))}

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVA ({deliveryCountry})</span>
              <span>{formatPrice(taxes)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-display text-lg font-bold">
              <span>Total TTC</span>
              <span className="text-accent">{formatPrice(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" asChild className="w-full">
        <Link to="/cart">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au panier
        </Link>
      </Button>
    </div>
  );
}