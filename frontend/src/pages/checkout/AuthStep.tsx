import { User, Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthStepProps {
  isAuthenticated: boolean;
  userEmail?: string;
  onNext: () => void;
  onOpenAuthModal: () => void;
}

export function AuthStep({  onNext, onOpenAuthModal }: AuthStepProps) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Identification
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAuthenticated ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium">Connecté en tant que</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
            <Button variant="hero" onClick={onNext} className="w-full">
              Continuer vers la livraison
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Pour finaliser votre commande, veuillez vous connecter ou créer un compte.
            </p>
            <Button variant="hero" onClick={onOpenAuthModal} className="w-full">
              Se connecter / Créer un compte
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}