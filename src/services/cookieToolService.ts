import { axiosInstance } from '@/lib/axios';

export interface Banner {
  id: string;
  name: string;
  title: string;
  description: string;
  active: boolean;
  domains: string[];
  layout: string;
  position: string;
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  cookieCategories: { id: string; name: string; description: string; required: boolean }[];
  acceptButtonText: string;
  declineButtonText: string;
}

export interface Domain {
  id: string;
  domain: string;
  verified: boolean;
  status: 'active' | 'pending' | 'error';
  dateAdded: string;
  banners: string[];
}

export interface CookieSettings {
  autoBlockCookies: boolean;
  respectDnt: boolean;
  collectAnalytics: boolean;
  expireDays: number;
  customTermsUrl: string;
  customPrivacyUrl: string;
  customCss: string;
  cookieScript: string;
  beforeAcceptScript: string;
  afterAcceptScript: string;
}

export interface AnalyticsData {
  impressions: number;
  accepts: number;
  declines: number;
  acceptRate: number;
  categoryBreakdown: { name: string; value: number }[];
  deviceBreakdown: { name: string; value: number }[];
  dailyData: { name: string; impressions: number; accepts: number; declines: number }[];
  weeklyData: { name: string; impressions: number; accepts: number; declines: number }[];
  monthlyData: { name: string; impressions: number; accepts: number; declines: number }[];
}

