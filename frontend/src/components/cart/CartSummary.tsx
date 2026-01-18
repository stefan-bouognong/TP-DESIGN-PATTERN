import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Undo2, Redo2, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/contexts/CartContext'
import { countriesWithTVA } from '@/data/countriesWithTVA'

export function CartSummary() {
  const items = useCartStore(state => state.items)
  const subtotal = useCartStore(state => state.getSubtotal())
  const total = useCartStore(state => state.getTotal())
  const deliveryCountry = useCartStore(state => state.deliveryCountry)

  const setDeliveryCountry = useCartStore(state => state.setDeliveryCountry)
  const increaseQuantity = useCartStore(state => state.increaseQuantity)
  const decreaseQuantity = useCartStore(state => state.decreaseQuantity)

  const undo = useCartStore(state => state.undo)
  const redo = useCartStore(state => state.redo)
  const clearCart = useCartStore(state => state.clearCart)
  const canUndo = useCartStore(state => state.canUndo)
  const canRedo = useCartStore(state => state.canRedo)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0,
    }).format(price)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border p-8 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Votre panier est vide</h3>
        <Button asChild>
          <Link to="/catalog">Voir le catalogue</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border bg-card p-6 space-y-6 sticky top-24">

      {/* HEADER */}
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">Résumé</h3>
        <div className="flex gap-1">
          <Button size="icon" variant="ghost" onClick={undo} disabled={!canUndo}><Undo2 /></Button>
          <Button size="icon" variant="ghost" onClick={redo} disabled={!canRedo}><Redo2 /></Button>
          <Button size="icon" variant="ghost" onClick={clearCart}><Trash2 /></Button>
        </div>
      </div>

      {/* ITEMS */}
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.vehicle.id} className="flex justify-between items-center">
            <div>
              <p className="font-medium">{item.vehicle.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.vehicle.price)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => decreaseQuantity(item.vehicle.id)}
              >
                <Minus className="h-4 w-4" />
              </Button>

              <span className="w-6 text-center font-semibold">
                {item.quantity}
              </span>

              <Button
                size="icon"
                variant="outline"
                onClick={() => increaseQuantity(item.vehicle.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* COUNTRY */}
      <Select value={deliveryCountry} onValueChange={setDeliveryCountry}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {countriesWithTVA.map(c => (
            <SelectItem key={c.country} value={c.country}>
              {c.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* TOTAL */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total TTC</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <Button className="w-full" asChild>
        <Link to="/checkout">Commander</Link>
      </Button>
    </div>
  )
}
