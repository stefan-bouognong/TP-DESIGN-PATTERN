import { FileText, Truck, CreditCard, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DeliveryInfo, PaymentMethod, CreditRequest } from '@/types/auth';
import { CartItem } from '@/types/vehicle';

interface ConfirmationStepProps {
  deliveryInfo: DeliveryInfo;
  paymentMethod: PaymentMethod;
  creditRequest: CreditRequest;
  items: CartItem[];
  isProcessing: boolean;
  onConfirm: () => void;
  onPrev: () => void;
  onEditDelivery: () => void;
  onEditPayment: () => void;
  formatPrice: (price: number) => string;
}

export function ConfirmationStep({
  deliveryInfo,
  paymentMethod,
  creditRequest,
  items,
  isProcessing,
  onConfirm,
  onPrev,
  onEditDelivery,
  onEditPayment,
  formatPrice
}: ConfirmationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Récapitulatif de la commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Summary */}
        <div className="p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Livraison
            </h4>
            <Button variant="ghost" size="sm" onClick={onEditDelivery}>
              Modifier
            </Button>
          </div>
          <p className="text-sm">
            {deliveryInfo.firstName} {deliveryInfo.lastName}<br />
            {deliveryInfo.address}<br />
            {deliveryInfo.postalCode} {deliveryInfo.city}, {deliveryInfo.country}<br />
            {deliveryInfo.phone}
          </p>
          {deliveryInfo.notes && (
            <p className="text-sm text-muted-foreground mt-2">
              Note : {deliveryInfo.notes}
            </p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="p-4 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Paiement
            </h4>
            <Button variant="ghost" size="sm" onClick={onEditPayment}>
              Modifier
            </Button>
          </div>
          <p className="text-sm">
            {paymentMethod === 'cash' ? 'Paiement comptant' : 'Demande de crédit'}
            {paymentMethod === 'credit' && (
              <span className="text-muted-foreground"> - {creditRequest.desiredDuration} mois</span>
            )}
          </p>
        </div>

        {/* Items */}
        <div>
          <h4 className="font-medium mb-4">Véhicules ({items.length})</h4>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.vehicle.id} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                <img
                  alt={item.vehicle.name}
                  className="h-16 w-20 rounded-lg object-cover bg-muted"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.vehicle.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.selectedOptions.length > 0 
                      ? `${item.selectedOptions.length} option(s) sélectionnée(s)`
                      : 'Sans option'}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.vehicle.price)}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Documents */}
        <div>
          <h4 className="font-medium mb-3">Documents générés automatiquement</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {['Bon de commande', 'Demande d\'immatriculation', 'Certificat de cession'].map((doc) => (
              <div key={doc} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {doc}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button 
            variant="hero" 
            onClick={onConfirm} 
            className="flex-1"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmer la commande
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          En confirmant, vous acceptez nos conditions générales de vente.
        </p>
      </CardContent>
    </Card>
  );
}