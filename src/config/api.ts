// API configuration
const API_CONFIG = {
  // Base URL for API requests - automatically selects based on environment
  baseUrl: process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:8000/' 
    : 'https://api.privacyvet.com/',

  // Frontend URL for redirects
  frontendUrl: process.env.NODE_ENV === 'development' 
    ? 'http://127.0.0.1:8080' 
    : 'https://privacyvet.com',

  // API endpoints
  endpoints: {
    // Auth
    login: 'api/token/',
    refreshToken: 'api/token/refresh/',
    userInfo: 'api/user/',

    // Websites
    websites: 'websites/',

    // Products
    products: 'products/',

    // Payment Links
    checkout: 'api/checkout/:id/',
    createPaymentIntent: 'api/create-payment-intent/',
    createCheckoutSession: 'api/create-checkout-session/',
    createSubscription: 'api/create-subscription/',
    cancelSubscription: 'api/cancel-subscription/:id/',
    paymentMethods: 'api/payment-methods/',
    addPaymentMethod: 'api/add-payment-method/',
    verifyCheckoutSession: 'api/verify-checkout-session/:id/',
    verifyPaymentIntent: 'api/verify-payment-intent/:id/',

    // Subscriptions
    resendEmail: 'api/subscriptions/:id/resend-email/',

    // Statistics
    statistics: 'statistics/',

    // Subdomain Setup
    setup: 'setup/',
    currentSubdomain: 'current-subdomain/',
    getSubdomainByName: 'subdomains/:name/',
    getSubdomainData: 'subdomains/:subdomain/',  // Endpoint to get subdomain data
    getAllSubdomains: 'subdomains/',  // Endpoint to get all subdomains
    updateSubdomain: 'subdomains/:id/',  // Endpoint to update a subdomain
    deleteSubdomain: 'subdomains/:id/'  // Endpoint to delete a subdomain
  }
};

export default API_CONFIG;
