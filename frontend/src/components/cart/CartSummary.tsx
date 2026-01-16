import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Undo2, Redo2, Trash2, ShoppingBag } from 'lucide-react'
import { countries } from '@/data/mockVehicles'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/contexts/CartContext'

export function CartSummary() {
  // Récupération depuis le store Zustand
  const items = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.subtotal)
  const taxes = useCartStore(state => state.taxes)
  const total = useCartStore(state => state.total)
  const deliveryCountry = useCartStore(state => state.deliveryCountry)
  const setDeliveryCountry = useCartStore(state => state.setDeliveryCountry)
  const undo = useCartStore(state => state.undo)
  const redo = useCartStore(state => state.redo)
  const canUndo = useCartStore(state => state.canUndo)
  const canRedo = useCartStore(state => state.canRedo)
  const clearCart = useCartStore(state => state.clearCart)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-display text-xl font-semibold mb-2">Votre panier est vide</h3>
        <p className="text-muted-foreground mb-6">
          Explorez notre catalogue pour trouver le véhicule de vos rêves.
        </p>
        <Button variant="hero" asChild>
          <Link to="/catalog">Voir le catalogue</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 sticky top-24">
      {/* Undo/Redo controls */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Résumé</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={!canUndo}
            title="Annuler"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={redo}
            disabled={!canRedo}
            title="Rétablir"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearCart}
            className="text-destructive hover:text-destructive"
            title="Vider le panier"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Country selection */}
      <div>
        <label className="text-sm font-medium mb-2 block">Pays de livraison</label>
        <Select value={deliveryCountry} onValueChange={setDeliveryCountry}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map(country => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Totals */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TVA ({deliveryCountry})</span>
          <span>{formatPrice(taxes)}</span>
        </div>
        <div className="flex justify-between font-display text-lg font-bold pt-3 border-t border-border">
          <span>Total TTC</span>
          <span className="text-accent">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Checkout button */}
      <Button variant="hero" size="lg" className="w-full" asChild>
        <Link to="/checkout">Commander</Link>
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        En commandant, vous acceptez nos conditions générales de vente.
      </p>
    </div>
  )
}
