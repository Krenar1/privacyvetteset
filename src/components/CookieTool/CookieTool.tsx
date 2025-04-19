import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import BannerManager from "./BannerManager";
import DomainManager from "./DomainManager";
import Analytics from "./Analytics";
import { CookieSettings } from "./CookieSettings";
import { ChartBar, GlobeAlt, Settings, LayoutDashboard, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeViewer } from "./CodeViewer";
import { CookieToolService } from "@/services/cookieToolService";

const CookieTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCode, setShowCode] = useState(false);
  const [clientId, setClientId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [scriptCode, setScriptCode] = useState("");
  const [dashboardData, setDashboardData] = useState({
    activeBanners: 0,
    totalImpressions: 0,
    acceptRate: 0,
    banners: [],
    domains: []
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Set the installation script code
    const code = CookieToolService.getInstallationCode(clientId);
    setScriptCode(code);

    // Load dashboard data
    const fetchDashboardData = async () => {
      try {
        const analyticsData = await CookieToolService.getAnalytics();
        const banners = await CookieToolService.getBanners();
        const domains = await CookieToolService.getDomains();

        setDashboardData({
          activeBanners: banners.filter(b => b.active).length,
          totalImpressions: analyticsData.impressions,
          acceptRate: analyticsData.acceptRate,
          banners: banners.slice(0, 5),  // Show max 5 recent banners
          domains: domains.slice(0, 5)   // Show max 5 recent domains
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [clientId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cookie Consent Manager</h1>
          <p className="text-muted-foreground">
            Create and manage cookie consent banners for your websites
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-2"
        >
          <Code size={16} />
          Get Installation Code
        </Button>
      </div>

      {showCode && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Installation Code</h2>
            <p className="mb-4 text-muted-foreground">
              Add this code to the <code>&lt;head&gt;</code> section of every page on your website.
            </p>
            <div className="relative">
              <CodeViewer code={scriptCode.trim()} language="html" />
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={handleCopyCode}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">
              This code loads the PrivacyVet Cookie Manager on your website and connects it to your account.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b">
          <TabsList className="flex h-auto p-0">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="banners" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <LayoutDashboard size={16} />
              Banners
            </TabsTrigger>
            <TabsTrigger 
              value="domains" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <GlobeAlt size={16} />
              Domains
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <ChartBar size={16} />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 px-4 py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Settings size={16} />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium">Active Banners</h3>
                <p className="text-3xl font-bold mt-2">{dashboardData.activeBanners}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {dashboardData.activeBanners === 1 
                    ? 'Across 1 domain' 
                    : `Across ${dashboardData.domains.filter(d => d.status === 'active').length} domains`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium">Total Impressions</h3>
                <p className="text-3xl font-bold mt-2">{dashboardData.totalImpressions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium">Accept Rate</h3>
                <p className="text-3xl font-bold mt-2">{dashboardData.acceptRate}%</p>
                <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Banners</h3>
                <div className="space-y-4">
                  {dashboardData.banners.length > 0 ? (
                    dashboardData.banners.map((banner: any) => (
                      <div key={banner.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{banner.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {banner.active 
                              ? `Active on ${banner.domains.length} ${banner.domains.length === 1 ? 'domain' : 'domains'}`
                              : 'Inactive'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {banner.active ? '642 impressions' : '0 impressions'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {banner.active ? '78% accept rate' : 'Not in use'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No banners created yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Domains</h3>
                <div className="space-y-4">
                  {dashboardData.domains.length > 0 ? (
                    dashboardData.domains.map((domain: any) => (
                      <div key={domain.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{domain.domain}</p>
                          <p className="text-sm text-muted-foreground">
                            {domain.verified ? 'Verified' : 'Pending verification'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {domain.banners.length} {domain.banners.length === 1 ? 'banner' : 'banners'} active
                          </p>
                          <p className="text-xs text-muted-foreground">Added {domain.dateAdded}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No domains added yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="banners">
          <BannerManager />
        </TabsContent>
        
        <TabsContent value="domains">
          <DomainManager />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
        
        <TabsContent value="settings">
          <CookieSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CookieTool;