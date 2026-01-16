import { create } from 'zustand'

/**
 * 1️⃣ Définir le type de l'état
 */
interface AppState {
  user: string | null
  isAuthenticated: boolean

  // actions
  login: (username: string) => void
  logout: () => void
}

/**
 * 2️⃣ Créer le store
 */
export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: (username) =>
    set({
      user: username,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
))