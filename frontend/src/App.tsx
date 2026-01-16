import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VehicleCreate from "./pages/VehicleCreate";
import CatalogIterator from "./pages/CatalogIterator";
import ClientsPage from "./pages/ClientsPage";
import OrderCreate from "./pages/OrderCreate";
import DocumentTemplates from "./pages/DocumentTemplates";
import DocumentBundlePage from "./pages/DocumentBundlePage";
import ObserversPage from "./pages/ObserversPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Routes publiques (sans layout) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes publiques avec layout */}
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/catalog/iterator" element={<CatalogIterator />} />
              <Route path="/catalog/decorated" element={<CatalogIterator />} />
            </Route>

            {/* Routes protégées (nécessitent authentification) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {/* Factory Method - accessible aux clients et admins */}
                <Route path="/orders/create" element={<OrderCreate />} />
                {/* Singleton - accessible aux clients et admins */}
                <Route path="/documents/templates" element={<DocumentTemplates />} />
                {/* Builder - accessible aux clients et admins */}
                <Route path="/documents/bundle" element={<DocumentBundlePage />} />
                {/* Adapter - PDF - accessible aux clients et admins */}
                <Route path="/documents/pdf" element={<DocumentTemplates />} />
              </Route>
            </Route>

            {/* Routes réservées aux administrateurs */}
            <Route element={<AdminRoute />}>
              <Route element={<Layout />}>
                {/* Abstract Factory - ADMIN seulement */}
                <Route path="/vehicles/create" element={<VehicleCreate />} />
                {/* Composite - ADMIN seulement */}
                <Route path="/clients" element={<ClientsPage />} />
                {/* Bridge - ADMIN seulement */}
                <Route path="/forms/generate" element={<DocumentTemplates />} />
                {/* Observer - ADMIN seulement */}
                <Route path="/observers" element={<ObserversPage />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
