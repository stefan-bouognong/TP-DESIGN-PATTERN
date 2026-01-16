import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Download, 
  Home, 
  Package, 
  CreditCard,
  Truck,
  FileText,
  Clock
} from 'lucide-react';
import { OrderResponse } from '@/services/orders.service';
import { ordersService } from '@/services/orders.service';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<OrderResponse | null>(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderId) {
      loadOrder();
    }
  }, [orderId, order]);

  const loadOrder = async () => {
    if (!orderId) return;
    
    try {
      const response = await ordersService.getOrder(parseInt(orderId));
      setOrder(response);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    
    const status_info = statusMap[status] || { label: status, variant: 'secondary' };
    return <Badge variant={status_info.variant}>{status_info.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-spin" />
          <p className="text-muted-foreground">Chargement de votre commande...</p>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Commande introuvable</h1>
          <p className="text-muted-foreground mb-6">Cette commande n'existe pas ou a été supprimée.</p>
          <Button variant="hero" asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/20 mb-4">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            Commande confirmée !
          </h1>
          <p className="text-muted-foreground text-lg">
            Merci pour votre commande. Nous avons bien reçu votre demande.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Commande #{order.id}
              </CardTitle>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              Passée le {formatDate(order.orderDate)}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Type */}
            <div className="flex items-center gap-2 p-4 rounded-xl bg-secondary/50">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">
                  {order.orderType === 'CASH' ? 'Paiement comptant' : 'Paiement à crédit'}
                </p>
                {order.orderType === 'CREDIT' && order.months && (
                  <p className="text-sm text-muted-foreground">
                    {order.months} mensualités de {formatPrice(order.monthlyPayment || 0)}
                    {order.creditStatus && ` - ${order.creditStatus}`}
                  </p>
                )}
              </div>
              {order.orderType === 'CASH' && order.cashDiscount && (
                <Badge variant="secondary">-{order.cashDiscount}% de remise</Badge>
              )}
            </div>

            {/* Shipping Address */}
            <div className="p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium">Adresse de livraison</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress}
              </p>
            </div>

            <Separator />

            {/* Items */}
            <div>
              <h3 className="font-medium mb-4">Véhicules commandés ({order.items.length})</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                    <div className="flex-1">
                      <p className="font-medium">{item.vehicleModel}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.vehicleType} • Quantité: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.subTotal)}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatPrice(item.unitPrice)} / unité
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-display text-xl font-bold">Total</span>
              <span className="font-display text-2xl font-bold text-accent">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Button variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Télécharger la facture
          </Button>
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Télécharger les documents
          </Button>
        </div>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prochaines étapes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.orderType === 'CREDIT' && !order.approved && (
              <div className="flex gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900 dark:text-yellow-100">
                    Demande de crédit en cours
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Votre dossier de crédit est en cours d'examen. Vous recevrez une réponse sous 48h.
                  </p>
                </div>
              </div>
            )}
            
            <div className="space-y-2 text-sm">
              <p>✓ Confirmation envoyée par email à <strong>{order.clientName}</strong></p>
              <p>✓ Vous pouvez suivre votre commande dans votre espace client</p>
              <p>✓ Livraison estimée sous 2-4 semaines</p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <Link to="/catalog">
              <Package className="h-4 w-4 mr-2" />
              Continuer mes achats
            </Link>
          </Button>
          <Button variant="hero" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}