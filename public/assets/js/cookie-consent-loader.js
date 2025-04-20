/**
 * PrivacyVet Cookie Consent Loader
 * 
 * This script dynamically loads the cookie consent manager
 * and ensures it works ONLY on the exact domain specified.
 * 
 * Usage: 
 * <script src="https://your-domain.com/assets/js/cookie-consent-loader.js" 
 *   data-domain-id="your-domain-id"
 *   data-domain="example.com"
 *   data-theme="dark"
 *   data-show-logo="true"
 *   data-powered-by="true">
 * </script>
 */
(function() {
  // Get the script tag that loaded this script
  const scriptTag = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  // Extract configuration from script tag
  const domainId = scriptTag.getAttribute('data-domain-id') || 'default';
  const configuredDomain = scriptTag.getAttribute('data-domain');
  const currentDomain = window.location.hostname;
  const theme = scriptTag.getAttribute('data-theme') || 'dark'; // Default to dark theme
  const showLogo = scriptTag.getAttribute('data-show-logo') !== 'false'; // Default to true
  const poweredBy = scriptTag.getAttribute('data-powered-by') !== 'false'; // Default to true

  // Check if a domain was specified and if it exactly matches the current domain
  if (configuredDomain && configuredDomain !== currentDomain) {
    console.log('PrivacyVet Cookie Consent: Domain mismatch. Script will not load.');
    return; // Exit the script if the domains don't match exactly
  }

  // Get the path to this script
  const scriptPath = scriptTag.src;
  const basePath = scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
  
  // Create the cookie consent script element
  const consentScript = document.createElement('script');
  consentScript.src = basePath + 'cookie-consent.js';
  consentScript.setAttribute('data-domain-id', domainId);
  consentScript.setAttribute('data-domain', configuredDomain || currentDomain);
  consentScript.setAttribute('data-theme', theme);
  consentScript.setAttribute('data-show-logo', showLogo ? 'true' : 'false');
  consentScript.setAttribute('data-powered-by', poweredBy ? 'true' : 'false');
  
  // Add the script to the document
  document.head.appendChild(consentScript);
})();