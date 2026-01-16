import { CartItem } from '@/types/vehicle'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  total: number

  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateItemQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      // Ajouter un article
      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id)
        if (existing) {
          set({
            items: get().items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
            total: get().items.reduce((sum, i) => sum + i.price * i.quantity, 0) + item.price * item.quantity
          })
        } else {
          const newItems = [...get().items, item]
          set({
            items: newItems,
            total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
          })
        }
      },

      // Supprimer un article
      removeItem: (id) => {
        const newItems = get().items.filter(i => i.id !== id)
        set({
          items: newItems,
          total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        })
      },

      // Mettre à jour la quantité
      updateItemQuantity: (id, quantity) => {
        const newItems = get().items.map(i =>
          i.id === id ? { ...i, quantity } : i
        )
        set({
          items: newItems,
          total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        })
      },

      // Vider le panier
      clearCart: () => set({ items: [], total: 0 })
    }),
    {
      name: 'cart-storage', // clé dans localStorage
    }
  )
)
