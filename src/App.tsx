import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useCustomerNotifications } from "@/hooks/useCustomerNotifications";
import { useServiceNotifications } from "@/hooks/useServiceNotifications";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Auth from "./pages/Auth";
import ComputerServices from "./pages/ComputerServices";
import PrinterServices from "./pages/PrinterServices";
import SecuritySystems from "./pages/SecuritySystems";
import AutomationSystems from "./pages/AutomationSystems";
import ServerServices from "./pages/ServerServices";
import CustomerRegistration from "./pages/CustomerRegistration";
import ServiceRecords from "./pages/ServiceRecords";

const queryClient = new QueryClient();

const AppContent = () => {
  useCustomerNotifications();
  useServiceNotifications();
  
  return (
    <>
      <Toaster />
      <Sonner />
      <ScrollToTop />
      <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/computer" element={<ComputerServices />} />
            <Route path="/services/printer" element={<PrinterServices />} />
            <Route path="/services/security" element={<SecuritySystems />} />
            <Route path="/services/automation" element={<AutomationSystems />} />
            <Route path="/services/server" element={<ServerServices />} />
            <Route path="/customer-registration" element={<CustomerRegistration />} />
            <Route path="/service-records" element={<ServiceRecords />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
