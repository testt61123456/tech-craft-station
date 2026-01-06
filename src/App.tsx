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
import CustomerRegistration from "./pages/CustomerRegistration";
import ServiceRecords from "./pages/ServiceRecords";
import QuoteForm from "./pages/QuoteForm";
import AdminPanel from "./pages/AdminPanel";

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
            <Route path="/customer-registration" element={<CustomerRegistration />} />
            <Route path="/service-records" element={<ServiceRecords />} />
            <Route path="/quote-form" element={<QuoteForm />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
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
