import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Car, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/contexts/CartContext'
import { useAuthStore } from '@/store/useAuthStore'

export function Header() {
  const itemCount = useCartStore((state) => state.getItemCount())
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const clearCart = useCartStore((state) => state.clearCart)
  const logout = useAuthStore((state) => state.logout)

  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = location.pathname.startsWith('/admin')

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
      ]

  const handleLogout = () => {
    clearCart()
    logout()
    setMobileMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Car className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold">
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
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                location.pathname === link.href
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
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
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
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

          {/* Logout desktop */}
          {isAuthenticated && (
            <Button
              variant="destructive"
              size="sm"
              className="hidden sm:flex"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          )}

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
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary/50"
              >
                {link.label}
              </Link>
            ))}

            <Link
              to={isAdmin ? '/' : '/admin'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary/50"
            >
              {isAdmin ? 'Espace Client' : 'Espace Admin'}
            </Link>

            {/* Logout mobile */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
