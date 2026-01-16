import { CreditCard, Wallet, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentMethod, CreditRequest } from '@/types/auth';

interface PaymentStepProps {
  paymentMethod: PaymentMethod;
  creditRequest: CreditRequest;
  total: number;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCreditRequestChange: (request: CreditRequest) => void;
  onNext: () => void;
  onPrev: () => void;
  formatPrice: (price: number) => string;
}

export function PaymentStep({
  paymentMethod,
  creditRequest,
  total,
  onPaymentMethodChange,
  onCreditRequestChange,
  onNext,
  onPrev,
  formatPrice
}: PaymentStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Mode de paiement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => onPaymentMethodChange(v as PaymentMethod)}
          className="space-y-4"
        >
          <Label
            htmlFor="cash"
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'cash'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <RadioGroupItem value="cash" id="cash" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="font-medium">Paiement comptant</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Règlement intégral par virement ou carte bancaire
              </p>
            </div>
          </Label>

          <Label
            htmlFor="credit"
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'credit'
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <RadioGroupItem value="credit" id="credit" className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span className="font-medium">Demande de crédit</span>
                <Badge variant="secondary">Sous réserve d'acceptation</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Financement en plusieurs mensualités
              </p>
            </div>
          </Label>
        </RadioGroup>

        {paymentMethod === 'credit' && (
          <div className="space-y-4 p-4 rounded-xl bg-secondary/50">
            <h4 className="font-medium">Informations pour la demande de crédit</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Revenus mensuels nets (FCFA) *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={creditRequest.monthlyIncome || ''}
                  onChange={(e) => onCreditRequestChange({ 
                    ...creditRequest, 
                    monthlyIncome: parseFloat(e.target.value) || 0 
                  })}
                  placeholder="3000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée souhaitée *</Label>
                <Select 
                  value={creditRequest.desiredDuration.toString()} 
                  onValueChange={(v) => onCreditRequestChange({ 
                    ...creditRequest, 
                    desiredDuration: parseInt(v) as 12 | 24 | 36 | 48 | 60 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 mois</SelectItem>
                    <SelectItem value="24">24 mois</SelectItem>
                    <SelectItem value="36">36 mois</SelectItem>
                    <SelectItem value="48">48 mois</SelectItem>
                    <SelectItem value="60">60 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentStatus">Situation professionnelle *</Label>
              <Select 
                value={creditRequest.employmentStatus} 
                onValueChange={(v) => onCreditRequestChange({ 
                  ...creditRequest, 
                  employmentStatus: v as 'employed' | 'self-employed' | 'retired' | 'other' 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Salarié(e)</SelectItem>
                  <SelectItem value="self-employed">Indépendant(e)</SelectItem>
                  <SelectItem value="retired">Retraité(e)</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {creditRequest.employmentStatus === 'employed' && (
              <div className="space-y-2">
                <Label htmlFor="employerName">Nom de l'employeur</Label>
                <Input
                  id="employerName"
                  value={creditRequest.employerName}
                  onChange={(e) => onCreditRequestChange({ 
                    ...creditRequest, 
                    employerName: e.target.value 
                  })}
                  placeholder="Nom de votre entreprise"
                />
              </div>
            )}

            {creditRequest.monthlyIncome > 0 && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm">
                  Mensualité estimée : <span className="font-bold text-accent">
                    {formatPrice(total / creditRequest.desiredDuration)}
                  </span> / mois
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estimation non contractuelle, sous réserve d'acceptation du dossier
                </p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={onPrev}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Button variant="hero" onClick={onNext} className="flex-1">
            Vérifier la commande
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}