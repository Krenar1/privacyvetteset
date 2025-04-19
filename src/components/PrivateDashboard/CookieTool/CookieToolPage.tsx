import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookieSettings } from "@/components/CookieTool/CookieSettings";
import { Separator } from "@/components/ui/separator";
import { X, PlusCircle, Copy, ExternalLink, Trash, BadgeCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export interface CookieConsentSettings {
  position: 'bottom' | 'top' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  theme: 'light' | 'dark' | 'auto';
  showLogo: boolean;
  customization: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonTextColor: string;
    font: string;
    cornerRadius: number;
  };
  cookieCategories: {
    necessary: boolean; // Always true, can't be disabled
    preferences: boolean;
    analytics: boolean;
    marketing: boolean;
    thirdParty: boolean;
  };
  consentText: {
    title: string;
    description: string;
    acceptAllButton: string;
    rejectAllButton: string;
    customizeButton: string;
    savePreferencesButton: string;
  };
}

export interface Domain {
  id: string;
  name: string;
  url: string;
  verified: boolean;
  settings: CookieConsentSettings;
}

const defaultSettings: CookieConsentSettings = {
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

export const CookieToolPage: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [showAddDomain, setShowAddDomain] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [newDomainUrl, setNewDomainUrl] = useState('');
  const [domainError, setDomainError] = useState('');
  const [integrationCode, setIntegrationCode] = useState('');
  const [activeTab, setActiveTab] = useState<string>('domains');
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  
  useEffect(() => {
    // Load domains from local storage
    const storedDomains = localStorage.getItem('privacyvet-domains');
    if (storedDomains) {
      const parsedDomains = JSON.parse(storedDomains);
      setDomains(parsedDomains);
      
      // Select the first domain if available
      if (parsedDomains.length > 0) {
        setSelectedDomain(parsedDomains[0]);
      }
    }
  }, []);
  
  useEffect(() => {
    // Save domains to local storage when they change
    if (domains.length > 0) {
      localStorage.setItem('privacyvet-domains', JSON.stringify(domains));
    } else {
      localStorage.removeItem('privacyvet-domains');
    }
  }, [domains]);
  
  useEffect(() => {
    // Generate integration code for the selected domain
    if (selectedDomain) {
      const domainId = selectedDomain.id;
      const hostname = extractHostname(selectedDomain.url);
      
      // Use an absolute URL for the script that points to your server
      // This ensures it can be loaded from any domain
      const scriptUrl = 'https://privacyvet.com/assets/js/cookie-consent.js';
      
      const script = `
<!-- PrivacyVet Cookie Consent Banner -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${scriptUrl}';
    script.setAttribute('data-domain-id', '${domainId}');
    script.setAttribute('data-domain', '${hostname}');
    script.setAttribute('data-api-url', 'https://privacyvet.com/api/cookie-settings');
    document.head.appendChild(script);
  })();
</script>
<!-- End PrivacyVet Cookie Consent Banner -->`;
      
      setIntegrationCode(script);
    }
  }, [selectedDomain]);
  
  const extractHostname = (url: string): string => {
    // Create an anchor element to parse the URL
    try {
      const a = new URL(url);
      return a.hostname;
    } catch (e) {
      // If the URL is invalid, try to extract the hostname manually
      // Strip the protocol
      let hostname = url.replace(/^(https?:\/\/)?(www\.)?/, '');
      // Strip the path
      hostname = hostname.split('/')[0];
      return hostname;
    }
  };
  
  const validateDomain = (domain: string): boolean => {
    // Basic domain validation regex
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };
  
  const handleAddDomain = () => {
    if (newDomainName.trim() === '') {
      setDomainError('Please enter a domain name');
      return;
    }
    
    if (newDomainUrl.trim() === '') {
      setDomainError('Please enter a domain URL');
      return;
    }
    
    // Validate URL format
    let url = newDomainUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    // Extract hostname for validation
    const hostname = extractHostname(url);
    
    if (!validateDomain(hostname)) {
      setDomainError('Please enter a valid domain (e.g. example.com)');
      return;
    }
    
    // Check if domain already exists
    if (domains.some(d => extractHostname(d.url) === hostname)) {
      setDomainError('This domain has already been added');
      return;
    }
    
    const newDomain: Domain = {
      id: generateDomainId(),
      name: newDomainName.trim(),
      url: url,
      verified: false,
      settings: {...defaultSettings} // Create a copy of default settings
    };
    
    const updatedDomains = [...domains, newDomain];
    setDomains(updatedDomains);
    setSelectedDomain(newDomain);
    setNewDomainName('');
    setNewDomainUrl('');
    setDomainError('');
    setShowAddDomain(false);
    setActiveTab('settings');
  };
  
  const handleDeleteDomain = (id: string) => {
    const updatedDomains = domains.filter(domain => domain.id !== id);
    setDomains(updatedDomains);
    
    if (selectedDomain?.id === id) {
      setSelectedDomain(updatedDomains.length > 0 ? updatedDomains[0] : null);
    }
  };
  
  const handleUpdateSettings = (settings: CookieConsentSettings) => {
    if (selectedDomain) {
      const updatedDomains = domains.map(domain => {
        if (domain.id === selectedDomain.id) {
          return { ...domain, settings };
        }
        return domain;
      });
      
      setDomains(updatedDomains);
      setSelectedDomain({ ...selectedDomain, settings });
    }
  };
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(integrationCode);
  };
  
  const startVerification = (domain: Domain) => {
    const code = `privacyvet-verify=${domain.id}`;
    setVerificationCode(code);
    setSelectedDomain(domain);
    setShowVerifyDialog(true);
  };
  
  const completeVerification = () => {
    if (selectedDomain) {
      const updatedDomains = domains.map(domain => 
        domain.id === selectedDomain.id 
          ? { ...domain, verified: true } 
          : domain
      );
      
      setDomains(updatedDomains);
      setSelectedDomain({ ...selectedDomain, verified: true });
      setShowVerifyDialog(false);
    }
  };
  
  const handleDomainUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDomainUrl(e.target.value);
    setDomainError('');
  };
  
  const generateDomainId = (): string => {
    return 'pvt_' + Math.random().toString(36).substring(2, 15);
  };
  
  return (
    <div className="container py-8 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cookie Consent Tool</h1>
      </div>
      
      <Tabs defaultValue="domains" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="domains">Domains</TabsTrigger>
          {selectedDomain && (
            <>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="domains">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((domain) => (
              <Card key={domain.id} className={`cursor-pointer ${selectedDomain?.id === domain.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedDomain(domain)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-lg truncate">{domain.name}</h3>
                        {domain.verified && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <BadgeCheck className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{domain.url}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleDeleteDomain(domain.id);
                      }}
                    >
                      <Trash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  {!domain.verified && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={(e) => { 
                        e.stopPropagation();
                        startVerification(domain);
                      }}
                    >
                      Verify Domain
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            
            <Card className={`cursor-pointer border-dashed ${showAddDomain ? 'hidden' : ''}`} onClick={() => setShowAddDomain(true)}>
              <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[100px]">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground font-medium">Add Domain</p>
              </CardContent>
            </Card>
            
            {showAddDomain && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">New Domain</h3>
                    <Button variant="ghost" size="icon" onClick={() => {
                      setShowAddDomain(false);
                      setDomainError('');
                    }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="domain-name">Domain Name</Label>
                      <Input 
                        id="domain-name"
                        value={newDomainName}
                        onChange={(e) => setNewDomainName(e.target.value)}
                        placeholder="My Website"
                      />
                    </div>
                    <div>
                      <Label htmlFor="domain-url">Domain URL</Label>
                      <Input 
                        id="domain-url"
                        value={newDomainUrl}
                        onChange={handleDomainUrlInput}
                        placeholder="example.com"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter the domain where the cookie banner will be displayed
                      </p>
                    </div>
                    {domainError && (
                      <p className="text-sm text-red-500">{domainError}</p>
                    )}
                    <Button onClick={handleAddDomain} disabled={!newDomainName || !newDomainUrl} className="w-full">
                      Add Domain
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {domains.length === 0 && !showAddDomain && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No domains added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first domain to get started with the cookie consent tool
              </p>
              <Button onClick={() => setShowAddDomain(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </div>
          )}
        </TabsContent>
        
        {selectedDomain && (
          <>
            <TabsContent value="settings">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{selectedDomain.name}</h2>
                  {selectedDomain.verified && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <BadgeCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{selectedDomain.url}</p>
              </div>
              <CookieSettings domain={selectedDomain} onSettingsChange={handleUpdateSettings} />
            </TabsContent>
            
            <TabsContent value="integration">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Integration Code</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add this code to the &lt;head&gt; section of your website to enable the cookie consent banner.
                  </p>
                  
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>{integrationCode}</code>
                    </pre>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={handleCopyCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Domain Verification</h2>
                  <Alert className="mb-4">
                    <AlertDescription>
                      {selectedDomain.verified 
                        ? 'This domain has been verified and cookie settings will be applied only to this domain.'
                        : 'Please verify domain ownership to ensure cookie settings are applied only to this domain.'}
                    </AlertDescription>
                  </Alert>
                  
                  {!selectedDomain.verified && (
                    <Button onClick={() => startVerification(selectedDomain)}>
                      Verify Domain
                    </Button>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Testing</h2>
                  <p className="text-muted-foreground mb-4">Test your cookie consent banner on your website after adding the integration code.</p>
                  
                  <Button variant="outline" asChild>
                    <a href={selectedDomain.url} target="_blank" rel="noopener noreferrer">
                      Visit {selectedDomain.name}
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Consent API</h2>
                  <p className="text-muted-foreground mb-4">
                    Use these JavaScript functions to interact with the consent manager programmatically.
                  </p>
                  
                  <div className="space-y-2">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>// Check if a specific cookie category is allowed
window.PrivacyVet.isAllowed('analytics');</code>
                    </pre>
                    
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>// Open the consent modal
window.PrivacyVet.showConsentModal();</code>
                    </pre>
                    
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Listen for consent changes
window.PrivacyVet.onConsentChange(function(categories) {
  console.log('Consent updated:', categories);
});`}</code>
                    </pre>
                  </div>
                </div>
                
                <Alert>
                  <AlertDescription>
                    The cookie banner will only appear for visitors browsing <strong>{extractHostname(selectedDomain.url)}</strong>. 
                    Each domain requires its own integration code.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>
      
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Domain Ownership</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <p className="text-sm">
              To verify that you own <strong>{selectedDomain?.url}</strong>, please add the following meta tag to the <code>&lt;head&gt;</code> section of your website:
            </p>
            
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code>{`<meta name="privacyvet-verification" content="${verificationCode}" />`}</code>
            </pre>
            
            <p className="text-sm text-muted-foreground">
              Once added, click the button below to complete the verification process.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={completeVerification}>
              Verify Domain
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};