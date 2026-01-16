import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

export function EmptyCart() {
  return (
    <Layout>
      <div className="container py-16 text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="font-display text-2xl font-bold mb-2">Votre panier est vide</h1>
        <p className="text-muted-foreground mb-6">Ajoutez des véhicules avant de passer commande.</p>
        <Button variant="hero" asChild>
          <Link to="/catalog">Voir le catalogue</Link>
        </Button>
      </div>
    </Layout>
  );
}