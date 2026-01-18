import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { ordersService, OrderResponse } from '@/services/orders.service';
import { 
  Package, 
  Clock, 
  Eye, 
  CreditCard,
  ShoppingCart,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function OrdersHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      const response = await ordersService.getClientOrders(user.id);
      setOrders(response);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Impossible de charger vos commandes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      PENDING: { label: 'En attente', variant: 'secondary' },
      CONFIRMED: { label: 'Confirmée', variant: 'default' },
      SHIPPED: { label: 'Expédiée', variant: 'outline' },
      DELIVERED: { label: 'Livrée', variant: 'default' },
      CANCELLED: { label: 'Annulée', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">
            Connexion requise
          </h1>
          <p className="text-muted-foreground mb-6">
            Veuillez vous connecter pour voir vos commandes.
          </p>
          <Button variant="hero" asChild>
            <Link to="/login">Se connecter</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Loader2 className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground">Chargement de vos commandes...</p>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">
            Aucune commande
          </h1>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas encore passé de commande.
          </p>
          <Button variant="hero" asChild>
            <Link to="/catalog">Voir le catalogue</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Mes commandes</h1>
          <p className="text-muted-foreground">
            Retrouvez l'historique de vos {orders.length} commande(s)
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Commande #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/order-success/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Type */}
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {order.orderType === 'CASH' ? 'Paiement comptant' : `Crédit ${order.months} mois`}
                  </span>
                  {order.orderType === 'CREDIT' && order.creditStatus && (
                    <Badge variant="secondary" className="text-xs">
                      {order.creditStatus}
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Items Preview */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Véhicules ({order.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.vehicleModel} × {item.quantity}
                        </span>
                        <span className="font-medium">{formatPrice(item.subTotal)}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        + {order.items.length - 2} autre(s) véhicule(s)
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-xl font-bold text-accent">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>

                {/* Monthly Payment for Credit */}
                {order.orderType === 'CREDIT' && order.monthlyPayment && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Mensualité</span>
                      <span className="font-medium">
                        {formatPrice(order.monthlyPayment)} / mois
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}