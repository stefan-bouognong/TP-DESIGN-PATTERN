import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { mockVehicles } from '@/data/mockVehicles';
import { ArrowRight, Car, Zap, Shield, Wallet, ChevronRight } from 'lucide-react';
import heroImage from '@/assets/hero-car.jpg';

const featuredVehicles = mockVehicles.filter((v) => v.isPromotion || v.fuelType === 'electric').slice(0, 4);

const features = [
  {
    icon: Car,
    title: 'Large sélection',
    description: 'Automobiles et scooters, neufs et occasion de toutes les marques.',
  },
  {
    icon: Zap,
    title: 'Mobilité électrique',
    description: 'Une gamme complète de véhicules électriques pour un avenir durable.',
  },
  {
    icon: Shield,
    title: 'Garantie étendue',
    description: 'Tous nos véhicules bénéficient d\'une garantie constructeur.',
  },
  {
    icon: Wallet,
    title: 'Financement adapté',
    description: 'Solutions de crédit et leasing personnalisées à vos besoins.',
  },
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="DriveDeal showroom"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent" />
        </div>

        {/* Content */}
        <div className="container relative z-10 py-20">
          <div className="max-w-2xl animate-fade-in">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6 animate-bounce-subtle">
              🚗 Nouvelle collection 2024
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Trouvez le véhicule <br />
              <span className="text-accent">de vos rêves</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl">
              Découvrez notre sélection exclusive d'automobiles et de scooters. 
              Électriques ou thermiques, nous avons le véhicule parfait pour vous.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/catalog">
                  Explorer le catalogue
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/admin">Espace Admin</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-foreground/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Pourquoi choisir <span className="text-accent">DriveDeal</span> ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une expérience d'achat exceptionnelle avec un service personnalisé.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-card transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
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
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link to="/catalog">
                Voir tout le catalogue
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
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
