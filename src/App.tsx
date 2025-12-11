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
            <Route path="/portal" element={<Portal />} />
            
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
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
