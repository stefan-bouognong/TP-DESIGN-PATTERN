import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent, Clock, Zap, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { promotionsService } from '@/api/promotions.service';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ClearanceCommandProps {
  onSuccess?: () => void;
}

export function ClearanceCommand({ onSuccess }: ClearanceCommandProps) {
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [discount, setDiscount] = useState([20]); // 20% par défaut
  const [loading, setLoading] = useState(false);

  const handleApplyClearance = async () => {
    try {
      setLoading(true);
      const response = await promotionsService.applyClearance(daysThreshold, discount[0] / 100);
      
      toast.success(
        `Solde appliquée avec succès aux véhicules de plus de ${daysThreshold} jours`,
        {
          description: response.message || `Remise de ${discount[0]}% appliquée`
        }
      );

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erreur lors de la clearance:', error);
      toast.error(
        'Erreur lors de l\'application de la solde',
        {
          description: error.response?.data?.message || 'Veuillez réessayer'
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Commande de Clearance
        </CardTitle>
        <CardDescription>
          Appliquez automatiquement des promotions aux véhicules restés longtemps en stock
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cette action appliquera une réduction à tous les véhicules disponibles en stock depuis plus de X jours.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="days" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Seuil d'ancienneté (jours)
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="days"
                type="number"
                min="0"
                max="365"
                value={daysThreshold}
                onChange={(e) => setDaysThreshold(Number(e.target.value))}
                className="max-w-[150px]"
              />
              <span className="text-sm text-muted-foreground">
                Cible les véhicules de plus de {daysThreshold} jours en stock
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="discount" className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                Taux de réduction
              </Label>
              <span className="text-2xl font-bold text-accent">{discount[0]}%</span>
            </div>
            
            <Slider
              value={discount}
              onValueChange={setDiscount}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>5%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="font-medium mb-2">Résumé de l'action</h4>
            <ul className="space-y-1 text-sm">
              <li>• S'applique aux véhicules disponibles de plus de {daysThreshold} jours</li>
              <li>• Réduction de {discount[0]}% sur le prix original</li>
              <li>• Marque les véhicules comme "en promotion"</li>
              <li>• Modification du prix de vente</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleApplyClearance}
          disabled={loading}
          variant="hero"
          className="w-full"
        >
          {loading ? 'Application en cours...' : `Appliquer la solde de ${discount[0]}%`}
        </Button>
      </CardFooter>
    </Card>
  );
}