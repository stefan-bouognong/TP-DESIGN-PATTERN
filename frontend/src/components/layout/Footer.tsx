import { Car, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Car className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight">
                DriveDeal
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/70">
              Votre partenaire de confiance pour l'achat de véhicules neufs et d'occasion.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold">Navigation</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-accent transition-colors">Accueil</Link></li>
              <li><Link to="/catalog" className="hover:text-accent transition-colors">Catalogue</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors">Panier</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>Financement</li>
              <li>Reprise de véhicule</li>
              <li>Garantie étendue</li>
              <li>Entretien & SAV</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                123 Avenue des Champs-Élysées, Paris
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent" />
                +33 1 23 45 67 89
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                contact@drivedeal.fr
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} DriveDeal. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
