import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Car, Zap, Fuel, Loader2, CheckCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { vehiclesApi, type Vehicle } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

const vehicleSchema = z.object({
  model: z.string().min(2, 'Model must be at least 2 characters'),
  price: z.number().min(1, 'Price must be positive'),
  color: z.string().min(2, 'Color is required'),
  year: z.number().min(1900).max(new Date().getFullYear() + 1, 'Invalid year'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

const VehicleCreate = () => {
  const [factoryType, setFactoryType] = useState<'ELECTRIC' | 'GASOLINE'>('ELECTRIC');
  const [vehicleType, setVehicleType] = useState<'CAR' | 'SCOOTER'>('CAR');
  const [isLoading, setIsLoading] = useState(false);
  const [createdVehicle, setCreatedVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Vérifier que l'utilisateur est admin
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      toast({
        title: 'Accès refusé',
        description: 'Cette page est réservée aux administrateurs.',
        variant: 'destructive',
      });
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate, toast]);

  // Afficher un message si l'utilisateur n'est pas admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen py-12 bg-muted/30 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" />
              Accès refusé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cette page est réservée aux administrateurs. Seuls les administrateurs peuvent créer des véhicules.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      model: '',
      price: 0,
      color: '',
      year: new Date().getFullYear(),
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    setIsLoading(true);
    setCreatedVehicle(null);

    try {
      const vehicle = await vehiclesApi.create({
        factoryType,
        vehicleType,
        model: data.model,
        price: data.price,
        color: data.color,
        year: data.year,
      });

      setCreatedVehicle(vehicle);
      toast({
        title: 'Vehicle Created!',
        description: `${vehicle.description} has been added to the inventory.`,
      });
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create vehicle',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              Abstract Factory Pattern
            </span>
            <h1 className="section-heading">Create New Vehicle</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Use our Abstract Factory to create electric or gasoline vehicles - cars or scooters
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Factory Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Select Factory Type</CardTitle>
                  <CardDescription>Choose the energy type for your vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={factoryType}
                    onValueChange={(v) => setFactoryType(v as 'ELECTRIC' | 'GASOLINE')}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="ELECTRIC" className="gap-2">
                        <Zap className="w-4 h-4" />
                        Electric
                      </TabsTrigger>
                      <TabsTrigger value="GASOLINE" className="gap-2">
                        <Fuel className="w-4 h-4" />
                        Gasoline
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="ELECTRIC" className="mt-4">
                      <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                          Electric vehicles are eco-friendly with zero emissions and lower running costs.
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="GASOLINE" className="mt-4">
                      <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-amber-700 dark:text-amber-300">
                          Gasoline vehicles offer longer range and extensive refueling infrastructure.
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Select Vehicle Type</CardTitle>
                  <CardDescription>Choose the type of vehicle to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setVehicleType('CAR')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        vehicleType === 'CAR'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Car className={`w-12 h-12 mx-auto mb-3 ${vehicleType === 'CAR' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="font-display font-bold">Car</div>
                      <div className="text-xs text-muted-foreground">4 wheels, full comfort</div>
                    </button>
                    <button
                      onClick={() => setVehicleType('SCOOTER')}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        vehicleType === 'SCOOTER'
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Car className={`w-12 h-12 mx-auto mb-3 ${vehicleType === 'SCOOTER' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="font-display font-bold">Scooter</div>
                      <div className="text-xs text-muted-foreground">Urban mobility</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Vehicle Details</CardTitle>
                <CardDescription>Enter the specifications for your {factoryType.toLowerCase()} {vehicleType.toLowerCase()}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="model">Model Name</Label>
                    <Input
                      id="model"
                      placeholder="e.g., Tesla Model 3"
                      className="input-field"
                      {...register('model')}
                    />
                    {errors.model && (
                      <p className="text-sm text-destructive">{errors.model.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="45000"
                      className="input-field"
                      {...register('price', { valueAsNumber: true })}
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        placeholder="Red"
                        className="input-field"
                        {...register('color')}
                      />
                      {errors.color && (
                        <p className="text-sm text-destructive">{errors.color.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        type="number"
                        placeholder="2024"
                        className="input-field"
                        {...register('year', { valueAsNumber: true })}
                      />
                      {errors.year && (
                        <p className="text-sm text-destructive">{errors.year.message}</p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Car className="w-4 h-4 mr-2" />
                        Create {factoryType} {vehicleType}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Result */}
          {createdVehicle && (
            <Card className="border-success bg-success/5 animate-scale-in">
              <CardHeader>
                <CardTitle className="font-display flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  Vehicle Created Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="font-semibold">{createdVehicle.model}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="font-semibold">{createdVehicle.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Energy</div>
                    <div className="font-semibold">{createdVehicle.energyType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Price</div>
                    <div className="font-semibold">${createdVehicle.price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted">
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="font-medium">{createdVehicle.description}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCreate;
