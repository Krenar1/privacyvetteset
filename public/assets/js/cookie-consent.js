/**
 * PrivacyVet Cookie Consent Manager
 * A customizable cookie consent solution for websites
 */

(function() {
  // Global namespace for PrivacyVet
  window.PrivacyVet = window.PrivacyVet || {};
  
  // Get script attributes
  const currentScript = document.currentScript || (function() {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const domainId = currentScript.getAttribute('data-domain-id') || '';
  const domain = currentScript.getAttribute('data-domain') || window.location.hostname;
  
  // Default settings
  const defaultSettings = {
    position: 'bottom',
    theme: 'light',
    showLogo: true,
    customization: {
      primaryColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      buttonTextColor: '#ffffff',
      font: 'Inter',
      cornerRadius: 6,
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
    }
  };

  // Storage keys
  const CONSENT_STORAGE_KEY = `privacyvet-consent-${domain}`;
  const SETTINGS_STORAGE_KEY = `privacyvet-settings-${domainId}`;
  
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
  
  /**
   * Initialize the Cookie Consent Manager
   */
  function init() {
    loadSettings();
    loadConsent();
    
    // If no consent is stored, show the banner
    if (!hasConsent()) {
      createBanner();
    }
    
    // Expose public API
    window.PrivacyVet = {
      showConsentModal: showModal,
      isAllowed: isAllowed,
      getConsent: getConsent,
      onConsentChange: onConsentChange
    };
  }
  
  /**
   * Load settings from localStorage or API
   */
  function loadSettings() {
    try {
      // Try to get settings from localStorage
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        settings = { ...settings, ...parsedSettings };
        return;
      }
      
      // If no settings in localStorage, try to fetch from API
      fetchSettings();
    } catch (error) {
      console.error('Failed to load PrivacyVet settings:', error);
    }
  }
  
  /**
   * Fetch settings from the API
   */
  function fetchSettings() {
    if (!domainId) return;
    
    // This would be a real API call in production
    // For now, we'll just use a timeout to simulate an API call
    setTimeout(() => {
      // In a real implementation, you would fetch settings from an API
      console.log(`PrivacyVet: Would fetch settings for domain ID ${domainId}`);
    }, 100);
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
   * Save consent to localStorage
   */
  function saveConsent() {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
      notifyConsentChange();
    } catch (error) {
      console.error('Failed to save PrivacyVet consent:', error);
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
    }
    return () => {
      consentChangeCallbacks = consentChangeCallbacks.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all callbacks about consent changes
   */
  function notifyConsentChange() {
    const currentConsent = getConsent();
    consentChangeCallbacks.forEach(callback => {
      try {
        callback(currentConsent);
      } catch (error) {
        console.error('Error in onConsentChange callback:', error);
      }
    });
  }
  
  /**
   * Create and show the cookie banner
   */
  function createBanner() {
    if (bannerElement) return;
    
    // Create banner element
    bannerElement = document.createElement('div');
    bannerElement.id = 'privacyvet-banner';
    bannerElement.style.cssText = `
      position: fixed;
      ${getPositionStyles(settings.position)};
      z-index: 999999;
      padding: 16px;
      margin: 16px;
      max-width: 420px;
      background-color: ${settings.customization.backgroundColor};
      color: ${settings.customization.textColor};
      border-radius: ${settings.customization.cornerRadius}px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: ${settings.customization.font}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      box-sizing: border-box;
    `;
    
    // Banner content
    bannerElement.innerHTML = `
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${settings.consentText.title}</h3>
          ${settings.showLogo ? `
            <img src="/assets/logo.png" alt="PrivacyVet" style="height: 28px;" />
          ` : ''}
        </div>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          ${settings.consentText.description}
        </p>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="privacyvet-accept-all" style="
          flex: 1;
          padding: 8px 16px;
          border: none;
          border-radius: ${settings.customization.cornerRadius}px;
          background-color: ${settings.customization.primaryColor};
          color: ${settings.customization.buttonTextColor};
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        ">${settings.consentText.acceptAllButton}</button>
        <button id="privacyvet-reject-all" style="
          flex: 1;
          padding: 8px 16px;
          border: 1px solid ${settings.customization.primaryColor}; 
          border-radius: ${settings.customization.cornerRadius}px;
          background-color: transparent;
          color: ${settings.customization.primaryColor};
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        ">${settings.consentText.rejectAllButton}</button>
        <button id="privacyvet-customize" style="
          flex: 1;
          padding: 8px 16px;
          border: none;
          border-radius: ${settings.customization.cornerRadius}px;
          background-color: transparent;
          color: ${settings.customization.textColor};
          text-decoration: underline;
          font-size: 14px;
          cursor: pointer;
        ">${settings.consentText.customizeButton}</button>
      </div>
    `;
    
    document.body.appendChild(bannerElement);
    
    // Add event listeners
    document.getElementById('privacyvet-accept-all').addEventListener('click', () => {
      acceptAll();
      hideBanner();
    });
    
    document.getElementById('privacyvet-reject-all').addEventListener('click', () => {
      rejectAll();
      hideBanner();
    });
    
    document.getElementById('privacyvet-customize').addEventListener('click', () => {
      hideBanner();
      showModal();
    });
  }
  
  /**
   * Get CSS position styles based on position setting
   */
  function getPositionStyles(position) {
    switch(position) {
      case 'top':
        return 'top: 0; left: 50%; transform: translateX(-50%);';
      case 'top-left':
        return 'top: 0; left: 0;';
      case 'top-right':
        return 'top: 0; right: 0;';
      case 'bottom-left':
        return 'bottom: 0; left: 0;';
      case 'bottom-right':
        return 'bottom: 0; right: 0;';
      case 'bottom':
      default:
        return 'bottom: 0; left: 50%; transform: translateX(-50%);';
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
    
    // Create modal backdrop
    const backdrop = document.createElement('div');
    backdrop.id = 'privacyvet-modal-backdrop';
    backdrop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1000000;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      box-sizing: border-box;
    `;
    
    // Create modal element
    modalElement = document.createElement('div');
    modalElement.id = 'privacyvet-modal';
    modalElement.style.cssText = `
      background-color: ${settings.customization.backgroundColor};
      color: ${settings.customization.textColor};
      border-radius: ${settings.customization.cornerRadius}px;
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 24px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      font-family: ${settings.customization.font}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      box-sizing: border-box;
    `;
    
    const categoryChecks = Object.keys(settings.cookieCategories)
      .map(category => {
        const isDisabled = category === 'necessary';
        const isChecked = isDisabled || consent[category];
        
        return `
          <div style="display: flex; align-items: center; margin-bottom: 16px; padding: 12px; border: 1px solid #e5e7eb; border-radius: ${settings.customization.cornerRadius}px;">
            <div style="flex: 1;">
              <label style="display: flex; align-items: center; cursor: ${isDisabled ? 'default' : 'pointer'};">
                <input 
                  type="checkbox" 
                  name="privacyvet-category-${category}"
                  value="${category}"
                  ${isChecked ? 'checked' : ''}
                  ${isDisabled ? 'disabled' : ''}
                  style="margin-right: 8px; width: 16px; height: 16px; cursor: ${isDisabled ? 'default' : 'pointer'};"
                >
                <div>
                  <div style="font-weight: 600; text-transform: capitalize;">${category}</div>
                  <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                    ${getCategoryDescription(category)}
                  </div>
                </div>
              </label>
            </div>
          </div>
        `;
      })
      .join('');
    
    modalElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="margin: 0; font-size: 20px; font-weight: 600;">${settings.consentText.title}</h3>
        <button id="privacyvet-modal-close" style="
          background: none;
          border: none;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          padding: 0;
          color: ${settings.customization.textColor};
        ">&times;</button>
      </div>
      <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.5;">
        ${settings.consentText.description}
      </p>
      <div style="margin-bottom: 24px;">
        ${categoryChecks}
      </div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <button id="privacyvet-modal-save" style="
          padding: 10px 20px;
          border: none;
          border-radius: ${settings.customization.cornerRadius}px;
          background-color: ${settings.customization.primaryColor};
          color: ${settings.customization.buttonTextColor};
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        ">${settings.consentText.savePreferencesButton}</button>
      </div>
    `;
    
    backdrop.appendChild(modalElement);
    document.body.appendChild(backdrop);
    
    // Add event listeners
    document.getElementById('privacyvet-modal-close').addEventListener('click', hideModal);
    document.getElementById('privacyvet-modal-save').addEventListener('click', () => {
      savePreferences();
      hideModal();
    });
    
    // Close if clicking outside the modal
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        hideModal();
      }
    });
  }
  
  /**
   * Hide the preferences modal
   */
  function hideModal() {
    const backdrop = document.getElementById('privacyvet-modal-backdrop');
    if (backdrop && backdrop.parentNode) {
      backdrop.parentNode.removeChild(backdrop);
      modalElement = null;
    }
  }
  
  /**
   * Get description for cookie category
   */
  function getCategoryDescription(category) {
    switch(category) {
      case 'necessary':
        return 'Essential cookies that are required for the website to function properly.';
      case 'preferences':
        return 'Cookies that remember your preferences and choices on the website.';
      case 'analytics':
        return 'Cookies that help us understand how you use the website to improve user experience.';
      case 'marketing':
        return 'Cookies used to deliver advertisements that are relevant to you and your interests.';
      case 'thirdParty':
        return 'Cookies set by third-party services embedded on our website.';
      default:
        return '';
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
  }
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();