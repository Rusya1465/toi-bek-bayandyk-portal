
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import AdminPage from "./pages/AdminPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import ArtistDetailPage from "./pages/ArtistDetailPage";
import RentalDetailPage from "./pages/RentalDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ServiceFormPage from "./pages/ServiceFormPage";

// For better mobile touch behavior
import "./mobile-optimizations.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  }
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="catalog" element={<CatalogPage />} />
                <Route path="places/:id" element={<PlaceDetailPage />} />
                <Route path="artists/:id" element={<ArtistDetailPage />} />
                <Route path="rentals/:id" element={<RentalDetailPage />} />
                
                {/* Protected routes */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="profile/settings" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="profile/favorites" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="profile/history" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="profile/services" element={
                  <ProtectedRoute roles={['partner', 'admin']}>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                {/* Service creation and editing routes */}
                <Route path="create-service/:type" element={
                  <ProtectedRoute roles={['partner', 'admin']}>
                    <ServiceFormPage />
                  </ProtectedRoute>
                } />
                <Route path="edit-service/:type/:id" element={
                  <ProtectedRoute roles={['partner', 'admin']}>
                    <ServiceFormPage />
                  </ProtectedRoute>
                } />
                
                <Route path="admin" element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
