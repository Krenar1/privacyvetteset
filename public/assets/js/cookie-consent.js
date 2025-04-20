/**
 * PrivacyVet Cookie Consent Manager
 * Version 2.0.1
 * 
 * This script handles cookie consent collection across websites.
 * It displays a cookie banner with customizable categories and settings.
 * Settings are synchronized with the PrivacyVet server.
 */
(function() {
  'use strict';

  // Get script attributes
  const script = document.currentScript || (function() {
    // Fallback for when the script is loaded asynchronously
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();
  
  const domainId = script.getAttribute('data-domain-id');
  const domain = script.getAttribute('data-domain') || window.location.hostname;
  const apiUrl = script.getAttribute('data-api-url') || 'https://privacyvet.com/api/cookie-settings';
  const autoInit = script.getAttribute('data-auto-init') !== 'false';
  const version = '2.0.1';

  // Default settings (will be overridden by server settings)
  const defaultSettings = {
    position: 'bottom',
    theme: 'dark', // Set to dark theme as requested
    showLogo: true, // Ensure logo is shown
    customization: {
      primaryColor: '#3b82f6',
      backgroundColor: '#1f2937', // Dark background for dark theme
      textColor: '#f9fafb', // Light text for dark theme
      buttonTextColor: '#ffffff',
      font: 'Inter, system-ui, sans-serif',
      cornerRadius: 6
    },
    cookieCategories: {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: false,
      thirdParty: false,
    },
    consentText: {
      title: 'Cookie Consent',
      description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
      acceptAllButton: 'Accept All',
      rejectAllButton: 'Reject All',
      customizeButton: 'Customize',
      savePreferencesButton: 'Save Preferences',
    },
    advanced: {
      autoBlockCookies: true,
      respectDnt: true,
      collectAnalytics: true,
      expireDays: 180,
      customTermsUrl: '',
      customPrivacyUrl: '',
    },
    scripts: {
      beforeAcceptScript: '',
      afterAcceptScript: '',
      cookieScript: '',
    }
  };

  // Storage keys - add a version to force reset when script is updated
  const CONSENT_STORAGE_KEY = `privacyvet-consent-${domain}-${version}`;
  const SETTINGS_CACHE_KEY = `privacyvet-settings-${domainId}-${version}`;
  const SETTINGS_CACHE_TIME_KEY = `privacyvet-settings-time-${domainId}-${version}`;
  const CACHE_MAX_AGE = 3600000; // 1 hour in milliseconds
  
  // State variables
  let settings = { ...defaultSettings };
  let consent = {
    necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
    thirdParty: false,
  };
  let bannerElement = null;
  let modalElement = null;
  let consentChangeCallbacks = [];
  let hasSettingsLoaded = false;
  
  /**
   * Initialize the Cookie Consent Manager
   */
  function init() {
    // Detect Do Not Track setting
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    const isDntEnabled = (dnt === '1' || dnt === 'yes');
    
    // Load consent from storage
    loadConsent();
    
    // Load settings
    loadSettings().then(() => {
      // Check if we should respect DNT
      if (settings.advanced.respectDnt && isDntEnabled) {
        // If DNT is enabled, set minimal consent and skip showing the banner
        consent = {
          necessary: true,
          preferences: false,
          analytics: false,
          marketing: false,
          thirdParty: false
        };
        saveConsent();
        return;
      }
      
      // Only show banner if consent hasn't been given yet
      if (!hasConsent()) {
        // Wait for DOM to be fully loaded before showing the banner
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', createBanner);
        } else {
          createBanner();
        }
      } else if (settings.scripts.cookieScript) {
        // If consent was already given and we have cookie scripts to load, load them
        try {
          new Function(settings.scripts.cookieScript)();
        } catch (error) {
          console.error('Error executing cookie script:', error);
        }
      }
      
      // Apply custom CSS if provided
      if (settings.advanced.customCss) {
        const styleEl = document.createElement('style');
        styleEl.textContent = settings.advanced.customCss;
        document.head.appendChild(styleEl);
      }

      // If analytics collection is enabled and the user has consented to analytics, send analytics data
      if (settings.advanced.collectAnalytics && consent.analytics) {
        sendAnalyticsData();
      }
    });
    
    // Expose public API
    window.privacyVetConsent = {
      getConsent,
      isAllowed,
      onConsentChange,
      showPreferences: showModal
    };
  }
  
  /**
   * Send analytics data to the server
   */
  function sendAnalyticsData() {
    // Only send if we have a domain ID
    if (!domainId) return;
    
    // Create a simple analytics event
    const analyticsUrl = apiUrl.replace('cookie-settings', 'cookie-analytics');
    
    // Use sendBeacon if available (works even if page is unloading)
    if (navigator.sendBeacon) {
      const data = new Blob([JSON.stringify({
        domain_id: domainId,
        event: 'pageview',
        url: window.location.href,
        referrer: document.referrer,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        user_agent: navigator.userAgent
      })], { type: 'application/json' });
      navigator.sendBeacon(analyticsUrl, data);
    } else {
      // Fallback to fetch API
      fetch(analyticsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain_id: domainId,
          event: 'pageview',
          url: window.location.href,
          referrer: document.referrer,
          screen_width: window.screen.width,
          screen_height: window.screen.height,
          user_agent: navigator.userAgent
        }),
        // Use keepalive to ensure the request completes even if page is unloading
        keepalive: true
      }).catch(error => {
        // Ignore errors for analytics
        console.debug('Failed to send analytics:', error);
      });
    }
  }
  
  /**
   * Load settings from localStorage cache or API
   */
  async function loadSettings() {
    if (!domainId) {
      console.error('PrivacyVet: No domain ID provided. Using default settings.');
      hasSettingsLoaded = true;
      return;
    }
    
    try {
      // Try to load settings from cache first
      const cachedSettings = localStorage.getItem(SETTINGS_CACHE_KEY);
      const cachedTime = parseInt(localStorage.getItem(SETTINGS_CACHE_TIME_KEY) || '0');
      const now = Date.now();
      
      // If we have valid cached settings that aren't too old, use them
      if (cachedSettings && (now - cachedTime < CACHE_MAX_AGE)) {
        settings = { ...defaultSettings, ...JSON.parse(cachedSettings) };
        hasSettingsLoaded = true;
      } else {
        // Otherwise, fetch from API
        await fetchSettings();
      }
    } catch (error) {
      console.error('Failed to load PrivacyVet settings:', error);
      hasSettingsLoaded = true;
    }
  }
  
  /**
   * Fetch settings from the API
   */
  async function fetchSettings() {
    if (!domainId) return;
    
    try {
      const response = await fetch(`${apiUrl}/${domainId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (data && data.settings) {
        // Update settings with server data
        settings = { ...defaultSettings, ...data.settings };
        
        // Cache the settings
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data.settings));
        localStorage.setItem(SETTINGS_CACHE_TIME_KEY, Date.now().toString());
      }
    } catch (error) {
      console.error('Failed to fetch PrivacyVet settings:', error);
    } finally {
      hasSettingsLoaded = true;
    }
  }
  
  /**
   * Load consent from localStorage
   */
  function loadConsent() {
    try {
      const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (storedConsent) {
        consent = { ...consent, ...JSON.parse(storedConsent) };
      }
    } catch (error) {
      console.error('Failed to load PrivacyVet consent:', error);
    }
  }
  
  /**
   * Save consent to localStorage and notify server
   */
  function saveConsent() {
    try {
      // Save to localStorage
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
      
      // Notify server if we have a domain ID
      if (domainId) {
        const consentData = {
          domain: domainId,
          necessary: consent.necessary,
          preferences: consent.preferences,
          analytics: consent.analytics,
          marketing: consent.marketing,
          third_party: consent.thirdParty
        };
        
        // Use sendBeacon if available, as it works even when the page is unloading
        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(consentData)], { type: 'application/json' });
          navigator.sendBeacon(`${apiUrl.replace('cookie-settings', 'cookie-consents')}`, blob);
        } else {
          // Fallback to fetch API
          fetch(apiUrl.replace('cookie-settings', 'cookie-consents'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(consentData),
            keepalive: true // This helps ensure the request completes even if page is unloading
          }).catch(error => {
            // Silently catch errors, as this is non-critical
            console.debug('Failed to send consent to server:', error);
          });
        }
      }
      
      // Notify callbacks
      notifyConsentChange();
      
      // Execute any scripts now that consent is given
      executeScripts();
      
    } catch (error) {
      console.error('Failed to save PrivacyVet consent:', error);
    }
  }
  
  /**
   * Execute scripts based on consent
   */
  function executeScripts() {
    // Execute before accept script if available
    if (settings.scripts.beforeAcceptScript) {
      try {
        new Function(settings.scripts.beforeAcceptScript)();
      } catch (error) {
        console.error('Error executing before accept script:', error);
      }
    }
    
    // Execute cookie loading script if available
    if (settings.scripts.cookieScript) {
      try {
        new Function(settings.scripts.cookieScript)();
      } catch (error) {
        console.error('Error executing cookie script:', error);
      }
    }
    
    // Execute after accept script if available
    if (settings.scripts.afterAcceptScript) {
      try {
        new Function(settings.scripts.afterAcceptScript)();
      } catch (error) {
        console.error('Error executing after accept script:', error);
      }
    }
  }
  
  /**
   * Check if consent has been given
   */
  function hasConsent() {
    return localStorage.getItem(CONSENT_STORAGE_KEY) !== null;
  }
  
  /**
   * Get current consent
   */
  function getConsent() {
    return { ...consent };
  }
  
  /**
   * Check if a specific category is allowed
   */
  function isAllowed(category) {
    return consent[category] === true;
  }
  
  /**
   * Register a callback for consent changes
   */
  function onConsentChange(callback) {
    if (typeof callback === 'function') {
      consentChangeCallbacks.push(callback);
      // Immediately call with current consent
      callback({ ...consent });
    }
    
    // Return a function to unregister the callback
    return function unregister() {
      consentChangeCallbacks = consentChangeCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all callbacks about consent changes
   */
  function notifyConsentChange() {
    const consentCopy = { ...consent };
    consentChangeCallbacks.forEach(callback => {
      try {
        callback(consentCopy);
      } catch (error) {
        console.error('Error in consent change callback:', error);
      }
    });
  }
  
  /**
   * Create and show the cookie banner
   */
  function createBanner() {
    if (bannerElement) return;
    
    // Create banner container
    bannerElement = document.createElement('div');
    bannerElement.className = 'privacyvet-banner';
    bannerElement.setAttribute('role', 'dialog');
    bannerElement.setAttribute('aria-labelledby', 'privacyvet-banner-title');
    bannerElement.setAttribute('aria-describedby', 'privacyvet-banner-description');
    
    // Apply position styles
    const positionStyles = getPositionStyles(settings.position);
    Object.assign(bannerElement.style, {
      position: 'fixed',
      zIndex: '9999',
      boxSizing: 'border-box',
      fontFamily: settings.customization.font,
      backgroundColor: settings.customization.backgroundColor,
      color: settings.customization.textColor,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderRadius: `${settings.customization.cornerRadius}px`,
      padding: '20px',
      maxWidth: ['bottom', 'top'].includes(settings.position) ? 'none' : '400px',
      width: ['bottom', 'top'].includes(settings.position) ? '100%' : 'auto',
      ...positionStyles
    });
    
    // Create content
    const content = document.createElement('div');
    content.style.marginBottom = '16px';
    
    // Add logo if enabled - Always show "Powered by PrivacyVet" in the banner
    const logo = document.createElement('div');
    logo.style.marginBottom = '8px';
    logo.style.fontSize = '12px';
    logo.style.color = settings.customization.textColor;
    logo.style.opacity = '0.7';
    logo.textContent = 'Powered by PrivacyVet';
    content.appendChild(logo);
    
    // Add title
    const title = document.createElement('div');
    title.id = 'privacyvet-banner-title';
    title.style.fontSize = '18px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    title.textContent = settings.consentText.title;
    content.appendChild(title);
    
    // Add description
    const description = document.createElement('div');
    description.id = 'privacyvet-banner-description';
    description.style.marginBottom = '16px';
    description.textContent = settings.consentText.description;
    content.appendChild(description);
    
    // Add links if provided
    if (settings.advanced.customTermsUrl || settings.advanced.customPrivacyUrl) {
      const links = document.createElement('div');
      links.style.marginBottom = '16px';
      links.style.fontSize = '14px';
      
      if (settings.advanced.customTermsUrl) {
        const termsLink = document.createElement('a');
        termsLink.href = settings.advanced.customTermsUrl;
        termsLink.target = '_blank';
        termsLink.rel = 'noopener noreferrer';
        termsLink.style.color = settings.customization.primaryColor;
        termsLink.style.marginRight = '16px';
        termsLink.textContent = 'Terms of Service';
        links.appendChild(termsLink);
      }
      
      if (settings.advanced.customPrivacyUrl) {
        const privacyLink = document.createElement('a');
        privacyLink.href = settings.advanced.customPrivacyUrl;
        privacyLink.target = '_blank';
        privacyLink.rel = 'noopener noreferrer';
        privacyLink.style.color = settings.customization.primaryColor;
        privacyLink.textContent = 'Privacy Policy';
        links.appendChild(privacyLink);
      }
      
      content.appendChild(links);
    }
    
    bannerElement.appendChild(content);
    
    // Create buttons container
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'flex-end';
    buttonsContainer.style.gap = '8px';
    buttonsContainer.style.flexWrap = 'wrap';
    
    // Create Accept All button
    const acceptAllButton = document.createElement('button');
    acceptAllButton.textContent = settings.consentText.acceptAllButton;
    Object.assign(acceptAllButton.style, {
      padding: '8px 16px',
      borderRadius: `${settings.customization.cornerRadius}px`,
      border: 'none',
      backgroundColor: settings.customization.primaryColor,
      color: settings.customization.buttonTextColor,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    });
    acceptAllButton.addEventListener('click', acceptAll);
    buttonsContainer.appendChild(acceptAllButton);
    
    // Create Reject All button
    const rejectAllButton = document.createElement('button');
    rejectAllButton.textContent = settings.consentText.rejectAllButton;
    Object.assign(rejectAllButton.style, {
      padding: '8px 16px',
      borderRadius: `${settings.customization.cornerRadius}px`,
      border: `1px solid ${settings.customization.primaryColor}`,
      backgroundColor: 'transparent',
      color: settings.customization.primaryColor,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    });
    rejectAllButton.addEventListener('click', rejectAll);
    buttonsContainer.appendChild(rejectAllButton);
    
    // Create Customize button
    const customizeButton = document.createElement('button');
    customizeButton.textContent = settings.consentText.customizeButton;
    Object.assign(customizeButton.style, {
      padding: '8px 16px',
      borderRadius: `${settings.customization.cornerRadius}px`,
      border: `1px solid ${settings.customization.textColor}`,
      opacity: '0.7',
      backgroundColor: 'transparent',
      color: settings.customization.textColor,
      cursor: 'pointer',
      fontSize: '14px'
    });
    customizeButton.addEventListener('click', showModal);
    buttonsContainer.appendChild(customizeButton);
    
    bannerElement.appendChild(buttonsContainer);
    
    // Add to DOM
    document.body.appendChild(bannerElement);
  }
  
  /**
   * Get CSS position styles based on position setting
   */
  function getPositionStyles(position) {
    switch (position) {
      case 'bottom':
        return {
          bottom: '20px',
          left: '20px',
          right: '20px'
        };
      case 'top':
        return {
          top: '20px',
          left: '20px',
          right: '20px'
        };
      case 'bottom-left':
        return {
          bottom: '20px',
          left: '20px'
        };
      case 'bottom-right':
        return {
          bottom: '20px',
          right: '20px'
        };
      case 'top-left':
        return {
          top: '20px',
          left: '20px'
        };
      case 'top-right':
        return {
          top: '20px',
          right: '20px'
        };
      default:
        return {
          bottom: '20px',
          left: '20px',
          right: '20px'
        };
    }
  }
  
  /**
   * Hide the cookie banner
   */
  function hideBanner() {
    if (bannerElement && bannerElement.parentNode) {
      bannerElement.parentNode.removeChild(bannerElement);
      bannerElement = null;
    }
  }
  
  /**
   * Show the preferences modal
   */
  function showModal() {
    if (modalElement) return;
    
    // Hide banner if it exists
    hideBanner();
    
    // Create modal container and overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'privacyvet-modal-overlay';
    Object.assign(modalOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '10000'
    });
    
    modalElement = document.createElement('div');
    modalElement.className = 'privacyvet-modal';
    modalElement.setAttribute('role', 'dialog');
    modalElement.setAttribute('aria-labelledby', 'privacyvet-modal-title');
    modalElement.setAttribute('aria-describedby', 'privacyvet-modal-description');
    Object.assign(modalElement.style, {
      backgroundColor: settings.customization.backgroundColor,
      color: settings.customization.textColor,
      borderRadius: `${settings.customization.cornerRadius}px`,
      padding: '24px',
      maxWidth: '500px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      fontFamily: settings.customization.font
    });
    
    // Create modal content
    const modalContent = document.createElement('div');
    
    // Add title
    const title = document.createElement('div');
    title.id = 'privacyvet-modal-title';
    title.style.fontSize = '20px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '16px';
    title.textContent = 'Privacy Preferences';
    modalContent.appendChild(title);
    
    // Add description
    const description = document.createElement('div');
    description.id = 'privacyvet-modal-description';
    description.style.marginBottom = '24px';
    description.textContent = 'Customize your cookie preferences below. Some cookies are necessary for the website to function properly and cannot be disabled.';
    modalContent.appendChild(description);
    
    // Add categories
    const categories = document.createElement('div');
    categories.style.marginBottom = '24px';
    
    // Add each category
    for (const category in settings.cookieCategories) {
      if (settings.cookieCategories[category]) {
        const categoryContainer = document.createElement('div');
        categoryContainer.style.marginBottom = '16px';
        categoryContainer.style.padding = '12px';
        categoryContainer.style.border = `1px solid ${settings.customization.textColor}20`;
        categoryContainer.style.borderRadius = `${settings.customization.cornerRadius}px`;
        
        const categoryHeader = document.createElement('div');
        categoryHeader.style.display = 'flex';
        categoryHeader.style.justifyContent = 'space-between';
        categoryHeader.style.alignItems = 'center';
        categoryHeader.style.marginBottom = '8px';
        
        const categoryTitle = document.createElement('div');
        categoryTitle.style.fontWeight = 'bold';
        categoryTitle.textContent = capitalizeFirstLetter(category);
        categoryHeader.appendChild(categoryTitle);
        
        const categorySwitch = document.createElement('div');
        categorySwitch.style.display = 'flex';
        categorySwitch.style.alignItems = 'center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = `privacyvet-category-${category}`;
        checkbox.id = `privacyvet-category-${category}`;
        checkbox.checked = category === 'necessary' ? true : consent[category];
        checkbox.disabled = category === 'necessary'; // Necessary cookies cannot be disabled
        checkbox.style.marginRight = '8px';
        categorySwitch.appendChild(checkbox);
        
        const label = document.createElement('label');
        label.htmlFor = `privacyvet-category-${category}`;
        label.textContent = category === 'necessary' ? 'Always active' : 'Active';
        categorySwitch.appendChild(label);
        
        categoryHeader.appendChild(categorySwitch);
        categoryContainer.appendChild(categoryHeader);
        
        // Add category description
        const categoryDescription = document.createElement('div');
        categoryDescription.style.fontSize = '14px';
        categoryDescription.style.opacity = '0.8';
        categoryDescription.textContent = getCategoryDescription(category);
        categoryContainer.appendChild(categoryDescription);
        
        categories.appendChild(categoryContainer);
      }
    }
    
    modalContent.appendChild(categories);
    
    // Add buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    buttonsContainer.style.gap = '8px';
    buttonsContainer.style.flexWrap = 'wrap';
    
    // Group left buttons (Accept all / Reject all)
    const leftButtons = document.createElement('div');
    leftButtons.style.display = 'flex';
    leftButtons.style.gap = '8px';
    
    // Accept All button
    const acceptAllButton = document.createElement('button');
    acceptAllButton.textContent = settings.consentText.acceptAllButton;
    Object.assign(acceptAllButton.style, {
      padding: '8px 16px',
      borderRadius: `${settings.customization.cornerRadius}px`,
      border: 'none',
      backgroundColor: settings.customization.primaryColor,
      color: settings.customization.buttonTextColor,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    });
    acceptAllButton.addEventListener('click', acceptAll);
    leftButtons.appendChild(acceptAllButton);
    
    // Reject All button
    const rejectAllButton = document.createElement('button');
    rejectAllButton.textContent = settings.consentText.rejectAllButton;
    Object.assign(rejectAllButton.style, {
      padding: '8px 16px',
      borderRadius: `${settings.customization.cornerRadius}px`,
      border: `1px solid ${settings.customization.primaryColor}`,
      backgroundColor: 'transparent',
      color: settings.customization.primaryColor,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    });
    rejectAllButton.addEventListener('click', rejectAll);
    leftButtons.appendChild(rejectAllButton);
    
    buttonsContainer.appendChild(leftButtons);
    
    // Save Preferences button
    const saveButton = document.createElement('button');
    saveButton.textContent = settings.consentText.savePreferencesButton;
    Object.assign(saveButton.style, {
      padding: '8px 16px',
      borderRadius: `${settings.customization.cornerRadius}px`,
      border: 'none',
      backgroundColor: settings.customization.primaryColor,
      color: settings.customization.buttonTextColor,
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '14px'
    });
    saveButton.addEventListener('click', savePreferences);
    buttonsContainer.appendChild(saveButton);
    
    modalContent.appendChild(buttonsContainer);
    modalElement.appendChild(modalContent);
    modalOverlay.appendChild(modalElement);
    
    // Add close button in corner
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    Object.assign(closeButton.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: settings.customization.textColor,
      opacity: '0.7'
    });
    closeButton.addEventListener('click', hideModal);
    modalElement.appendChild(closeButton);
    
    // Close modal when clicking outside of it
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        hideModal();
      }
    });
    
    document.body.appendChild(modalOverlay);
  }
  
  /**
   * Hide the preferences modal
   */
  function hideModal() {
    if (modalElement && modalElement.parentNode) {
      modalElement.parentNode.parentNode.removeChild(modalElement.parentNode);
      modalElement = null;
    }
  }
  
  /**
   * Get description for cookie category
   */
  function getCategoryDescription(category) {
    switch (category) {
      case 'necessary':
        return 'These cookies are required for the website to function properly. They cannot be disabled.';
      case 'preferences':
        return 'These cookies allow the website to remember choices you make and provide enhanced, personalized features.';
      case 'analytics':
        return 'These cookies help us understand how visitors interact with our website, helping us improve our website and services.';
      case 'marketing':
        return 'These cookies are used to track visitors across websites to display relevant advertisements.';
      case 'thirdParty':
        return 'These cookies are set by third-party services that appear on our pages.';
      default:
        return 'Cookies used to provide functionality on the website.';
    }
  }
  
  /**
   * Accept all cookies
   */
  function acceptAll() {
    const newConsent = { ...consent };
    Object.keys(settings.cookieCategories).forEach(category => {
      if (settings.cookieCategories[category]) {
        newConsent[category] = true;
      }
    });
    consent = newConsent;
    saveConsent();
    hideBanner();
    hideModal();
  }
  
  /**
   * Reject all non-necessary cookies
   */
  function rejectAll() {
    const newConsent = { ...consent };
    Object.keys(settings.cookieCategories).forEach(category => {
      newConsent[category] = category === 'necessary';
    });
    consent = newConsent;
    saveConsent();
    hideBanner();
    hideModal();
  }
  
  /**
   * Save preferences from modal
   */
  function savePreferences() {
    const newConsent = { ...consent };
    Object.keys(settings.cookieCategories).forEach(category => {
      if (category !== 'necessary') {
        const checkbox = document.querySelector(`input[name="privacyvet-category-${category}"]`);
        if (checkbox) {
          newConsent[category] = checkbox.checked;
        }
      }
    });
    consent = newConsent;
    saveConsent();
    hideModal();
  }
  
  /**
   * Helper function to capitalize first letter
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Start the cookie consent manager if auto init is enabled
  if (autoInit && typeof document !== 'undefined') {
    // Initialize immediately if document is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(init, 0);
    } else {
      // Wait for DOM to be ready
      document.addEventListener('DOMContentLoaded', init);
    }
  }

})();