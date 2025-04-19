import { useEffect, useState } from "react";
import { useParams, useNavigate, Route, Routes } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ShieldIcon} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { api } from "../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubdomainNotFound from "./SubdomainNotFound";
import PrivacyPolicyPage from "./userPolicy/PrivacyPolicyPage";
import PrivacyPolicySection from "@/components/UserPolicy/PrivacyPolicySection";
import USPrivacyNotices from "@/components/UserPolicy/USPrivacyNotices";
import YourPrivacyChoices from "@/components/UserPolicy/YourPrivacyChoices";
import MakeAPrivacyRequest from "@/components/UserPolicy/MakeAPrivacyRequest";
import GDPRSection from "@/components/UserPolicy/GDPRSection";
import HIPAASection from "@/components/UserPolicy/HIPAA";

// Define the subdomain data type to match the actual response from the backend
interface SubdomainData {
  id: number;
  name: string;  // This is the subdomain name
  is_active: boolean;
  created_at: string;
  primary_color: string;
  accent_color: string;
  logo_url: string | null; // The full URL to the logo
}

// The API response type is handled in the API service

interface SubdomainViewProps {
  subdomainName?: string;
}

const SubdomainView = ({ subdomainName: propSubdomainName }: SubdomainViewProps) => {
  const { subdomainName } = useParams<{ subdomainName: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subdomainData, setSubdomainData] = useState<SubdomainData | null>(null);
  const [subdomainExists, setSubdomainExists] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubdomainData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the prop value if provided, otherwise use the URL parameter
        let nameToUse = propSubdomainName || subdomainName;

        // If we still don't have a subdomain, check the URL path
        if (!nameToUse) {
          const pathParts = window.location.pathname.split('/');
          if (pathParts.length >= 3 && pathParts[1] === 's' && pathParts[2]) {
            nameToUse = pathParts[2];
          }
        }

        // If we still don't have a subdomain, check the hostname
        if (!nameToUse) {
          const hostname = window.location.hostname;
          const parts = hostname.split('.');
          if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
            nameToUse = parts[0];
          }
        }

        // Last resort - use a default for testing
        if (!nameToUse && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          nameToUse = 'test';
        }

        // Normalize the subdomain name (lowercase, trim, etc.)
        if (nameToUse) {
          nameToUse = nameToUse.toLowerCase().trim();
        }

        if (!nameToUse) {
          throw new Error("No subdomain specified");
        }

        // Make the actual API call to get subdomain data
        try {
          const result = await api.getSubdomainData(nameToUse);

          // Check if the result is valid
          if (!result) {
            throw new Error('API returned null or undefined');
          }

          // Check if the result has the expected structure
          if (typeof result.exists !== 'boolean') {
            throw new Error('API response missing exists property');
          }

          if (!result.exists) {
            setSubdomainExists(false);
            return;
          }

          setSubdomainData(result.data);
          setSubdomainExists(true);
        } catch (apiError) {
          throw apiError;
        }
      } catch (err) {
        console.error("Error fetching subdomain data:", err);
        setError(err instanceof Error ? err.message : "Failed to load subdomain data");

        // If we get a 404, set subdomainExists to false
        if (err instanceof Error && err.message.includes('not found')) {
          setSubdomainExists(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubdomainData();
  }, [propSubdomainName, subdomainName, navigate]);

  // Apply custom branding if available
  useEffect(() => {
    if (subdomainData) {
      // Get the colors (handle potential undefined values)
      const primaryColor = subdomainData.primary_color || '#00AEEF';
      const accentColor = subdomainData.accent_color || '#10B981';

      // Apply primary color to CSS variables
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--primary-foreground', '#ffffff');

      // Apply accent color to CSS variables
      document.documentElement.style.setProperty('--accent', accentColor);
      document.documentElement.style.setProperty('--accent-foreground', '#ffffff');

      // Apply to button styles
      document.documentElement.style.setProperty('--btn-background', primaryColor);
      document.documentElement.style.setProperty('--btn-foreground', '#ffffff');

      // Apply to other elements
      document.documentElement.style.setProperty('--ring', accentColor);
    }

    // Cleanup when component unmounts
    return () => {
      document.documentElement.style.removeProperty('--primary');
      document.documentElement.style.removeProperty('--primary-foreground');
      document.documentElement.style.removeProperty('--accent');
      document.documentElement.style.removeProperty('--accent-foreground');
      document.documentElement.style.removeProperty('--btn-background');
      document.documentElement.style.removeProperty('--btn-foreground');
      document.documentElement.style.removeProperty('--ring');
    };
  }, [subdomainData]);

  // If the subdomain doesn't exist, show the 404 page
  if (!loading && !subdomainExists) {
    // Get the subdomain from the URL if possible
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    const hostnameSubdomain = (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') ? parts[0] : null;

    // Use the prop value, URL parameter, hostname subdomain, or empty string
    const nameToShow = propSubdomainName || subdomainName || hostnameSubdomain || '';

    return <SubdomainNotFound subdomain={nameToShow} />;
  }

  // Show loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-3/4 mb-6" />
            <Skeleton className="h-6 w-1/2 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>

            <Skeleton className="h-64 mb-6" />
          </div>
        </main>
      </div>
    );
  }

  // Show error message
  if (error || !subdomainData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || "Failed to load subdomain data. Please try again later."}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get the subdomain name
  const displayName = subdomainData?.name || '';

  // Create business info from the subdomain name
  const business_info = {
    name: `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} Business`,
    email: `contact@${displayName}.com`,
    phone: "+1 (555) 123-4567",
    website: `https://${displayName}.com`,
    address: "123 Main St, Anytown, USA"
  };

  // The logo URL is already provided by the backend
  const logoUrl = subdomainData?.logo_url || null;

  // Use the accent color for the background

  return (
<Routes>
  <Route
    path=""
    element={
      <PrivacyPolicyPage
      name={subdomainData.name}
      primaryColor={subdomainData.primary_color || "#00AEEF"}
      logoURL={subdomainData.logo_url}
      accentColor={subdomainData.accent_color || "#10B981"}
      hipaa={true}
      />
    }
    >
    <Route
      index
      element={
        <PrivacyPolicySection
        primaryColor={subdomainData.primary_color || "#00AEEF"}
        accentColor={subdomainData.accent_color || "#10B981"}
        />
      }
      />
    <Route
      path="us-privacy-notices"
      element={
        <USPrivacyNotices
        primaryColor={subdomainData.primary_color || "#00AEEF"}
        accentColor={subdomainData.accent_color || "#10B981"}
        />
      }
      />
    <Route
      path="gdpr"
      element={
        <GDPRSection
        primaryColor={subdomainData.primary_color || "#00AEEF"}
        accentColor={subdomainData.accent_color || "#10B981"}
        />
      }
      />
      {true ?
    <Route
    path="hipaa"
    element={
      <HIPAASection
      primaryColor={subdomainData.primary_color || "#00AEEF"}
      accentColor={subdomainData.accent_color || "#10B981"}
      />
    }
    />
  : null}
    <Route
      path="your-privacy-choices"
      element={
        <YourPrivacyChoices
          primaryColor={subdomainData.primary_color || "#00AEEF"}
          accentColor={subdomainData.accent_color || "#10B981"}
          />
        }
        />
    <Route
      path="make-a-privacy-request"
      element={
        <MakeAPrivacyRequest
        primaryColor={subdomainData.primary_color || "#00AEEF"}
        accentColor={subdomainData.accent_color || "#10B981"}
        />
      }
    />
  </Route>
</Routes>
  );
};

export default SubdomainView;
