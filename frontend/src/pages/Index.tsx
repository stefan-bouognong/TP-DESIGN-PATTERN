import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import {
  ArrowRight,
  Car,
  Zap,
  Shield,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';
import { catalogService } from '@/api/catalog.service';
import { useAuthStore } from '@/store/useAuthStore';

interface FeaturedVehicle {
  id: number;
  name: string;
  model: string;
  price: number;
  originalPrice?: number;
  isPromotion: boolean;
  discountPercentage?: number;
  available: boolean;
  image: string;
}

const features = [
  {
    icon: Car,
    title: 'Large sélection',
    description:
      'Automobiles et scooters, neufs et occasion de toutes les marques.',
  },
  {
    icon: Zap,
    title: 'Mobilité électrique',
    description:
      'Une gamme complète de véhicules électriques pour un avenir durable.',
  },
  {
    icon: Shield,
    title: 'Garantie étendue',
    description:
      "Tous nos véhicules bénéficient d'une garantie constructeur.",
  },
  {
    icon: Wallet,
    title: 'Financement adapté',
    description:
      'Solutions de crédit et leasing personnalisées à vos besoins.',
  },
];

export default function Index() {
  const [featuredVehicles, setFeaturedVehicles] = useState<FeaturedVehicle[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await catalogService.getBasicCatalog({
          available: true,
        });

        const vehicles = response.data.vehicles;
        console.log(vehicles)
        const mappedVehicles = vehicles.slice(0, 4).map((v) => ({
          id: v.vehicleId,
          name: v.name,
          model: v.model,
          brand: v.brand,
          description: v.description,
        
          price: v.price,
          originalPrice: v.onSale ? v.price : undefined,
          isPromotion: v.onSale,
          promotionPercentage: v.discountPercentage ?? 0,
        
          available: v.available,
          status: v.available ? 'available' : 'sold',
        
          fuelType: v.type === 'ELECTRICCAR' ? 'electric' : 'fuel',
          type: v.type === 'SCOOTER' ? 'scooter' : 'car',
        
          year: v.year,
          power: 0, // ou v.power si dispo
          transmission: 'automatic',
        
          // 🔥🔥🔥 LE POINT CLÉ 🔥🔥🔥
          imageUrl: v.imageUrl,
        
          daysInStock: 0,
        }));
        
        setFeaturedVehicles(mappedVehicles);
      } catch (error) {
        console.error('Erreur lors du chargement des véhicules', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="DriveDeal showroom"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
               Nouvelle collection 2024
            </span>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Trouvez le véhicule <br />
              <span className="text-accent">de vos rêves</span>
            </h1>

            <p className="text-lg text-primary-foreground/80 mb-8">
              Découvrez notre sélection exclusive d'automobiles et de scooters.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/catalog">
                  Explorer le catalogue
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              {user.customerType == 'ADMIN' && (
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Pourquoi choisir <span className="text-accent">DriveDeal</span> ?
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="p-6 rounded-2xl bg-card border"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
                Véhicules en vedette
              </h2>
              <p className="text-muted-foreground">
                Nos meilleures offres du moment
              </p>
            </div>

            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link to="/catalog">
                Voir tout
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : (
              featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-hero-gradient text-primary-foreground">
        <div className="container text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Prêt à rouler ?
          </h2>
          <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
            Contactez-nous pour un essai gratuit ou visitez notre showroom.
            Notre équipe est à votre disposition.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="hero" size="lg">
              Demander un essai
            </Button>
            <Button variant="heroOutline" size="lg">
              Nous contacter
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
