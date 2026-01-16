import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, CartState, Vehicle, VehicleOption } from '@/types/vehicle';
import { taxRates } from '@/data/mockVehicles';

interface CartContextType {
  items: CartItem[];
  history: CartState[];
  historyIndex: number;
  deliveryCountry: string;
  addToCart: (vehicle: Vehicle, options?: VehicleOption[]) => void;
  removeFromCart: (vehicleId: string) => void;
  updateOptions: (vehicleId: string, options: VehicleOption[]) => void;
  clearCart: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setDeliveryCountry: (country: string) => void;
  subtotal: number;
  taxes: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [history, setHistory] = useState<CartState[]>([{ items: [], timestamp: new Date() }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [deliveryCountry, setDeliveryCountry] = useState('France');

  const saveToHistory = useCallback((newItems: CartItem[]) => {
    const newState: CartState = { items: newItems, timestamp: new Date() };
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addToCart = useCallback((vehicle: Vehicle, options: VehicleOption[] = []) => {
    const existingItem = items.find(item => item.vehicle.id === vehicle.id);
    let newItems: CartItem[];
    
    if (existingItem) {
      newItems = items.map(item =>
        item.vehicle.id === vehicle.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newItems = [...items, { vehicle, selectedOptions: options, quantity: 1 }];
    }
    
    setItems(newItems);
    saveToHistory(newItems);
  }, [items, saveToHistory]);

  const removeFromCart = useCallback((vehicleId: string) => {
    const newItems = items.filter(item => item.vehicle.id !== vehicleId);
    setItems(newItems);
    saveToHistory(newItems);
  }, [items, saveToHistory]);

  const updateOptions = useCallback((vehicleId: string, options: VehicleOption[]) => {
    const newItems = items.map(item =>
      item.vehicle.id === vehicleId
        ? { ...item, selectedOptions: options }
        : item
    );
    setItems(newItems);
    saveToHistory(newItems);
  }, [items, saveToHistory]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveToHistory([]);
  }, [saveToHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setItems(history[newIndex].items);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setItems(history[newIndex].items);
    }
  }, [history, historyIndex]);

  const subtotal = items.reduce((acc, item) => {
    const vehiclePrice = item.vehicle.isPromotion && item.vehicle.originalPrice
      ? item.vehicle.price
      : item.vehicle.price;
    const optionsPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return acc + (vehiclePrice + optionsPrice) * item.quantity;
  }, 0);

  const taxRate = taxRates[deliveryCountry] || 0.20;
  const taxes = subtotal * taxRate;
  const total = subtotal + taxes;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        history,
        historyIndex,
        deliveryCountry,
        addToCart,
        removeFromCart,
        updateOptions,
        clearCart,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        setDeliveryCountry,
        subtotal,
        taxes,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
