import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Domain, CookieConsentSettings } from "@/components/PrivateDashboard/CookieTool/CookieToolPage";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface CookieSettingsProps {
  domain: Domain;
  onSettingsChange: (settings: CookieConsentSettings) => void;
}

export const CookieSettings: React.FC<CookieSettingsProps> = ({ domain, onSettingsChange }) => {
  const [settings, setSettings] = useState<CookieConsentSettings>(domain.settings);
  const [generalSettings, setGeneralSettings] = useState({
    autoBlockCookies: true,
    respectDnt: true,
    collectAnalytics: true,
    expireDays: 180,
    customTermsUrl: "",
    customPrivacyUrl: "",
    customCss: "",
    cookieScript: "",
    beforeAcceptScript: "",
    afterAcceptScript: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Update settings when domain changes
  useEffect(() => {
    setSettings(domain.settings);
  }, [domain]);

  const handleGeneralToggle = (setting: string, checked: boolean) => {
    setGeneralSettings({ ...generalSettings, [setting]: checked });
  };

  const handleGeneralInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralSettings({ ...generalSettings, [name]: value });
  };

  // Update cookie categories
  const handleCategoryToggle = (category: keyof typeof settings.cookieCategories, checked: boolean) => {
    const updatedSettings = {
      ...settings,
      cookieCategories: {
        ...settings.cookieCategories,
        [category]: checked
      }
    };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  // Update position
  const handlePositionChange = (position: CookieConsentSettings['position']) => {
    const updatedSettings = { ...settings, position };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  // Update theme
  const handleThemeChange = (theme: CookieConsentSettings['theme']) => {
    const updatedSettings = { ...settings, theme };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  // Update logo visibility
  const handleLogoToggle = (checked: boolean) => {
    const updatedSettings = { ...settings, showLogo: checked };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  // Update customization settings
  const handleCustomizationChange = (
    field: keyof typeof settings.customization, 
    value: string | number
  ) => {
    const updatedSettings = {
      ...settings,
      customization: {
        ...settings.customization,
        [field]: value
      }
    };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  // Update consent text
  const handleTextChange = (
    field: keyof typeof settings.consentText, 
    value: string
  ) => {
    const updatedSettings = {
      ...settings,
      consentText: {
        ...settings.consentText,
        [field]: value
      }
    };
    setSettings(updatedSettings);
    onSettingsChange(updatedSettings);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API save
    setTimeout(() => {
      onSettingsChange(settings);
      setIsSaving(false);
      setShowSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSaveSuccess(false);
      }, 3000);
    }, 800);
  };

  // Extract domain name from URL for display
  const getDomainFromUrl = (url: string): string => {
    try {
      const hostname = new URL(url).hostname;
      return hostname;
    } catch (e) {
      return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }
  };

  // Preview component for the banner
  const BannerPreview = () => {
    const { customization, consentText, position, theme } = settings;
    const domainName = getDomainFromUrl(domain.url);
    
    const getPositionClasses = () => {
      switch(position) {
        case 'bottom': return 'bottom-0 left-0 right-0';
        case 'top': return 'top-0 left-0 right-0';
        case 'bottom-left': return 'bottom-0 left-0 max-w-md';
        case 'bottom-right': return 'bottom-0 right-0 max-w-md';
        case 'top-left': return 'top-0 left-0 max-w-md';
        case 'top-right': return 'top-0 right-0 max-w-md';
        default: return 'bottom-0 left-0 right-0';
      }
    };
    
    const themeClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
    
    return (
      <div className="border rounded-md p-4 mb-6 relative overflow-hidden" style={{ height: '300px' }}>
        <div className="text-center text-sm text-muted-foreground mb-2">
          Banner Preview for <strong>{domainName}</strong>
        </div>
        <div className="bg-gray-100 h-full w-full overflow-hidden relative rounded">
          {/* Mock browser bar */}
          <div className="h-8 bg-gray-200 flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
            </div>
            <div className="h-5 flex-1 bg-white rounded text-xs flex items-center px-2 text-gray-500">
              {domain.url}
            </div>
          </div>
          
          {/* Mock content */}
          <div className="p-3">
            <div className="h-3 bg-gray-200 w-3/4 mb-2 rounded"></div>
            <div className="h-3 bg-gray-200 w-1/2 mb-6 rounded"></div>
            <div className="h-24 bg-gray-200 w-full mb-4 rounded"></div>
            <div className="h-3 bg-gray-200 w-2/3 mb-2 rounded"></div>
            <div className="h-3 bg-gray-200 w-5/6 mb-2 rounded"></div>
          </div>
          
          {/* Cookie banner */}
          <div 
            className={`absolute ${getPositionClasses()} p-4 shadow-lg border m-2 rounded-md ${themeClass}`}
            style={{ 
              backgroundColor: customization.backgroundColor,
              color: customization.textColor,
              borderRadius: `${customization.cornerRadius}px`,
              fontFamily: customization.font || 'inherit'
            }}
          >
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="font-bold text-lg">{consentText.title}</h3>
                <p className="text-sm mt-1">{consentText.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button 
                  className="px-4 py-2 rounded text-sm font-medium"
                  style={{ 
                    backgroundColor: customization.primaryColor,
                    color: customization.buttonTextColor,
                    borderRadius: `${customization.cornerRadius}px`
                  }}
                >
                  {consentText.acceptAllButton}
                </button>
                <button 
                  className="px-4 py-2 rounded text-sm font-medium border"
                  style={{ 
                    borderRadius: `${customization.cornerRadius}px`,
                    borderColor: customization.primaryColor,
                    color: customization.primaryColor
                  }}
                >
                  {consentText.rejectAllButton}
                </button>
                <button 
                  className="px-4 py-2 rounded text-sm font-medium border"
                  style={{ 
                    borderRadius: `${customization.cornerRadius}px`,
                    borderColor: customization.primaryColor,
                    color: customization.primaryColor
                  }}
                >
                  {consentText.customizeButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <Alert className="mb-4">
        <Info className="h-4 w-4 mr-2" />
        <AlertDescription>
          These settings will only apply to <strong>{getDomainFromUrl(domain.url)}</strong>.
          {!domain.verified && " We recommend verifying your domain to ensure secure implementation."}
        </AlertDescription>
      </Alert>
      
      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="cookies">Cookie Categories</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance" className="space-y-6">
          <BannerPreview />
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Banner Appearance for {getDomainFromUrl(domain.url)}</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select 
                    value={settings.position} 
                    onValueChange={(value) => handlePositionChange(value as CookieConsentSettings['position'])}
                  >
                    <SelectTrigger className="w-full max-w-xs mt-1">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom">Bottom Bar</SelectItem>
                      <SelectItem value="top">Top Bar</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left Corner</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right Corner</SelectItem>
                      <SelectItem value="top-left">Top Left Corner</SelectItem>
                      <SelectItem value="top-right">Top Right Corner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="theme">Color Theme</Label>
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleThemeChange(value as CookieConsentSettings['theme'])}
                  >
                    <SelectTrigger className="w-full max-w-xs mt-1">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (Match User Preference)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showLogo">Show PrivacyVet Logo</Label>
                    <p className="text-sm text-muted-foreground">
                      Display "Powered by PrivacyVet" in the banner
                    </p>
                  </div>
                  <Switch
                    id="showLogo"
                    checked={settings.showLogo}
                    onCheckedChange={handleLogoToggle}
                  />
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Customization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <div 
                      className="h-6 w-6 rounded border" 
                      style={{ backgroundColor: settings.customization.primaryColor }}
                    />
                    <Input
                      id="primaryColor"
                      value={settings.customization.primaryColor}
                      onChange={(e) => handleCustomizationChange('primaryColor', e.target.value)}
                      className="w-32 font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="backgroundColor">Background Color</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <div 
                      className="h-6 w-6 rounded border" 
                      style={{ backgroundColor: settings.customization.backgroundColor }}
                    />
                    <Input
                      id="backgroundColor"
                      value={settings.customization.backgroundColor}
                      onChange={(e) => handleCustomizationChange('backgroundColor', e.target.value)}
                      className="w-32 font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="textColor">Text Color</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <div 
                      className="h-6 w-6 rounded border" 
                      style={{ backgroundColor: settings.customization.textColor }}
                    />
                    <Input
                      id="textColor"
                      value={settings.customization.textColor}
                      onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                      className="w-32 font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="buttonTextColor">Button Text Color</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <div 
                      className="h-6 w-6 rounded border" 
                      style={{ backgroundColor: settings.customization.buttonTextColor }}
                    />
                    <Input
                      id="buttonTextColor"
                      value={settings.customization.buttonTextColor}
                      onChange={(e) => handleCustomizationChange('buttonTextColor', e.target.value)}
                      className="w-32 font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="font">Font Family</Label>
                  <Select 
                    value={settings.customization.font} 
                    onValueChange={(value) => handleCustomizationChange('font', value)}
                  >
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="system-ui">System UI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="cornerRadius">Corner Radius ({settings.customization.cornerRadius}px)</Label>
                  <div className="pt-6 px-2">
                    <Slider
                      defaultValue={[settings.customization.cornerRadius]}
                      max={20}
                      step={1}
                      onValueChange={([value]) => handleCustomizationChange('cornerRadius', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="space-y-6">
          <BannerPreview />
          
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Text Content for {getDomainFromUrl(domain.url)}</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Banner Title</Label>
                  <Input
                    id="title"
                    value={settings.consentText.title}
                    onChange={(e) => handleTextChange('title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Banner Description</Label>
                  <Textarea
                    id="description"
                    value={settings.consentText.description}
                    onChange={(e) => handleTextChange('description', e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Brief explanation of why you use cookies on {getDomainFromUrl(domain.url)}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="acceptAllButton">Accept Button Text</Label>
                    <Input
                      id="acceptAllButton"
                      value={settings.consentText.acceptAllButton}
                      onChange={(e) => handleTextChange('acceptAllButton', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rejectAllButton">Reject Button Text</Label>
                    <Input
                      id="rejectAllButton"
                      value={settings.consentText.rejectAllButton}
                      onChange={(e) => handleTextChange('rejectAllButton', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customizeButton">Customize Button Text</Label>
                    <Input
                      id="customizeButton"
                      value={settings.consentText.customizeButton}
                      onChange={(e) => handleTextChange('customizeButton', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="savePreferencesButton">Preferences Save Button Text</Label>
                  <Input
                    id="savePreferencesButton"
                    value={settings.consentText.savePreferencesButton}
                    onChange={(e) => handleTextChange('savePreferencesButton', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Policy URLs</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customPrivacyUrl">Privacy Policy URL</Label>
                  <Input
                    id="customPrivacyUrl"
                    name="customPrivacyUrl"
                    value={generalSettings.customPrivacyUrl}
                    onChange={handleGeneralInputChange}
                    placeholder={`https://${getDomainFromUrl(domain.url)}/privacy-policy`}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="customTermsUrl">Cookie Policy URL</Label>
                  <Input
                    id="customTermsUrl"
                    name="customTermsUrl"
                    value={generalSettings.customTermsUrl}
                    onChange={handleGeneralInputChange}
                    placeholder={`https://${getDomainFromUrl(domain.url)}/cookie-policy`}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cookies" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Cookie Categories for {getDomainFromUrl(domain.url)}</h3>
              <p className="text-sm text-muted-foreground">
                Enable or disable cookie categories for this domain and customize their descriptions
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Strictly Necessary</Label>
                    <p className="text-sm text-muted-foreground">
                      Essential for the website to function properly (always enabled)
                    </p>
                  </div>
                  <Switch
                    checked={true}
                    disabled
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="preferences">Preferences</Label>
                    <p className="text-sm text-muted-foreground">
                      Remember user preferences to enhance experience
                    </p>
                  </div>
                  <Switch
                    id="preferences"
                    checked={settings.cookieCategories.preferences}
                    onCheckedChange={(checked) => handleCategoryToggle('preferences', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help understand how visitors use the site
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.cookieCategories.analytics}
                    onCheckedChange={(checked) => handleCategoryToggle('analytics', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing">Marketing</Label>
                    <p className="text-sm text-muted-foreground">
                      Used for advertising and retargeting
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={settings.cookieCategories.marketing}
                    onCheckedChange={(checked) => handleCategoryToggle('marketing', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="thirdParty">Third-party</Label>
                    <p className="text-sm text-muted-foreground">
                      Cookies from third-party services embedded on the site
                    </p>
                  </div>
                  <Switch
                    id="thirdParty"
                    checked={settings.cookieCategories.thirdParty}
                    onCheckedChange={(checked) => handleCategoryToggle('thirdParty', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="text-lg font-medium">Domain-Specific Settings for {getDomainFromUrl(domain.url)}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBlockCookies">Auto-block cookies before consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Block all non-essential cookies until user gives consent
                    </p>
                  </div>
                  <Switch
                    id="autoBlockCookies"
                    checked={generalSettings.autoBlockCookies}
                    onCheckedChange={(checked) => handleGeneralToggle("autoBlockCookies", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="respectDnt">Respect "Do Not Track" browser setting</Label>
                    <p className="text-sm text-muted-foreground">
                      Hide consent banner for users with DNT enabled
                    </p>
                  </div>
                  <Switch
                    id="respectDnt"
                    checked={generalSettings.respectDnt}
                    onCheckedChange={(checked) => handleGeneralToggle("respectDnt", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="collectAnalytics">Collect consent analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Track banner impressions and user consent choices
                    </p>
                  </div>
                  <Switch
                    id="collectAnalytics"
                    checked={generalSettings.collectAnalytics}
                    onCheckedChange={(checked) => handleGeneralToggle("collectAnalytics", checked)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="expireDays">Consent cookie expiry (days)</Label>
                  <Input
                    id="expireDays"
                    name="expireDays"
                    type="number"
                    value={generalSettings.expireDays}
                    onChange={handleGeneralInputChange}
                    className="max-w-xs mt-1"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Number of days until consent needs to be renewed
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Domain-Specific Scripts</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customCss">Custom CSS for {getDomainFromUrl(domain.url)}</Label>
                  <Textarea
                    id="customCss"
                    name="customCss"
                    value={generalSettings.customCss}
                    onChange={handleGeneralInputChange}
                    placeholder=".privacyvet-banner { /* your custom styles */ }"
                    rows={4}
                    className="mt-1 font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cookieScript">Cookie Script</Label>
                  <Textarea
                    id="cookieScript"
                    name="cookieScript"
                    value={generalSettings.cookieScript}
                    onChange={handleGeneralInputChange}
                    placeholder="// JavaScript to run for managing cookies"
                    rows={4}
                    className="mt-1 font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="beforeAcceptScript">Before Consent Script</Label>
                  <Textarea
                    id="beforeAcceptScript"
                    name="beforeAcceptScript"
                    value={generalSettings.beforeAcceptScript}
                    onChange={handleGeneralInputChange}
                    placeholder="// JavaScript to run before user gives consent"
                    rows={3}
                    className="mt-1 font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="afterAcceptScript">After Consent Script</Label>
                  <Textarea
                    id="afterAcceptScript"
                    name="afterAcceptScript"
                    value={generalSettings.afterAcceptScript}
                    onChange={handleGeneralInputChange}
                    placeholder="// JavaScript to run after user gives consent"
                    rows={3}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end items-center gap-4">
        {showSaveSuccess && (
          <p className="text-sm text-green-600">Settings saved successfully!</p>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};