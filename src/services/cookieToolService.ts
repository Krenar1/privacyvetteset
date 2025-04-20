import ApiLink from '../../apiLink';
import { api } from './api';

export interface Domain {
  id: string;
  domain: string;
  name: string;
  verified: boolean;
  verification_key: string;
  created_at: string;
  updated_at: string;
  user?: string;
}

export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface Banner {
  id: string;
  name: string;
  title: string;
  description: string;
  active: boolean;
  domains: Domain[];
  layout: 'bar' | 'popup' | 'floating';
  position: 'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  cookieCategories: CookieCategory[];
  acceptButtonText: string;
  declineButtonText: string;
  customizeButtonText: string;
  savePreferencesButtonText: string;
  font: string;
  cornerRadius: number;
  showLogo: boolean;
  theme: 'light' | 'dark' | 'auto';
  autoBlockCookies: boolean;
  respectDnt: boolean;
  collectAnalytics: boolean;
  expireDays: number;
  customTermsUrl?: string;
  customPrivacyUrl?: string;
  customCss?: string;
  cookieScript?: string;
  beforeAcceptScript?: string;
  afterAcceptScript?: string;
  domain: Domain;
}

export interface ConsentStats {
  total_consents: number;
  accept_rate: number;
  necessary: number;
  preferences: number;
  analytics: number;
  marketing: number;
  third_party: number;
  daily_stats: Array<{
    date: string;
    total: number;
    accepts: number;
    rate: number;
  }>;
  weekly_stats: Array<{
    week: string;
    start_date: string;
    total: number;
    accepts: number;
    rate: number;
  }>;
  monthly_stats: Array<{
    month: string;
    start_date: string;
    total: number;
    accepts: number;
    rate: number;
  }>;
}

// Helper function to handle fetch requests with authentication
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const API_URL = ApiLink.url;
  const token = localStorage.getItem('accessToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Request failed: ${response.status}`);
  }

  return response;
};

export const CookieToolService = {
  // Domain Management
  async getDomains(): Promise<Domain[]> {
    const response = await fetchWithAuth('cookie-domains/');
    return response.json();
  },

  async addDomain(domain: string): Promise<Domain> {
    const response = await fetchWithAuth('cookie-domains/', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });
    return response.json();
  },

  async verifyDomain(id: string): Promise<any> {
    const response = await fetchWithAuth(`cookie-domains/${id}/verify/`, {
      method: 'POST'
    });
    return response.json();
  },

  async removeDomain(id: string): Promise<any> {
    const response = await fetchWithAuth(`cookie-domains/${id}/`, {
      method: 'DELETE'
    });
    return response;
  },

  // Banner Management
  async getBanners(): Promise<Banner[]> {
    const response = await fetchWithAuth('cookie-banners/');
    return response.json();
  },

  async getDomainBanners(domainId: string): Promise<Banner[]> {
    const response = await fetchWithAuth(`cookie-domains/${domainId}/banners/`);
    return response.json();
  },

  async createBanner(banner: Banner): Promise<Banner> {
    const response = await fetchWithAuth('cookie-banners/', {
      method: 'POST',
      body: JSON.stringify(banner)
    });
    return response.json();
  },

  async updateBanner(id: string, banner: Banner): Promise<Banner> {
    const response = await fetchWithAuth(`cookie-banners/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(banner)
    });
    return response.json();
  },

  async activateBanner(id: string): Promise<any> {
    const response = await fetchWithAuth(`cookie-banners/${id}/make_active/`, {
      method: 'POST'
    });
    return response.json();
  },

  async deleteBanner(id: string): Promise<any> {
    const response = await fetchWithAuth(`cookie-banners/${id}/`, {
      method: 'DELETE'
    });
    return response;
  },

  // Consent Analytics
  async getDomainStats(domainId: string): Promise<ConsentStats> {
    const response = await fetchWithAuth(`cookie-domains/${domainId}/stats/`);
    return response.json();
  },

  async getConsents(domainId: string): Promise<any> {
    const response = await fetchWithAuth(`cookie-consents/?domain=${domainId}`);
    return response.json();
  },
};