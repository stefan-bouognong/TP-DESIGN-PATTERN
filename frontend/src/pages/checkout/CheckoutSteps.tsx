import { ArrowRight, Check, CreditCard, Truck, User } from 'lucide-react';

export type CheckoutStep = 'auth' | 'delivery' | 'payment' | 'confirmation';

interface CheckoutStepsProps {
  currentStep: CheckoutStep;
}

const steps: { 
  key: CheckoutStep; 
  label: string; 
  icon: React.ComponentType<{ className?: string }> 
}[] = [
  { key: 'auth', label: 'Compte', icon: User },
  { key: 'delivery', label: 'Livraison', icon: Truck },
  { key: 'payment', label: 'Paiement', icon: CreditCard },
  { key: 'confirmation', label: 'Confirmation', icon: Check },
];

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, index) => {
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
          const isCurrent = step.key === currentStep;
          
          return (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isCompleted
                      ? 'bg-success/20 text-success'
                      : 'bg-secondary text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline text-sm font-medium">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}