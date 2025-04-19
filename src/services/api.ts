import ApiLink from '../../apiLink';
import API_CONFIG from '../config/api';

const API_URL = ApiLink.url;

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Generic fetch function with authentication
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const authHeader = getAuthHeader();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  });

  // Check if unauthorized (token expired)
  if (response.status === 401) {
    // Try to refresh token
    const refreshed = await refreshToken();

    if (refreshed) {
      // Retry the request with new token
      const newAuthHeader = getAuthHeader();
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...newAuthHeader,
          ...options.headers,
        },
      });
    } else {
      // If refresh failed, throw error
      throw new Error('Authentication failed');
    }
  }

  return response;
};

// Refresh token function
const refreshToken = async (): Promise<boolean> => {
  const refreshTokenValue = localStorage.getItem('refreshToken');

  if (!refreshTokenValue) {
    return false;
  }

  try {
    const response = await fetch(`${API_URL}api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshTokenValue }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    return true;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

// API functions
export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  },

  getUserInfo: async () => {
    const response = await fetchWithAuth(`${API_URL}api/user/`);

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return response.json();
  },

  // Websites
  getWebsites: async () => {
    const response = await fetchWithAuth(`${API_URL}websites/`);

    if (!response.ok) {
      throw new Error('Failed to fetch websites');
    }

    return response.json();
  },

  deleteWebsite: async (id: string) => {
    const response = await fetchWithAuth(`${API_URL}websites/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete website');
    }

    return true;
  },

  searchWebsites: async (query: string) => {
    const response = await fetchWithAuth(`${API_URL}websites/?cleaned_url=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Failed to search websites');
    }

    return response.json();
  },

  filterWebsites: async (filter: string) => {
    const response = await fetchWithAuth(`${API_URL}websites/?${filter}=true`);

    if (!response.ok) {
      throw new Error('Failed to filter websites');
    }

    return response.json();
  },

  getWebsitesPage: async (pageNumber: number, filter?: string, query?: string) => {
    let url = `${API_URL}websites/?offset=${(pageNumber - 1) * 10}`;

    if (filter) {
      url = `${API_URL}websites/?${filter}=true&offset=${(pageNumber - 1) * 10}`;
    }

    if (query) {
      url = `${API_URL}websites/?cleaned_url=${query}&offset=${(pageNumber - 1) * 10}`;
    }

    const response = await fetchWithAuth(url);

    if (!response.ok) {
      throw new Error('Failed to fetch websites page');
    }

    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetchWithAuth(`${API_URL}products/`);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  },

  createProduct: async (productData: any) => {
    const response = await fetchWithAuth(`${API_URL}products/`, {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create product');
    }

    return response.json();
  },

  updateProduct: async (id: number, productData: any) => {
    const response = await fetchWithAuth(`${API_URL}products/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update product');
    }

    return response.json();
  },

  deleteProduct: async (id: number) => {
    const response = await fetchWithAuth(`${API_URL}products/${id}/`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return true;
  },

  // Get product by ID
  getProduct: async (id: number) => {
    const response = await fetchWithAuth(`${API_URL}products/${id}/`);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  },

  // Get product prices
  getProductPrices: async (productId: number) => {
    const response = await fetchWithAuth(`${API_URL}products/${productId}/prices/`);

    if (!response.ok) {
      throw new Error('Failed to fetch product prices');
    }

    return response.json();
  },

  // Payment Links
  createPaymentLink: async (productId: number) => {
    const response = await fetchWithAuth(`${API_URL}products/${productId}/create_payment_link/`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to create payment link');
    }

    return response.json();
  },

  // Get checkout data from payment link
  getCheckoutData: async (linkId: string) => {
    const endpoint = API_CONFIG.endpoints.checkout.replace(':id', linkId);
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Payment link not found or expired');
      }
      throw new Error('Failed to load checkout data');
    }

    return response.json();
  },

  // Create payment intent
  createPaymentIntent: async (paymentData: any) => {
    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.createPaymentIntent}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    return response.json();
  },

  // Create checkout session
  createCheckoutSession: async (sessionData: any) => {
    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.createCheckoutSession}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    return response.json();
  },

  // Create subscription
  createSubscription: async (subscriptionData: any) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.createSubscription}`, {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create subscription');
    }

    return response.json();
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId: string, cancelAtPeriodEnd: boolean = true) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.cancelSubscription.replace(':id', subscriptionId)}`, {
      method: 'POST',
      body: JSON.stringify({ cancel_at_period_end: cancelAtPeriodEnd }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to cancel subscription');
    }

    return response.json();
  },

  // Get payment methods
  getPaymentMethods: async (email: string) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.paymentMethods}?email=${encodeURIComponent(email)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get payment methods');
    }

    return response.json();
  },

  // Add payment method
  addPaymentMethod: async (email: string, paymentMethodId: string, setAsDefault: boolean = true) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.addPaymentMethod}`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        payment_method_id: paymentMethodId,
        set_as_default: setAsDefault
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add payment method');
    }

    return response.json();
  },

  // Verify checkout session
  verifyCheckoutSession: async (sessionId: string) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.verifyCheckoutSession.replace(':id', sessionId)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify checkout session');
    }

    return response.json();
  },

  // Verify payment intent
  verifyPaymentIntent: async (paymentIntentId: string) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.verifyPaymentIntent.replace(':id', paymentIntentId)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify payment intent');
    }

    return response.json();
  },

  // Get latest payment
  getLatestPayment: async () => {
    const response = await fetchWithAuth(`${API_URL}/api/payments/latest/`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get latest payment');
    }

    return response.json();
  },

  // Setup a new subdomain
  setupSubdomain: async (formData: FormData) => {
    const url = `${API_URL}${API_CONFIG.endpoints.setup}`;

    const response = await fetch(url, {
      method: 'POST',
      body: formData, // FormData for file upload
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create subdomain');
    }

    const data = await response.json();
    return data;
  },

  // Get current subdomain info
  getCurrentSubdomain: async () => {
    // Determine subdomain from hostname
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    let subdomain = null;

    if (isLocalhost) {
      // For localhost, check if we're using subdomain.localhost format
      const port = window.location.port;
      const fullHost = port ? `${hostname}:${port}` : hostname;
      const hostParts = fullHost.split('.');

      if (hostParts.length > 1 && hostParts[0] !== 'www' && hostParts[0] !== 'localhost') {
        subdomain = hostParts[0];
      }
    } else {
      // For production, extract subdomain from hostname
      const hostParts = hostname.split('.');
      if (hostParts.length > 2 && hostParts[0] !== 'www') {
        subdomain = hostParts[0];
      }
    }

    if (!subdomain) {
      return null; // No subdomain detected
    }

    const response = await fetch(`${API_URL}${API_CONFIG.endpoints.currentSubdomain}`, {
      headers: {
        'X-Subdomain': subdomain,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // No subdomain found
      }
      throw new Error('Failed to get subdomain info');
    }

    return response.json();
  },

  // Get dashboard statistics
  getStatistics: async () => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.statistics}`);

    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }

    return response.json();
  },

  // Get subdomain by name
  getSubdomainByName: async (name: string) => {
    // For API requests, we need to set the X-Subdomain header for proper backend routing
    const endpoint = API_CONFIG.endpoints.getSubdomainByName.replace(':name', name);
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'X-Subdomain': name, // Set the subdomain in the header for backend routing
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Subdomain not found');
      }
      throw new Error('Failed to get subdomain info');
    }

    return response.json();
  },

  // Get all subdomains
  getAllSubdomains: async () => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.getAllSubdomains}`);

    if (!response.ok) {
      throw new Error('Failed to get subdomains');
    }

    return response.json();
  },

  // Update a subdomain
  updateSubdomain: async (id: number, formData: FormData) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.updateSubdomain.replace(':id', id.toString())}`, {
      method: 'PUT',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update subdomain');
    }

    return response.json();
  },

  // Delete a subdomain
  deleteSubdomain: async (id: number) => {
    const response = await fetchWithAuth(`${API_URL}${API_CONFIG.endpoints.deleteSubdomain.replace(':id', id.toString())}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete subdomain');
    }

    return true;
  },

  // Get business/website data for a subdomain
  getSubdomainData: async (subdomain: string) => {
    try {
      // Normalize the subdomain to lowercase
      const normalizedSubdomain = subdomain.toLowerCase().trim();

      // Make the API call to get subdomain data from the backend
      const endpoint = API_CONFIG.endpoints.getSubdomainData.replace(':subdomain', normalizedSubdomain);
      const url = `${API_URL}${endpoint}`;

      // Make the request to the working endpoint
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return { exists: false, error: 'Subdomain not found' };
        }
        throw new Error(`Failed to get subdomain data: ${response.statusText}`);
      }

      // Parse the response as JSON
      const data = await response.json();
      return { exists: true, data };
    } catch (error) {
      throw error;
    }
  },

  // Email Resending
  resendEmail: async (subscriptionId: number) => {
    const response = await fetchWithAuth(`${API_URL}api/subscriptions/${subscriptionId}/resend-email/`, {
      method: 'POST',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to resend email');
    }

    return response.json();
  },
};

export default api;