export const CookieToolService = {
  // Banner endpoints
  async getBanners(): Promise<Banner[]> {
    // For demo purposes, returning mock data
    // In a real implementation, uncomment the API call
    // const response = await axiosInstance.get('/api/cookie-tool/banners');
    // return response.data;
    
    return [
      {
        id: '1',
        name: 'Standard Cookie Consent',
        title: 'Cookie Consent',
        description: 'We use cookies to improve your experience on our site. By clicking "Accept", you agree to our use of cookies.',
        active: true,
        domains: ['example.com'],
        layout: 'bar',
        position: 'bottom',
        primaryColor: '#2563eb',
        textColor: '#ffffff',
        backgroundColor: '#1e293b',
        cookieCategories: [
          { id: "necessary", name: "Necessary", description: "Required for the website to function properly", required: true },
          { id: "analytics", name: "Analytics", description: "Help us understand how visitors interact with our website", required: false },
        ],
        acceptButtonText: 'Accept',
        declineButtonText: 'Decline'
      },
      {
        id: '2',
        name: 'GDPR Compliant Banner',
        title: 'We Value Your Privacy',
        description: 'This website uses cookies to ensure you get the best experience on our website.',
        active: false,
        domains: [],
        layout: 'popup',
        position: 'bottom-right',
        primaryColor: '#10b981',
        textColor: '#ffffff',
        backgroundColor: '#064e3b',
        cookieCategories: [
          { id: "necessary", name: "Necessary", description: "Required for the website to function properly", required: true },
          { id: "analytics", name: "Analytics", description: "Help us understand how visitors interact with our website", required: false },
          { id: "marketing", name: "Marketing", description: "Used for marketing purposes", required: false }
        ],
        acceptButtonText: 'Accept All',
        declineButtonText: 'Accept Necessary Only'
      }
    ];
  },
  
  async createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    // const response = await axiosInstance.post('/api/cookie-tool/banners', banner);
    // return response.data;
    return {
      ...banner,
      id: Math.random().toString(36).substring(2, 9)
    } as Banner;
  },
  
  async updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
    // const response = await axiosInstance.put(`/api/cookie-tool/banners/${id}`, banner);
    // return response.data;
    return {
      ...(banner as Banner),
      id
    };
  },
  
  async deleteBanner(id: string): Promise<void> {
    // await axiosInstance.delete(`/api/cookie-tool/banners/${id}`);
    console.log(`Banner ${id} deleted`);
  },
  
  // Domain endpoints
  async getDomains(): Promise<Domain[]> {
    // const response = await axiosInstance.get('/api/cookie-tool/domains');
    // return response.data;
    return [
      {
        id: "1",
        domain: "example.com",
        verified: true,
        status: "active",
        dateAdded: "2025-03-15",
        banners: ["Standard Cookie Banner"]
      },
      {
        id: "2",
        domain: "test-site.org",
        verified: false,
        status: "pending",
        dateAdded: "2025-04-10",
        banners: []
      }
    ];
  },
  
  async addDomain(domain: string): Promise<Domain> {
    // const response = await axiosInstance.post('/api/cookie-tool/domains', { domain });
    // return response.data;
    return {
      id: Math.random().toString(36).substring(2, 9),
      domain,
      verified: false,
      status: "pending",
      dateAdded: new Date().toISOString().split('T')[0],
      banners: []
    };
  },
  
  async verifyDomain(id: string): Promise<Domain> {
    // const response = await axiosInstance.post(`/api/cookie-tool/domains/${id}/verify`);
    // return response.data;
    return {
      id,
      domain: "example.com",
      verified: true,
      status: "active",
      dateAdded: "2025-04-19",
      banners: []
    };
  },
  
  async removeDomain(id: string): Promise<void> {
    // await axiosInstance.delete(`/api/cookie-tool/domains/${id}`);
    console.log(`Domain ${id} removed`);
  },
  
  // Settings endpoints
  async getSettings(): Promise<CookieSettings> {
    // const response = await axiosInstance.get('/api/cookie-tool/settings');
    // return response.data;
    return {
      autoBlockCookies: true,
      respectDnt: true,
      collectAnalytics: true,
      expireDays: 180,
      customTermsUrl: "",
      customPrivacyUrl: "",
      customCss: "",
      cookieScript: "",
      beforeAcceptScript: "",
      afterAcceptScript: ""
    };
  },
  
  async saveSettings(settings: CookieSettings): Promise<CookieSettings> {
    // const response = await axiosInstance.put('/api/cookie-tool/settings', settings);
    // return response.data;
    return settings;
  },
  
  // Analytics endpoints
  async getAnalytics(): Promise<AnalyticsData> {
    // const response = await axiosInstance.get('/api/cookie-tool/analytics');
    // return response.data;
    return {
      impressions: 1211,
      accepts: 905,
      declines: 306,
      acceptRate: 75,
      categoryBreakdown: [
        { name: 'Necessary', value: 100 },
        { name: 'Analytics', value: 72 },
        { name: 'Marketing', value: 45 },
        { name: 'Preferences', value: 61 },
      ],
      deviceBreakdown: [
        { name: 'Desktop', value: 58 },
        { name: 'Mobile', value: 35 },
        { name: 'Tablet', value: 7 },
      ],
      dailyData: [
        { name: 'Apr 13', impressions: 120, accepts: 92, declines: 28 },
        { name: 'Apr 14', impressions: 156, accepts: 110, declines: 46 },
        { name: 'Apr 15', impressions: 142, accepts: 98, declines: 44 },
        { name: 'Apr 16', impressions: 168, accepts: 128, declines: 40 },
        { name: 'Apr 17', impressions: 189, accepts: 145, declines: 44 },
        { name: 'Apr 18', impressions: 204, accepts: 156, declines: 48 },
        { name: 'Apr 19', impressions: 232, accepts: 176, declines: 56 },
      ],
      weeklyData: [
        { name: 'Week 1', impressions: 845, accepts: 643, declines: 202 },
        { name: 'Week 2', impressions: 932, accepts: 701, declines: 231 },
        { name: 'Week 3', impressions: 1021, accepts: 786, declines: 235 },
        { name: 'Week 4', impressions: 1211, accepts: 905, declines: 306 },
      ],
      monthlyData: [
        { name: 'Jan', impressions: 3256, accepts: 2398, declines: 858 },
        { name: 'Feb', impressions: 3845, accepts: 2912, declines: 933 },
        { name: 'Mar', impressions: 4012, accepts: 3089, declines: 923 },
        { name: 'Apr', impressions: 4210, accepts: 3201, declines: 1009 },
      ]
    };
  },
  
  // Installation code
  getInstallationCode(clientId: string): string {
    return `
<script>
  // PrivacyVet Cookie Consent Manager
  (function() {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.privacyvet.com/cookie-manager/v1/cookie-manager.js';
    script.dataset.clientId = '${clientId}';
    
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);
  })();
</script>
    `.trim();
  }
};