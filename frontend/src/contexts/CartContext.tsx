import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { CartItem, CartState, Vehicle, VehicleOption } from '@/types/vehicle'
import { countriesWithTVA } from '@/data/countriesWithTVA'

const getTVAForCountry = (country: string): number => {
  const entry = countriesWithTVA.find(c => c.country === country)
  return entry ? Number(entry.tva) : 0
}

interface CartStore {
  items: CartItem[]
  history: CartState[]
  historyIndex: number
  deliveryCountry: string

  addToCart: (vehicle: Vehicle, options?: VehicleOption[]) => void
  removeFromCart: (vehicleId: string) => void
  updateOptions: (vehicleId: string, options: VehicleOption[]) => void

  increaseQuantity: (vehicleId: string) => void
  decreaseQuantity: (vehicleId: string) => void

  clearCart: () => void
  undo: () => void
  redo: () => void
  setDeliveryCountry: (country: string) => void

  getSubtotal: () => number
  getTaxes: () => number
  getTotal: () => number
  getItemCount: () => number

  saveToHistory: (items: CartItem[]) => void
}

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        history: [{ items: [], timestamp: new Date() }],
        historyIndex: 0,
        deliveryCountry: 'France',

        /* ───────────── CART ACTIONS ───────────── */

        addToCart: (vehicle, options = []) => {
          const { items } = get()
          const exists = items.some(i => i.vehicle.id === vehicle.id)

          // 🚫 Déjà dans le panier → on ne fait rien
          if (exists) return

          const newItems: CartItem[] = [
            ...items,
            { vehicle, selectedOptions: options, quantity: 1 },
          ]

          set({ items: newItems })
          get().saveToHistory(newItems)
        },

        increaseQuantity: (vehicleId) => {
          const newItems = get().items.map(item =>
            item.vehicle.id === vehicleId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )

          set({ items: newItems })
          get().saveToHistory(newItems)
        },

        decreaseQuantity: (vehicleId) => {
          let newItems = get().items.map(item =>
            item.vehicle.id === vehicleId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )

          newItems = newItems.filter(item => item.quantity > 0)

          set({ items: newItems })
          get().saveToHistory(newItems)
        },

        removeFromCart: (vehicleId) => {
          const newItems = get().items.filter(i => i.vehicle.id !== vehicleId)
          set({ items: newItems })
          get().saveToHistory(newItems)
        },

        updateOptions: (vehicleId, options) => {
          const newItems = get().items.map(i =>
            i.vehicle.id === vehicleId
              ? { ...i, selectedOptions: options }
              : i
          )

          set({ items: newItems })
          get().saveToHistory(newItems)
        },

        clearCart: () => {
          set({ items: [] })
          get().saveToHistory([])
        },

        /* ───────────── HISTORY ───────────── */

        undo: () => {
          const { history, historyIndex } = get()
          if (historyIndex > 0) {
            set({
              historyIndex: historyIndex - 1,
              items: history[historyIndex - 1].items,
            })
          }
        },

        redo: () => {
          const { history, historyIndex } = get()
          if (historyIndex < history.length - 1) {
            set({
              historyIndex: historyIndex + 1,
              items: history[historyIndex + 1].items,
            })
          }
        },

        setDeliveryCountry: (country) => set({ deliveryCountry: country }),

        /* ───────────── CALCULS ───────────── */

        getSubtotal: () =>
          get().items.reduce((sum, item) => {
            const optionsTotal =
              item.selectedOptions?.reduce((s, o) => s + o.price, 0) ?? 0
            return sum + (item.vehicle.price + optionsTotal) * item.quantity
          }, 0),

        getTaxes: () => {
          const subtotal = get().getSubtotal()
          const tva = getTVAForCountry(get().deliveryCountry)
          return (subtotal * tva) / 100
        },

        getTotal: () => get().getSubtotal() + get().getTaxes(),

        getItemCount: () =>
          get().items.reduce((count, item) => count + item.quantity, 0),

        saveToHistory: (newItems) => {
          const { history, historyIndex } = get()
          const newHistory = history.slice(0, historyIndex + 1)

          newHistory.push({
            items: newItems,
            timestamp: new Date(),
          })

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1,
          })
        },
      }),
      {
        name: 'cart-storage',
        partialize: state => ({
          items: state.items,
          history: state.history,
          historyIndex: state.historyIndex,
          deliveryCountry: state.deliveryCountry,
        }),
      }
    ),
    { name: 'CartStore' }
  )
)
