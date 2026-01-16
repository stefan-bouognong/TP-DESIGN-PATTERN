import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Car, ChevronDown, User, LogOut, ShoppingCart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { setAuthToken } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

/**
 * Liens de navigation de base (accessibles à tous)
 */
const publicNavLinks = [
  { label: 'Catalog', href: '/catalog/iterator', roles: [] }, // Accessible à tous
];

/**
 * Liens de navigation pour les utilisateurs authentifiés
 */
const authenticatedNavLinks = [
  { label: 'Orders', href: '/orders/create', roles: ['ADMIN', 'CLIENT'] },
  {
    label: 'Documents',
    children: [
      { label: 'Templates', href: '/documents/templates', roles: ['ADMIN', 'CLIENT'] },
      { label: 'Bundle Builder', href: '/documents/bundle', roles: ['ADMIN', 'CLIENT'] },
      { label: 'PDF Converter', href: '/documents/pdf', roles: ['ADMIN', 'CLIENT'] },
    ],
  },
];

/**
 * Liens de navigation réservés aux administrateurs
 */
const adminNavLinks = [
  { label: 'Vehicles', href: '/vehicles/create', roles: ['ADMIN'] },
  { label: 'Clients', href: '/clients', roles: ['ADMIN'] },
  {
    label: 'Tools',
    children: [
      { label: 'Form Generator', href: '/forms/generate', roles: ['ADMIN'] },
      { label: 'Observer Events', href: '/observers', roles: ['ADMIN'] },
    ],
  },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role, isAdmin, logout: logoutContext } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  /**
   * Vérifie si un lien est accessible selon le rôle de l'utilisateur
   */
  const isLinkAccessible = (linkRoles: string[]) => {
    if (linkRoles.length === 0) return true; // Accessible à tous
    if (!isAuthenticated) return false;
    return linkRoles.includes(role || '');
  };

  /**
   * Filtre les liens selon le rôle de l'utilisateur
   */
  const filterLinksByRole = (links: any[]) => {
    return links.filter((link) => {
      if (link.children) {
        // Pour les liens avec enfants, filtrer les enfants
        const filteredChildren = link.children.filter((child: any) =>
          isLinkAccessible(child.roles || [])
        );
        return filteredChildren.length > 0;
      }
      return isLinkAccessible(link.roles || []);
    });
  };

  /**
   * Récupère tous les liens de navigation selon le rôle
   */
  const getNavLinks = () => {
    const links = [...publicNavLinks];
    if (isAuthenticated) {
      links.push(...filterLinksByRole(authenticatedNavLinks));
      if (isAdmin) {
        links.push(...filterLinksByRole(adminNavLinks));
      }
    }
    return links;
  };

  const handleLogout = () => {
    setAuthToken(null);
    logoutContext();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
              <Car className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Drive<span className="text-accent">Deal</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {getNavLinks().map((link) =>
              link.children ? (
                <DropdownMenu key={link.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="nav-link gap-1">
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    {link.children
                      .filter((child: any) => isLinkAccessible(child.roles || []))
                      .map((child: any) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            to={child.href}
                            className={cn(
                              'w-full cursor-pointer',
                              isActive(child.href) && 'text-primary font-medium'
                            )}
                          >
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.href}
                  to={link.href!}
                  className={cn(
                    'px-4 py-2 rounded-lg transition-colors duration-200',
                    isActive(link.href!)
                      ? 'text-primary font-semibold bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                0
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="cursor-pointer" disabled>
                      {isAdmin ? (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4 mr-2" />
                          Client
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="cursor-pointer">
                        Connexion
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="cursor-pointer">
                        Inscription
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {getNavLinks().map((link) =>
                link.children ? (
                  <div key={link.label} className="space-y-1">
                    <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                      {link.label}
                    </div>
                    {link.children
                      .filter((child: any) => isLinkAccessible(child.roles || []))
                      .map((child: any) => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            'block px-6 py-2 rounded-lg transition-colors',
                            isActive(child.href)
                              ? 'text-primary font-medium bg-primary/5'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href!}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block px-4 py-2 rounded-lg transition-colors',
                      isActive(link.href!)
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
