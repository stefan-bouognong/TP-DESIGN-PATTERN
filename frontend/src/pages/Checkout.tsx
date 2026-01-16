import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AuthModal } from '@/components/auth/AuthModal';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  CreditCard, 
  Wallet, 
  Truck, 
  FileText,
  ShoppingCart,
  User,
  Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { countries } from '@/data/mockVehicles';
import { toast } from 'sonner';
import { DeliveryInfo, PaymentMethod, CreditRequest } from '@/types/auth';

type CheckoutStep = 'auth' | 'delivery' | 'payment' | 'confirmation';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, taxes, total, deliveryCountry, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(isAuthenticated ? 'delivery' : 'auth');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Delivery form
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    firstName: user?.profile.type === 'individual' 
      ? user.profile.firstName 
      : user?.profile.type === 'company' 
        ? user.profile.contactFirstName 
        : '',
    lastName: user?.profile.type === 'individual'
      ? user.profile.lastName
      : user?.profile.type === 'company'
        ? user.profile.contactLastName
        : '',
    address: user?.profile.address || '',
    city: user?.profile.city || '',
    postalCode: user?.profile.postalCode || '',
    country: user?.profile.country || deliveryCountry,
    phone: user?.profile.phone || '',
    notes: '',
  });
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [creditRequest, setCreditRequest] = useState<CreditRequest>({
    monthlyIncome: 0,
    employmentStatus: 'employed',
    employerName: '',
    desiredDuration: 48,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price);

  const steps: { key: CheckoutStep; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'auth', label: 'Compte', icon: User },
    { key: 'delivery', label: 'Livraison', icon: Truck },
    { key: 'payment', label: 'Paiement', icon: CreditCard },
    { key: 'confirmation', label: 'Confirmation', icon: Check },
  ];

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setCurrentStep('delivery');
  };

  const validateDelivery = (): boolean => {
    const { firstName, lastName, address, city, postalCode, country, phone } = deliveryInfo;
    if (!firstName || !lastName || !address || !city || !postalCode || !country || !phone) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return false;
    }
    return true;
  };

  const validatePayment = (): boolean => {
    if (paymentMethod === 'credit') {
      if (!creditRequest.monthlyIncome || creditRequest.monthlyIncome <= 0) {
        toast.error('Veuillez indiquer vos revenus mensuels');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 'auth') {
      if (!isAuthenticated) {
        setAuthModalOpen(true);
        return;
      }
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery') {
      if (validateDelivery()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      if (validatePayment()) {
        setCurrentStep('confirmation');
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'delivery') setCurrentStep('auth');
    else if (currentStep === 'payment') setCurrentStep('delivery');
    else if (currentStep === 'confirmation') setCurrentStep('payment');
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order ID
      const orderId = `CMD-${Date.now().toString().slice(-6)}`;
      
      toast.success(`Commande ${orderId} confirmée !`);
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (error) {
      toast.error('Erreur lors de la confirmation de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
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

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        {/* Progress Steps */}
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Auth Step */}
            {currentStep === 'auth' && (
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
                      <Button variant="hero" onClick={handleNextStep} className="w-full">
                        Continuer vers la livraison
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      <p className="text-muted-foreground">
                        Pour finaliser votre commande, veuillez vous connecter ou créer un compte.
                      </p>
                      <Button variant="hero" onClick={() => setAuthModalOpen(true)} className="w-full">
                        Se connecter / Créer un compte
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Delivery Step */}
            {currentStep === 'delivery' && (
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
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryLastName">Nom *</Label>
                      <Input
                        id="deliveryLastName"
                        value={deliveryInfo.lastName}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryAddress">Adresse *</Label>
                    <Input
                      id="deliveryAddress"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCity">Ville *</Label>
                      <Input
                        id="deliveryCity"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryPostalCode">Code postal *</Label>
                      <Input
                        id="deliveryPostalCode"
                        value={deliveryInfo.postalCode}
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, postalCode: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCountry">Pays *</Label>
                      <Select 
                        value={deliveryInfo.country} 
                        onValueChange={(v) => setDeliveryInfo({ ...deliveryInfo, country: v })}
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
                        onChange={(e) => setDeliveryInfo({ ...deliveryInfo, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryNotes">Instructions de livraison</Label>
                    <Textarea
                      id="deliveryNotes"
                      value={deliveryInfo.notes}
                      onChange={(e) => setDeliveryInfo({ ...deliveryInfo, notes: e.target.value })}
                      placeholder="Digicode, étage, horaires préférés..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button variant="hero" onClick={handleNextStep} className="flex-1">
                      Continuer vers le paiement
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
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
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
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

                  {/* Credit Request Form */}
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
                            onChange={(e) => setCreditRequest({ 
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
                            onValueChange={(v) => setCreditRequest({ 
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
                          onValueChange={(v) => setCreditRequest({ 
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
                            onChange={(e) => setCreditRequest({ ...creditRequest, employerName: e.target.value })}
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
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button variant="hero" onClick={handleNextStep} className="flex-1">
                      Vérifier la commande
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirmation Step */}
            {currentStep === 'confirmation' && (
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
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep('delivery')}>
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
                      <Button variant="ghost" size="sm" onClick={() => setCurrentStep('payment')}>
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
                            // src={item.vehicle.images[0]}
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
                    <Button variant="outline" onClick={handlePrevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour
                    </Button>
                    <Button 
                      variant="hero" 
                      onClick={handleConfirmOrder} 
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
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.vehicle.id} className="flex items-center gap-3">
                      <img
                        // src={item.vehicle.images[0]}
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
          </div>
        </div>
      </div>

      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        defaultTab="register"
        onSuccess={handleAuthSuccess}
      />
    </Layout>
  );
}
