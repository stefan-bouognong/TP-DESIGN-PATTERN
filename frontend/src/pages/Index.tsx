import { Link } from 'react-router-dom';
import { ArrowRight, Car, Zap, FileText, Users, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-car.jpg';

const features = [
  {
    icon: Car,
    title: 'Extensive Catalog',
    description: 'Browse through our diverse collection of electric and gasoline vehicles.',
  },
  {
    icon: Zap,
    title: 'Electric Focus',
    description: 'Leading the transition to sustainable mobility with premium EVs.',
  },
  {
    icon: FileText,
    title: 'Smart Documents',
    description: 'Automated document generation and management for every transaction.',
  },
  {
    icon: Users,
    title: 'Fleet Solutions',
    description: 'Corporate accounts with hierarchical structure and volume discounts.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Financing',
    description: 'Flexible cash and credit options tailored to your needs.',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Updates',
    description: 'Stay informed with instant notifications on promotions and arrivals.',
  },
];

const designPatterns = [
  { name: 'Abstract Factory', path: '/vehicles/create', desc: 'Create vehicles by type' },
  { name: 'Builder', path: '/documents/bundle', desc: 'Generate document bundles' },
  { name: 'Factory Method', path: '/orders/create', desc: 'Create orders' },
  { name: 'Singleton', path: '/documents/templates', desc: 'View templates' },
  { name: 'Adapter', path: '/documents/pdf', desc: 'Convert to PDF' },
  { name: 'Bridge', path: '/forms/generate', desc: 'Dynamic forms' },
  { name: 'Composite', path: '/clients', desc: 'Manage clients' },
  { name: 'Decorator', path: '/catalog/decorated', desc: 'Enhanced catalog' },
  { name: 'Observer', path: '/observers', desc: 'Event system' },
  { name: 'Iterator', path: '/catalog/iterator', desc: 'Browse catalog' },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="DriveDeal Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 py-20">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4 animate-fade-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="w-4 h-4" />
                The Future of Vehicle Sales
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
                Drive Your
                <span className="text-gradient-hero block">Dream Today</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Discover premium electric and gasoline vehicles with seamless financing, 
                smart documentation, and exceptional service.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-up opacity-0 delay-200">
              <Button asChild size="lg" className="btn-accent text-lg px-8">
                <Link to="/catalog/iterator">
                  Explore Catalog
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 border-2">
                <Link to="/vehicles/create">Create Vehicle</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50 animate-fade-up opacity-0 delay-300">
              <div>
                <div className="text-3xl font-display font-bold text-foreground">500+</div>
                <div className="text-sm text-muted-foreground">Vehicles Available</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-accent">24h</div>
                <div className="text-sm text-muted-foreground">Delivery Time</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="section-heading">
              Why Choose <span className="text-primary">DriveDeal</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the next generation of vehicle purchasing with our comprehensive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-card rounded-2xl border border-border p-8 card-hover animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Patterns Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
              Powered by Design Patterns
            </span>
            <h2 className="section-heading">
              Explore All <span className="text-accent">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform implements 11 classic design patterns for robust, scalable architecture
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {designPatterns.map((pattern, index) => (
              <Link
                key={pattern.name}
                to={pattern.path}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 card-hover animate-fade-up opacity-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
                <h4 className="font-display font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                  {pattern.name}
                </h4>
                <p className="text-sm text-muted-foreground">{pattern.desc}</p>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Ready to Find Your Perfect Vehicle?
            </h2>
            <p className="text-xl text-primary-foreground/80">
              Join thousands of satisfied customers who found their dream car with DriveDeal
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 text-lg px-8"
              >
                <Link to="/catalog/iterator">Browse Catalog</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
              >
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                Drive<span className="text-accent">Deal</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 DriveDeal. All rights reserved. Built with Design Patterns.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
