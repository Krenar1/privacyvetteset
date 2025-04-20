import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyGuide from "./pages/resource/PrivacyGuide";
import ComplianceChecklist from "./pages/resource/ComplianceChecklist";
import FAQs from "./pages/resource/FAQs";
import APIDocumentation from "./pages/resource/ApiDocumentation";
import SupportCenter from "./pages/resource/SupportCenter";
import PartnerProgram from "./pages/resource/PartnerProgram";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import CookiePolicy from "./pages/policies/CookiePolicy";
import AcceptancePolicy from "./pages/policies/AcceptancePolicy";
import TermsOfService from "./pages/policies/TermsOfService";
import Login from "./components/Auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import RefundPolicy from "./pages/policies/RefundPolicy";

import Overview from "./components/PrivateDashboard/Overview";
import Keywords from "./components/PrivateDashboard/Keywords";
import Websites from "./components/PrivateDashboard/Websites";
import Emails from "./components/PrivateDashboard/Emails";
import SentEmails from "./components/PrivateDashboard/SentEmails";
import Products from "./components/PrivateDashboard/Products";
import SubdomainSetup from "./components/PrivateDashboard/SubdomainSetup";
import { CookieToolPage } from "./components/PrivateDashboard/CookieTool/CookieToolPage";
import CheckoutPage from "./components/CheckoutPage";
import SubdomainView from "./pages/SubdomainView";
import SubdomainRedirect from "./components/SubdomainRedirect";
import SubdomainLayout from "./components/SubdomainLayout";
import Plans from "./pages/demo/Plans";
import DemoSchedule from "./pages/demo/DemoSchedule";

import PaymentSuccess from "./pages/PaymentSuccess";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    (function(c, l, a, r, i, t, y) {
      c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "qm965asoz5");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <BrowserRouter>
              <SubdomainLayout>
              <Routes>
                <Route path="/" element={<Index />} />

                <Route path="/plans" element={<Plans />} />
                <Route path="/schedule" element={<DemoSchedule />} />

                {/* resources */}
                <Route path="/privacyguide" element={<PrivacyGuide />} />
                <Route path="/compliancechecklist" element={<ComplianceChecklist />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/apidocumentation" element={<APIDocumentation />} />
                <Route path="/supportcenter" element={<SupportCenter />} />
                <Route path="/partnerprogram" element={<PartnerProgram />} />

                {/* policies */}
                <Route path="/termsofservice" element={<TermsOfService />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="/cookiepolicy" element={<CookiePolicy />} />
                <Route path="/acceptancepolicy" element={<AcceptancePolicy />} />
                <Route path="/refundpolicy" element={<RefundPolicy />} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/checkout/:linkId" element={<CheckoutPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/s/:subdomainName" element={<SubdomainView />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/cancel" element={<Navigate to="/" />} />

                {/* Subdomain handling */}
                <Route path="/subdomain-redirect" element={<SubdomainRedirect />} />

                {/* Dashboard */}
                <Route
                  path="dashboard/*"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Overview />} />
                  <Route path="overview" index element={<Overview />} />
                  <Route path="keywords" element={<Keywords />} />
                  <Route path="websites" element={<Websites />} />
                  <Route path="emails" element={<Emails />} />
                  <Route path="sentemails" element={<SentEmails />} />
                  <Route path="products" element={<Products />} />
                  <Route path="subdomains" element={<SubdomainSetup />} />
                  <Route path="cookie-tool" element={<CookieToolPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              </SubdomainLayout>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
