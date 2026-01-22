import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import Index from "./pages/Index";
import Cursos from "./pages/Cursos";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Portal from "./pages/Portal";
import NotFound from "./pages/NotFound";

// Portal pages
import CoursePage from "./pages/portal/CoursePage";
import LessonPage from "./pages/portal/LessonPage";
import Certificates from "./pages/portal/Certificates";
import Profile from "./pages/portal/Profile";

// Funnel pages
import LandingPage from "./pages/funnel/LandingPage";
import ObrigadoPage from "./pages/funnel/ObrigadoPage";
import CPLPage from "./pages/funnel/CPLPage";
import VendasPage from "./pages/funnel/VendasPage";
import SucessoPage from "./pages/funnel/SucessoPage";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Analytics from "./pages/admin/Analytics";
import Students from "./pages/admin/Students";
import Content from "./pages/admin/Content";
import Courses from "./pages/admin/Courses";
import Leads from "./pages/admin/Leads";
import Automations from "./pages/admin/Automations";
import Retention from "./pages/admin/Retention";
import Settings from "./pages/admin/Settings";
import HotmartProducts from "./pages/admin/HotmartProducts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Funnel Routes - Public */}
            <Route path="/lp" element={<LandingPage />} />
            <Route path="/lp/:slug" element={<LandingPage />} />
            <Route path="/obrigado" element={<ObrigadoPage />} />
            <Route path="/cpl" element={<CPLPage />} />
            <Route path="/cpl/:slug" element={<CPLPage />} />
            <Route path="/vendas" element={<VendasPage />} />
            <Route path="/vendas/:slug" element={<VendasPage />} />
            <Route path="/sucesso" element={<SucessoPage />} />
            
            {/* Portal Routes - Protected */}
            <Route path="/portal" element={
              <ProtectedRoute>
                <Portal />
              </ProtectedRoute>
            } />
            <Route path="/portal/curso/:courseId" element={
              <ProtectedRoute>
                <CoursePage />
              </ProtectedRoute>
            } />
            <Route path="/portal/curso/:courseId/aula/:lessonId" element={
              <ProtectedRoute>
                <LessonPage />
              </ProtectedRoute>
            } />
            <Route path="/portal/certificados" element={
              <ProtectedRoute>
                <Certificates />
              </ProtectedRoute>
            } />
            <Route path="/portal/perfil" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="students" element={<Students />} />
              <Route path="content" element={<Content />} />
              <Route path="courses" element={<Courses />} />
              <Route path="leads" element={<Leads />} />
              <Route path="automations" element={<Automations />} />
              <Route path="retention" element={<Retention />} />
              <Route path="settings" element={<Settings />} />
              <Route path="hotmart-products" element={<HotmartProducts />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
