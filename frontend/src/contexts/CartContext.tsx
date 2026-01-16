import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { CartItem, CartState, Vehicle, VehicleOption } from '@/types/vehicle'
import { taxRates } from '@/data/mockVehicles'

interface CartStore {
  items: CartItem[]
  history: CartState[]
  historyIndex: number
  deliveryCountry: string

  addToCart: (vehicle: Vehicle, options?: VehicleOption[]) => void
  removeFromCart: (vehicleId: string) => void
  updateOptions: (vehicleId: string, options: VehicleOption[]) => void
  clearCart: () => void
  undo: () => void
  redo: () => void
  setDeliveryCountry: (country: string) => void

  canUndo: boolean
  canRedo: boolean

  subtotal: number
  taxes: number
  total: number
  itemCount: number

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

        addToCart: (vehicle, options = []) => {
          const { items } = get()
          const existing = items.find(i => i.vehicle.id === vehicle.id)
          let newItems: CartItem[]

          if (existing) {
            newItems = items.map(i =>
              i.vehicle.id === vehicle.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
          } else {
            newItems = [...items, { vehicle, selectedOptions: options, quantity: 1 }]
          }

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
            i.vehicle.id === vehicleId ? { ...i, selectedOptions: options } : i
          )
          set({ items: newItems })
          get().saveToHistory(newItems)
        },

        clearCart: () => {
          set({ items: [] })
          get().saveToHistory([])
        },

        undo: () => {
          const { history, historyIndex } = get()
          if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            set({ historyIndex: newIndex, items: history[newIndex].items })
          }
        },

        redo: () => {
          const { history, historyIndex } = get()
          if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            set({ historyIndex: newIndex, items: history[newIndex].items })
          }
        },

        setDeliveryCountry: (country) => {
          set({ deliveryCountry: country })
        },

        canUndo: false,
        canRedo: false,

        subtotal: 0,
        taxes: 0,
        total: 0,
        itemCount: 0,

        saveToHistory: (newItems: CartItem[]) => {
          const { history, historyIndex } = get()
          const newState: CartState = { items: newItems, timestamp: new Date() }
          const newHistory = history.slice(0, historyIndex + 1)
          newHistory.push(newState)
          set({ history: newHistory, historyIndex: newHistory.length - 1 })
        },
      }),
      {
        name: 'cart-storage', // clé localStorage
        partialize: (state) => ({
          items: state.items,
          history: state.history,
          historyIndex: state.historyIndex,
          deliveryCountry: state.deliveryCountry,
        }),
      }
    ),
    { name: 'CartStore' } // Redux DevTools
  )
)
