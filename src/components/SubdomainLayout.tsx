import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSubdomain } from "@/hooks/use-subdomain";
import SubdomainView from "@/pages/SubdomainView";
import { api } from "@/services/api";
import { getSubdomainFromHostname } from "@/lib/subdomain-utils";

interface SubdomainLayoutProps {
  children: React.ReactNode;
}

/**
 * This component handles subdomain detection and routing.
 * If a subdomain is detected, it renders the SubdomainView component.
 * Otherwise, it renders the children (normal app).
 */
const SubdomainLayout = ({ children }: SubdomainLayoutProps) => {
  // Use the hook for compatibility, but we'll also do our own check
  const { isSubdomain, subdomainName, isLoading } = useSubdomain();
  const location = useLocation();
  const [showSubdomainView, setShowSubdomainView] = useState(false);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);
  const [directSubdomainName, setDirectSubdomainName] = useState<string | null>(null);

  // Direct check for subdomains in the hostname
  useEffect(() => {
    const hostname = window.location.hostname;

    // Extract subdomain from hostname
    let subdomain = null;

    // Skip subdomain detection for plain localhost or 127.0.0.1
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // No subdomain for plain localhost/127.0.0.1
      subdomain = null;
    }
    // Check for test.localhost format
    else if (hostname.includes('.localhost') || hostname.includes('.127.0.0.1')) {
      const parts = hostname.split('.');
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        subdomain = parts[0];
      }
    }
    // Check for production subdomain format
    else if (hostname.split('.').length > 2) {
      const parts = hostname.split('.');
      if (parts[0] !== 'www') {
        subdomain = parts[0];
      }
    }

    // Special case for testing
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check if we're on the checkout page - don't redirect if we are
      const isCheckoutPage = window.location.pathname.includes('/checkout/');

      // Check if URL contains a subdomain parameter
      const urlParams = new URLSearchParams(window.location.search);
      const subdomainParam = urlParams.get('subdomain');

      // Only use the subdomain parameter if we're not on the checkout page
      if (subdomainParam && !isCheckoutPage) {
        subdomain = subdomainParam;
      }

      // Check if URL path contains a subdomain (e.g., /s/test)
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length >= 3 && pathParts[1] === 's' && pathParts[2]) {
        subdomain = pathParts[2];
      }
    }

    if (subdomain) {
      setDirectSubdomainName(subdomain);
      setShowSubdomainView(true);
    }
  }, []);

  // Determine if we should show the subdomain view (using the hook)
  useEffect(() => {
    if (!isLoading) {
      // Check if we're on a subdomain or if we're on the /s/:subdomainName route
      const isSubdomainRoute = location.pathname.startsWith('/s/');

      // If we already decided to show the subdomain view from the direct check, don't override
      if (directSubdomainName) {
        return;
      }

      // Don't show subdomain view if we're already on the /s/ route to avoid infinite loops
      const shouldShowSubdomain = isSubdomain && !isSubdomainRoute;

      if (shouldShowSubdomain) {
        setShowSubdomainView(true);
      }
    }
  }, [isLoading, isSubdomain, subdomainName, location.pathname, directSubdomainName]);

  // If still loading, show a loading indicator
  if (isLoading || checkingSubdomain) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If we're on a subdomain, render the SubdomainView
  if (showSubdomainView) {
    // Use the direct subdomain name if available, otherwise use the one from the hook
    // If neither is available, use the hostname or a default
    let nameToUse = directSubdomainName || subdomainName;

    // If we still don't have a name, try to extract it from the hostname
    if (!nameToUse) {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');
      if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        nameToUse = parts[0];
      } else {
        // Last resort - use a default
        nameToUse = 'test';
      }
    }

    return <SubdomainView subdomainName={nameToUse} />;
  }

  // Otherwise, render the normal app
  return <>{children}</>;
};

export default SubdomainLayout;
