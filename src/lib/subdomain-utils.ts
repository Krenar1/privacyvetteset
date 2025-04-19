/**
 * Utility functions for working with subdomains
 */

/**
 * Checks if a hostname has a subdomain
 * @param hostname The hostname to check
 * @returns The subdomain if found, null otherwise
 */
export function getSubdomainFromHostname(hostname: string): string | null {
  // Skip subdomain detection for plain localhost or 127.0.0.1
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null;
  }

  // Special case for test.localhost format
  if (hostname.includes('.localhost') || hostname.includes('.127.0.0.1')) {
    const parts = hostname.split('.');
    if (parts.length >= 2 && parts[0] !== 'www') {
      return parts[0];
    }
  }

  // Split the hostname by dots
  const parts = hostname.split('.');

  // If we have at least 2 parts and the first part is not 'www'
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost' && parts[0] !== '127') {
    return parts[0];
  }

  return null;
}

/**
 * Extracts a subdomain from a URL path in the format /s/:subdomain
 * @param path The URL path
 * @returns The subdomain if found, null otherwise
 */
export function getSubdomainFromPath(path: string): string | null {
  const parts = path.split('/');

  // Check if the path is in the format /s/:subdomain
  if (parts.length >= 3 && parts[1] === 's' && parts[2]) {
    return parts[2];
  }

  return null;
}

/**
 * Builds a URL for a subdomain
 * @param subdomain The subdomain
 * @param isLocalhost Whether we're in a localhost environment
 * @returns The URL for the subdomain
 */
export function buildSubdomainUrl(subdomain: string, isLocalhost: boolean): string {
  if (isLocalhost) {
    // For localhost, use the /s/:subdomain route
    return `/s/${subdomain}`;
  } else {
    // For production, use the subdomain.domain.com format
    const domain = window.location.hostname.split('.').slice(1).join('.');
    return `https://${subdomain}.${domain}`;
  }
}
