import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingCart, CreditCard, Banknote, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/lib/api';

const orderSchema = z.object({
  clientId: z.number().min(1, 'Select a client'),
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  billingAddress: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderItem {
  vehicleId: number;
  vehicleModel: string;
  quantity: number;
  unitPrice: number;
}

// Mock data
const mockClients = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'AutoGroup Corp' },
  { id: 3, name: 'Marie Martin' },
];

const mockVehicles = [
  { id: 1, model: 'Tesla Model 3', price: 45000 },
  { id: 2, model: 'Toyota Corolla', price: 25000 },
  { id: 3, model: 'Niu NQi GT', price: 3500 },
  { id: 4, model: 'Ford Mustang Mach-E', price: 55000 },
];

const OrderCreate = () => {
  const [orderType, setOrderType] = useState<'CASH' | 'CREDIT'>('CASH');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [creditMonths, setCreditMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(4.5);
  const [isLoading, setIsLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  });

  const addItem = (vehicleId: number) => {
    const vehicle = mockVehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return;

    const existingItem = items.find((i) => i.vehicleId === vehicleId);
    if (existingItem) {
      setItems(
        items.map((i) =>
          i.vehicleId === vehicleId ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setItems([
        ...items,
        {
          vehicleId: vehicle.id,
          vehicleModel: vehicle.model,
          quantity: 1,
          unitPrice: vehicle.price,
        },
      ]);
    }
  };

  const removeItem = (vehicleId: number) => {
    setItems(items.filter((i) => i.vehicleId !== vehicleId));
  };

  const updateQuantity = (vehicleId: number, quantity: number) => {
    if (quantity < 1) {
      removeItem(vehicleId);
      return;
    }
    setItems(
      items.map((i) => (i.vehicleId === vehicleId ? { ...i, quantity } : i))
    );
  };

  const totalAmount = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cashDiscount = orderType === 'CASH' ? totalAmount * 0.05 : 0;
  const finalAmount = totalAmount - cashDiscount;

  const monthlyPayment =
    orderType === 'CREDIT'
      ? (finalAmount * (1 + interestRate / 100)) / creditMonths
      : 0;

  const onSubmit = async (data: OrderFormData) => {
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one vehicle to the order.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const order: Order = {
        id: Math.floor(Math.random() * 1000),
        clientId: data.clientId,
        clientName: mockClients.find((c) => c.id === data.clientId)?.name || '',
        orderType,
        status: 'PENDING',
        totalAmount: finalAmount,
        orderDate: new Date().toISOString(),
        items: items.map((item, idx) => ({
          id: idx + 1,
          vehicleId: item.vehicleId,
          vehicleModel: item.vehicleModel,
          vehicleType: 'Car',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subTotal: item.unitPrice * item.quantity,
        })),
        cashDiscount: orderType === 'CASH' ? 5.0 : undefined,
        months: orderType === 'CREDIT' ? creditMonths : undefined,
        interestRate: orderType === 'CREDIT' ? interestRate : undefined,
        monthlyPayment: orderType === 'CREDIT' ? monthlyPayment : undefined,
      };

      setCreatedOrder(order);
      toast({
        title: 'Order Created!',
        description: `Order #${order.id} has been created successfully.`,
      });
      reset();
      setItems([]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Factory Method Pattern
          </span>
          <h1 className="section-heading">Create Order</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create cash or credit orders with automatic calculations and discounts
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Type */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Order Type</CardTitle>
                <CardDescription>Select payment method for this order</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={orderType}
                  onValueChange={(v) => setOrderType(v as 'CASH' | 'CREDIT')}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="CASH" className="gap-2">
                      <Banknote className="w-4 h-4" />
                      Cash (5% discount)
                    </TabsTrigger>
                    <TabsTrigger value="CREDIT" className="gap-2">
                      <CreditCard className="w-4 h-4" />
                      Credit
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="CASH" className="mt-4">
                    <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                      <p className="text-sm text-success">
                        Pay upfront and receive a 5% discount on your total order!
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="CREDIT" className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Duration (months)</Label>
                        <Select
                          value={creditMonths.toString()}
                          onValueChange={(v) => setCreditMonths(parseInt(v))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[12, 24, 36, 48, 60].map((m) => (
                              <SelectItem key={m} value={m.toString()}>
                                {m} months
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                          className="input-field"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Add Vehicles */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Add Vehicles</CardTitle>
                <CardDescription>Select vehicles to add to this order</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {mockVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      onClick={() => addItem(vehicle.id)}
                      className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold group-hover:text-primary">
                            {vehicle.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${vehicle.price.toLocaleString()}
                          </div>
                        </div>
                        <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client & Address */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Customer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="order-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Client</Label>
                    <Select onValueChange={(v) => setValue('clientId', parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClients.map((client) => (
                          <SelectItem key={client.id} value={client.id.toString()}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.clientId && (
                      <p className="text-sm text-destructive">{errors.clientId.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Shipping Address</Label>
                    <Input
                      {...register('shippingAddress')}
                      placeholder="Enter shipping address"
                      className="input-field"
                    />
                    {errors.shippingAddress && (
                      <p className="text-sm text-destructive">{errors.shippingAddress.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Billing Address (optional)</Label>
                    <Input
                      {...register('billingAddress')}
                      placeholder="Same as shipping if empty"
                      className="input-field"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No items added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.vehicleId}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{item.vehicleModel}</div>
                          <div className="text-sm text-muted-foreground">
                            ${item.unitPrice.toLocaleString()} × {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.vehicleId, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.vehicleId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.vehicleId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${totalAmount.toLocaleString()}</span>
                  </div>
                  {orderType === 'CASH' && cashDiscount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Cash Discount (5%)</span>
                      <span>-${cashDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">${finalAmount.toLocaleString()}</span>
                  </div>
                  {orderType === 'CREDIT' && (
                    <div className="flex justify-between text-sm text-accent">
                      <span>Monthly Payment</span>
                      <span>${monthlyPayment.toFixed(2)}/mo</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  form="order-form"
                  className="w-full btn-accent"
                  disabled={isLoading || items.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    <>
                      Create {orderType} Order
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Created Order Result */}
        {createdOrder && (
          <div className="max-w-4xl mx-auto mt-8">
            <Card className="border-success bg-success/5 animate-scale-in">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  Order #{createdOrder.id} Created Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Client</div>
                    <div className="font-semibold">{createdOrder.clientName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="font-semibold">{createdOrder.orderType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="font-semibold">{createdOrder.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-semibold text-primary">
                      ${createdOrder.totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCreate;
