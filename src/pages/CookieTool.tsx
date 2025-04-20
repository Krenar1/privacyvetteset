import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { DomainManager } from '@/components/CookieTool/DomainManager';
import { BannerEditor } from '@/components/CookieTool/BannerEditor';
import { ConsentAnalytics } from '@/components/CookieTool/ConsentAnalytics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CookieToolService, Domain, Banner } from '@/services/cookieToolService';
import { Loader2, ChevronRight } from 'lucide-react';

function Dashboard() {
  return (
    <div className="space-y-8">
      <Helmet>
        <title>Cookie Consent Management | PrivacyVet</title>
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cookie Consent Management</h1>
        
        <Tabs defaultValue="domains" className="space-y-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="domains">
            <DomainManager />
          </TabsContent>
          
          <TabsContent value="banners">
            <DomainBanners />
          </TabsContent>
          
          <TabsContent value="analytics">
            <DomainAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DomainBanners() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  
  useEffect(() => {
    loadDomains();
    loadBanners();
  }, []);
  
  const loadDomains = async () => {
    try {
      const domains = await CookieToolService.getDomains();
      setDomains(domains);
      
      // Auto-select the first domain
      if (domains.length > 0) {
        setSelectedDomain(domains[0]);
      }
    } catch (error) {
      console.error('Failed to load domains:', error);
    }
  };
  
  const loadBanners = async () => {
    try {
      const banners = await CookieToolService.getBanners();
      setBanners(banners);
    } catch (error) {
      console.error('Failed to load banners:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBanner = () => {
    // Navigate to create banner page
    window.location.href = `/cookie-tool/banner/new?domainId=${selectedDomain?.id}`;
  };
  
  const activateBanner = async (bannerId: string) => {
    try {
      await CookieToolService.activateBanner(bannerId);
      
      // Update local state
      setBanners(banners.map(banner => 
        banner.id === bannerId ? 
          { ...banner, active: true } : 
          banner.domain.id === selectedDomain?.id ? 
            { ...banner, active: false } : 
            banner
      ));
    } catch (error) {
      console.error('Failed to activate banner:', error);
    }
  };
  
  const getDomainBanners = () => {
    if (!selectedDomain) return [];
    return banners.filter(banner => banner.domain.id === selectedDomain.id);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {domains.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No domains have been added yet
          </p>
          <Button asChild>
            <Link to="/cookie-tool?tab=domains">Add Your First Domain</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {domains.map(domain => (
                <Button
                  key={domain.id}
                  variant={selectedDomain?.id === domain.id ? "default" : "outline"}
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domain.domain}
                </Button>
              ))}
            </div>
            
            <Button onClick={handleCreateBanner} disabled={!selectedDomain}>
              Create New Banner
            </Button>
          </div>
          
          <div className="space-y-4">
            {selectedDomain && (
              <>
                <h2 className="text-xl font-semibold">Banners for {selectedDomain.domain}</h2>
                
                {getDomainBanners().length === 0 ? (
                  <div className="text-center py-12 border rounded-lg">
                    <p className="text-muted-foreground mb-4">
                      No banners have been created for this domain yet
                    </p>
                    <Button onClick={handleCreateBanner}>
                      Create Your First Banner
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getDomainBanners().map(banner => (
                      <div 
                        key={banner.id} 
                        className={`border rounded-lg p-4 ${banner.active ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-medium">{banner.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {banner.position} • {banner.theme} • {banner.active ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          <div className="flex gap-2 items-center">
                            {!banner.active && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => activateBanner(banner.id)}
                              >
                                Activate
                              </Button>
                            )}
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/cookie-tool/banner/${banner.id}`}>
                                Edit <ChevronRight className="ml-1 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DomainAnalytics() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  
  useEffect(() => {
    loadDomains();
  }, []);
  
  const loadDomains = async () => {
    try {
      const domains = await CookieToolService.getDomains();
      setDomains(domains);
      
      // Auto-select the first domain
      if (domains.length > 0) {
        setSelectedDomainId(domains[0].id);
      }
    } catch (error) {
      console.error('Failed to load domains:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (domains.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">
          No domains have been added yet
        </p>
        <Button asChild>
          <Link to="/cookie-tool?tab=domains">Add Your First Domain</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {domains.map(domain => (
          <Button
            key={domain.id}
            variant={selectedDomainId === domain.id ? "default" : "outline"}
            onClick={() => setSelectedDomainId(domain.id)}
          >
            {domain.domain}
          </Button>
        ))}
      </div>
      
      {selectedDomainId && <ConsentAnalytics domainId={selectedDomainId} />}
    </div>
  );
}

function BannerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<Domain | null>(null);
  
  // Extract domainId from URL if creating a new banner
  const urlParams = new URLSearchParams(window.location.search);
  const domainId = urlParams.get('domainId');
  
  useEffect(() => {
    if (id !== 'new' && !domainId) {
      // If editing an existing banner, we need to load the banner first
      const loadBanner = async () => {
        try {
          const banners = await CookieToolService.getBanners();
          const banner = banners.find(b => b.id === id);
          
          if (banner) {
            setDomain(banner.domain);
          } else {
            // Banner not found
            navigate('/cookie-tool');
          }
        } catch (error) {
          console.error('Failed to load banner:', error);
          navigate('/cookie-tool');
        } finally {
          setLoading(false);
        }
      };
      
      loadBanner();
    } else if (domainId) {
      // When creating a new banner with a domainId
      const loadDomain = async () => {
        try {
          const domains = await CookieToolService.getDomains();
          const domain = domains.find(d => d.id === domainId);
          
          if (domain) {
            setDomain(domain);
          } else {
            // Domain not found
            navigate('/cookie-tool');
          }
        } catch (error) {
          console.error('Failed to load domain:', error);
          navigate('/cookie-tool');
        } finally {
          setLoading(false);
        }
      };
      
      loadDomain();
    }
  }, [id, domainId, navigate]);
  
  const handleSave = () => {
    navigate('/cookie-tool?tab=banners');
  };
  
  if (loading && id !== 'new') {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <Helmet>
        <title>{id === 'new' ? 'Create New Banner' : 'Edit Banner'} | PrivacyVet</title>
      </Helmet>
      
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/cookie-tool" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-white">
              Cookie Tool
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="ml-1 text-gray-500 md:ml-2">
                {id === 'new' ? 'Create Banner' : 'Edit Banner'}
              </span>
            </div>
          </li>
        </ol>
      </nav>
      
      {domain && (
        <BannerEditor 
          domainId={domain.id} 
          bannerId={id !== 'new' ? id : undefined} 
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default function CookieToolRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/banner/:id" element={<BannerPage />} />
    </Routes>
  );
}