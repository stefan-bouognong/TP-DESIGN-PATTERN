import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import {
  clientsService,
  registerAndLoginClient,
  ClientRequest,
} from '../api/clients.service'
import { authService } from '../api/auth.service'

export type CustomerType = 'INDIVIDUAL' | 'COMPANY'

export interface IndividualProfile {
  firstName: string
  lastName: string
  phone: string
  address: string
  nationality: string
  companyId?: null
  vatNumber?: null
  parentCompanyId?: null
}

export interface CompanyProfile {
  companyId: string | null
  name: string
  phone: string
  address: string
  vatNumber: string | null
  parentCompanyId?: number | null
  fleetDiscount?: number | null
}

export interface AuthUser {
  id: number
  email: string
  phone: string
  customerType: CustomerType
  profile: IndividualProfile | CompanyProfile
  createdAt: Date
  token: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  parentCompanies: { id: string; name: string }[]

  login: (email: string, password: string) => Promise<boolean>
  register: (data: ClientRequest) => Promise<boolean>
  logout: () => void
}

const mockParentCompanies = [
  { id: 'pc-1', name: 'Groupe Automobile France' },
  { id: 'pc-2', name: 'Fleet Solutions SA' },
  { id: 'pc-3', name: 'Transport Express SARL' },
]

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        parentCompanies: mockParentCompanies,

        login: async (email, password) => {
          set({ isLoading: true })
          try {
            const response = await authService.login({ email, password })
            const { token, clientId } = response.data
            localStorage.setItem('token', token)

            const clientResponse = await clientsService.getClientById(clientId)
            const client = clientResponse.data

            const profile =
              client.clientType === 'INDIVIDUAL'
                ? {
                    firstName: client.firstName || '',
                    lastName: client.lastName || '',
                    phone: client.phone,
                    address: client.address,
                    nationality: client.nationality || '',
                    companyId: client.companyId || null,
                    vatNumber: client.vatNumber || null,
                    parentCompanyId: client.parentCompanyId || null,
                  }
                : {
                    companyId: client.companyId || null,
                    name: client.name,
                    phone: client.phone,
                    address: client.address,
                    vatNumber: client.vatNumber || null,
                    parentCompanyId: client.parentCompanyId || null,
                    fleetDiscount: client.fleetDiscount || null,
                  }

            set({
              user: {
                id: client.id,
                email: client.email,
                phone: client.phone,
                customerType: client.clientType as CustomerType,
                profile,
                createdAt: new Date(),
                token,
              },
              isAuthenticated: true,
            })

            return true
          } catch (error) {
            console.error('Login error:', error)
            return false
          } finally {
            set({ isLoading: false })
          }
        },

        register: async (data) => {
          set({ isLoading: true })
          try {
            const { client, token } = await registerAndLoginClient(data)
            localStorage.setItem('token', token)

            const profile =
              client.clientType === 'INDIVIDUAL'
                ? {
                    firstName: client.firstName || '',
                    lastName: client.lastName || '',
                    phone: client.phone,
                    address: client.address,
                    nationality: client.nationality || '',
                    companyId: client.companyId || null,
                    vatNumber: client.vatNumber || null,
                    parentCompanyId: client.parentCompanyId || null,
                  }
                : {
                    companyId: client.companyId || null,
                    name: client.name,
                    phone: client.phone,
                    address: client.address,
                    vatNumber: client.vatNumber || null,
                    parentCompanyId: client.parentCompanyId || null,
                    fleetDiscount: client.fleetDiscount || null,
                  }

            set({
              user: {
                id: client.id,
                email: client.email,
                phone: client.phone,
                customerType: client.clientType as CustomerType,
                profile,
                createdAt: new Date(),
                token,
              },
              isAuthenticated: true,
            })

            return true
          } catch (error) {
            console.error('Register error:', error)
            return false
          } finally {
            set({ isLoading: false })
          }
        },

        logout: () => {
          localStorage.removeItem('token')
          set({
            user: null,
            isAuthenticated: false,
          })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: 'AuthStore' } // nom dans Redux DevTools
  )
)
