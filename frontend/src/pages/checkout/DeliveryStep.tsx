import { Truck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DeliveryInfo } from '@/types/auth';
import { countries } from '@/data/countries';

interface DeliveryStepProps {
  deliveryInfo: DeliveryInfo;
  onDeliveryInfoChange: (info: DeliveryInfo) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function DeliveryStep({ 
  deliveryInfo, 
  onDeliveryInfoChange, 
  onNext, 
  onPrev 
}: DeliveryStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Adresse de livraison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryFirstName">Prénom *</Label>
            <Input
              id="deliveryFirstName"
              value={deliveryInfo.firstName}
              onChange={(e) => onDeliveryInfoChange({ 
                ...deliveryInfo, 
                firstName: e.target.value 
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryLastName">Nom *</Label>
            <Input
              id="deliveryLastName"
              value={deliveryInfo.lastName}
              onChange={(e) => onDeliveryInfoChange({ 
                ...deliveryInfo, 
                lastName: e.target.value 
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryAddress">Adresse *</Label>
          <Input
            id="deliveryAddress"
            value={deliveryInfo.address}
            onChange={(e) => onDeliveryInfoChange({ 
              ...deliveryInfo, 
              address: e.target.value 
            })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryCity">Ville *</Label>
            <Input
              id="deliveryCity"
              value={deliveryInfo.city}
              onChange={(e) => onDeliveryInfoChange({ 
                ...deliveryInfo, 
                city: e.target.value 
              })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryPostalCode">Code postal *</Label>
            <Input
              id="deliveryPostalCode"
              value={deliveryInfo.postalCode}
              onChange={(e) => onDeliveryInfoChange({ 
                ...deliveryInfo, 
                postalCode: e.target.value 
              })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryCountry">Pays *</Label>
            <Select 
              value={deliveryInfo.country} 
              onValueChange={(v) => onDeliveryInfoChange({ 
                ...deliveryInfo, 
                country: v 
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryPhone">Téléphone *</Label>
            <Input
              id="deliveryPhone"
              type="tel"
              value={deliveryInfo.phone}
              onChange={(e) => onDeliveryInfoChange({ 
                ...deliveryInfo, 
                phone: e.target.value 
              })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryNotes">Instructions de livraison</Label>
          <Textarea
            id="deliveryNotes"
            value={deliveryInfo.notes}
            onChange={(e) => onDeliveryInfoChange({ 
              ...deliveryInfo, 
              notes: e.target.value 
            })}
            placeholder="Digicode, étage, horaires préférés..."
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button variant="hero" onClick={onNext} className="flex-1">
            Continuer vers le paiement
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}