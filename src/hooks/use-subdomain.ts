import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSubdomainFromHostname, getSubdomainFromPath } from '@/lib/subdomain-utils';

interface UseSubdomainResult {
  isSubdomain: boolean;
  subdomainName: string | null;
  isLoading: boolean;
}

/**
 * Custom hook to detect if the current URL is a subdomain
 */
export function useSubdomain(): UseSubdomainResult {
  const [isSubdomain, setIsSubdomain] = useState<boolean>(false);
  const [subdomainName, setSubdomainName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const detectSubdomain = () => {
      try {
        // Get the hostname
        const hostname = window.location.hostname;

        // Skip subdomain detection for plain localhost or 127.0.0.1
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
          setIsSubdomain(false);
          setSubdomainName(null);
          return;
        }

        // Special case for test.localhost and similar formats
        if (hostname.includes('.localhost') || hostname.includes('.127.0.0.1')) {
          const parts = hostname.split('.');
          if (parts.length >= 2 && parts[0] !== 'www') {
            setIsSubdomain(true);
            setSubdomainName(parts[0]);
            return;
          }
        }

        // First, check if we have a subdomain in the hostname
        const hostnameSubdomain = getSubdomainFromHostname(hostname);

        if (hostnameSubdomain) {
          setIsSubdomain(true);
          setSubdomainName(hostnameSubdomain);
          return;
        }

        // If no subdomain in hostname, check the path
        const pathSubdomain = getSubdomainFromPath(location.pathname);

        if (pathSubdomain) {
          setIsSubdomain(true);
          setSubdomainName(pathSubdomain);
          return;
        }

        // Special case for test.localhost:8080
        if (hostname.startsWith('test.')) {
          setIsSubdomain(true);
          setSubdomainName('test');
          return;
        }

        setIsSubdomain(false);
        setSubdomainName(null);
      } finally {
        setIsLoading(false);
      }
    };

    detectSubdomain();
  }, [location.pathname]);

  return { isSubdomain, subdomainName, isLoading };
}
