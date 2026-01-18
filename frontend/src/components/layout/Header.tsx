import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/contexts/CartContext';

export function Header() {
  const itemCount  = useCartStore((state) => state.getItemCount());
  const items = useCartStore((state) => state.items);
  // const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
 
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAdmin = location.pathname.startsWith('/admin');
  
  const navLinks = isAdmin
    ? [
        { href: '/admin', label: 'Tableau de bord' },
        { href: '/admin/vehicles', label: 'Véhicules' },
        { href: '/admin/orders', label: 'Commandes' },
        { href: '/admin/customers', label: 'Clients' },
      ]
    : [
        { href: '/', label: 'Accueil' },
        { href: '/catalog', label: 'Catalogue' },
        { href: '/cart', label: 'Panier' },
        { href: '/orders', label: 'Orders' },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-105">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">
            Drive<span className="text-accent">Deal</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === link.href
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isAdmin && (
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
          )}
          
          <Link to={isAdmin ? '/' : '/admin'}>
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <User className="h-4 w-4 mr-2" />
              {isAdmin ? 'Client' : 'Admin'}
            </Button>
          </Link>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-up">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={isAdmin ? '/' : '/admin'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              {isAdmin ? 'Espace Client' : 'Espace Admin'}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
