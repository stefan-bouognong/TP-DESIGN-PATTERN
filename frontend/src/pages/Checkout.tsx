import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

import { AuthModal } from '@/components/auth/AuthModal';
import { toast } from 'sonner';
import { DeliveryInfo, PaymentMethod, CreditRequest } from '@/types/auth';
import { useOrder } from '@/hooks/useOrder';
import { CheckoutSteps, CheckoutStep } from './checkout/CheckoutSteps';
import { AuthStep } from './checkout/AuthStep';
import { DeliveryStep } from './checkout/DeliveryStep';
import { PaymentStep } from './checkout/PaymentStep';
import { ConfirmationStep } from './checkout/ConfirmationStep';
import { OrderSummary } from './checkout/OrderSummary';
import { EmptyCart } from './checkout/EmptyCart';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/contexts/CartContext';

export default function Checkout() {
  const navigate = useNavigate();

const items = useCartStore(state => state.items)
const subtotal = useCartStore(state => state.subtotal)
const taxes = useCartStore(state => state.taxes)
const total = useCartStore(state => state.total)
const deliveryCountry = useCartStore(state => state.deliveryCountry) 
 const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { createOrder, isProcessing } = useOrder();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(isAuthenticated ? 'delivery' : 'auth');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  console.log('User in Checkout:', user);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    firstName: user.profile.firstName ,
    lastName: user.profile.lastName,
    address: user?.profile.address || '',
    city: user?.profile.city || '',
    postalCode: user?.profile.postalCode || '',
    country: user?.profile.nationality ,
    phone: user?.profile.phone || '',
    notes: '',
  });
        
  
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
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price);

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
    const order = await createOrder({
      deliveryInfo,
      paymentMethod,
      creditRequest: paymentMethod === 'credit' ? creditRequest : undefined,
    });

    if (order) {
      // Rediriger vers la page de succès avec l'ID de la commande
      navigate(`/order-success/${order.id}`, {
        state: { order }
      });
    }
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <Layout showFooter={false}>
      <div className="container py-8">
        <CheckoutSteps currentStep={currentStep} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 'auth' && (
              <AuthStep
                isAuthenticated={isAuthenticated}
                userEmail={user?.email}
                onNext={handleNextStep}
                onOpenAuthModal={() => setAuthModalOpen(true)}
              />
            )}

            {currentStep === 'delivery' && (
              <DeliveryStep
                deliveryInfo={deliveryInfo}
                onDeliveryInfoChange={setDeliveryInfo}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
              />
            )}

            {currentStep === 'payment' && (
              <PaymentStep
                paymentMethod={paymentMethod}
                creditRequest={creditRequest}
                total={total}
                onPaymentMethodChange={setPaymentMethod}
                onCreditRequestChange={setCreditRequest}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                formatPrice={formatPrice}
              />
            )}

            {currentStep === 'confirmation' && (
              <ConfirmationStep
                deliveryInfo={deliveryInfo}
                paymentMethod={paymentMethod}
                creditRequest={creditRequest}
                items={items}
                isProcessing={isProcessing}
                onConfirm={handleConfirmOrder}
                onPrev={handlePrevStep}
                onEditDelivery={() => setCurrentStep('delivery')}
                onEditPayment={() => setCurrentStep('payment')}
                formatPrice={formatPrice}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              taxes={taxes}
              total={total}
              deliveryCountry={deliveryCountry}
              formatPrice={formatPrice}
            />
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