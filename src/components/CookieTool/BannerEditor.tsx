import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Plus, Minus, Trash2, Save, Loader2, EyeIcon } from 'lucide-react';
import { Banner, CookieToolService, Domain } from '@/services/cookieToolService';

const formSchema = z.object({
  name: z.string().min(1, 'Banner name is required'),
  active: z.boolean().default(true),
  
  // Content
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  
  // Appearance
  layout: z.enum(['bar', 'popup', 'floating']).default('bar'),
  position: z.enum(['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right']).default('bottom'),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Must be a valid hex color'),
  font: z.string().default('Inter, system-ui, sans-serif'),
  cornerRadius: z.number().min(0).max(20).default(6),
  showLogo: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'auto']).default('light'),
  
  // Buttons
  acceptButtonText: z.string().min(1, 'Accept button text is required'),
  declineButtonText: z.string().min(1, 'Decline button text is required'),
  customizeButtonText: z.string().min(1, 'Customize button text is required'),
  savePreferencesButtonText: z.string().min(1, 'Save preferences button text is required'),
  
  // Advanced settings
  autoBlockCookies: z.boolean().default(true),
  respectDnt: z.boolean().default(true),
  collectAnalytics: z.boolean().default(true),
  expireDays: z.number().min(1).max(365).default(180),
  customTermsUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  customPrivacyUrl: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  customCss: z.string().optional(),
  
  // Scripts
  cookieScript: z.string().optional(),
  beforeAcceptScript: z.string().optional(),
  afterAcceptScript: z.string().optional(),
});

export type BannerFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<BannerFormValues> = {
  layout: 'bar',
  position: 'bottom',
  primaryColor: '#3b82f6',
  textColor: '#ffffff',
  backgroundColor: '#1f2937',
  font: 'Inter, system-ui, sans-serif',
  cornerRadius: 6,
  showLogo: true,
  theme: 'light',
  autoBlockCookies: true,
  respectDnt: true,
  collectAnalytics: true,
  expireDays: 180,
  acceptButtonText: 'Accept All',
  declineButtonText: 'Reject All',
  customizeButtonText: 'Customize',
  savePreferencesButtonText: 'Save Preferences',
  title: 'Cookie Consent',
  description: 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.'
};

interface BannerEditorProps {
  domainId: string;
  bannerId?: string;
  onSave: () => void;
}

export function BannerEditor({ domainId, bannerId, onSave }: BannerEditorProps) {
  const [loading, setLoading] = useState(bannerId !== undefined);
  const [saving, setSaving] = useState(false);
  const [domain, setDomain] = useState<Domain | null>(null);
  const [cookieCategories, setCookieCategories] = useState<Array<{
    id: string;
    name: string;
    description: string;
    required: boolean;
  }>>([
    {
      id: 'necessary',
      name: 'Necessary',
      description: 'These cookies are required for the website to function properly.',
      required: true,
    },
    {
      id: 'preferences',
      name: 'Preferences',
      description: 'These cookies allow the website to remember choices you have made in the past.',
      required: false,
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'These cookies collect information about how you use the website.',
      required: false,
    },
    {
      id: 'marketing',
      name: 'Marketing',
      description: 'These cookies are used to track visitors across websites.',
      required: false,
    },
  ]);
  
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange',
  });
  
  useEffect(() => {
    const loadDomain = async () => {
      try {
        const domains = await CookieToolService.getDomains();
        const domain = domains.find(d => d.id === domainId);
        if (domain) {
          setDomain(domain);
        }
      } catch (error) {
        console.error('Failed to load domain information:', error);
      }
    };
    
    const loadBanner = async () => {
      if (!bannerId) return;
      
      try {
        const banners = await CookieToolService.getBanners();
        const banner = banners.find(b => b.id === bannerId);
        
        if (banner) {
          // Convert banner data to form values
          form.reset({
            name: banner.name,
            active: banner.active,
            title: banner.title,
            description: banner.description || '',
            layout: banner.layout,
            position: banner.position,
            primaryColor: banner.primaryColor,
            textColor: banner.textColor,
            backgroundColor: banner.backgroundColor,
            font: banner.font,
            cornerRadius: banner.cornerRadius,
            showLogo: banner.showLogo,
            theme: banner.theme,
            acceptButtonText: banner.acceptButtonText,
            declineButtonText: banner.declineButtonText,
            customizeButtonText: banner.customizeButtonText,
            savePreferencesButtonText: banner.savePreferencesButtonText,
            autoBlockCookies: banner.autoBlockCookies,
            respectDnt: banner.respectDnt,
            collectAnalytics: banner.collectAnalytics,
            expireDays: banner.expireDays,
            customTermsUrl: banner.customTermsUrl || '',
            customPrivacyUrl: banner.customPrivacyUrl || '',
            customCss: banner.customCss || '',
            cookieScript: banner.cookieScript || '',
            beforeAcceptScript: banner.beforeAcceptScript || '',
            afterAcceptScript: banner.afterAcceptScript || '',
          });
          
          // Set cookie categories
          if (banner.cookieCategories && banner.cookieCategories.length > 0) {
            setCookieCategories(banner.cookieCategories);
          }
        }
      } catch (error) {
        console.error('Failed to load banner:', error);
        toast({
          title: 'Error',
          description: 'Failed to load banner data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadDomain();
    loadBanner();
  }, [domainId, bannerId, form]);
  
  const onSubmit = async (values: BannerFormValues) => {
    setSaving(true);
    try {
      const bannerData: Partial<Banner> = {
        ...values,
        domain: { id: domainId } as Domain,
        cookieCategories,
        domains: [{ id: domainId } as Domain],
      };
      
      if (bannerId) {
        // Update existing banner
        await CookieToolService.updateBanner(bannerId, bannerData as Banner);
        toast({
          title: 'Success',
          description: 'Banner updated successfully',
        });
      } else {
        // Create new banner
        await CookieToolService.createBanner(bannerData as Banner);
        toast({
          title: 'Success',
          description: 'Banner created successfully',
        });
      }
      
      onSave();
    } catch (error) {
      console.error('Failed to save banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to save banner. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const addCookieCategory = () => {
    setCookieCategories([
      ...cookieCategories,
      {
        id: `category-${cookieCategories.length + 1}`,
        name: `Custom Category ${cookieCategories.length + 1}`,
        description: 'Description of this cookie category',
        required: false,
      },
    ]);
  };
  
  const updateCookieCategory = (index: number, field: string, value: string | boolean) => {
    const updated = [...cookieCategories];
    updated[index] = { ...updated[index], [field]: value };
    setCookieCategories(updated);
  };
  
  const removeCookieCategory = (index: number) => {
    const updated = [...cookieCategories];
    updated.splice(index, 1);
    setCookieCategories(updated);
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
      <Card>
        <CardHeader>
          <CardTitle>{bannerId ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
          <CardDescription>
            {domain && `For domain: ${domain.domain}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="categories">Cookie Categories</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banner Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Cookie Banner" {...field} />
                          </FormControl>
                          <FormDescription>
                            For your reference only, not shown to users
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Active
                            </FormLabel>
                            <FormDescription>
                              When active, this banner will be shown on your website
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="layout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Layout</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select layout" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="bar">Bar</SelectItem>
                              <SelectItem value="popup">Popup</SelectItem>
                              <SelectItem value="floating">Floating</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            How the banner should be displayed on the page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="top">Top</SelectItem>
                              <SelectItem value="bottom">Bottom</SelectItem>
                              <SelectItem value="top-left">Top Left</SelectItem>
                              <SelectItem value="top-right">Top Right</SelectItem>
                              <SelectItem value="bottom-left">Bottom Left</SelectItem>
                              <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Where the banner should be positioned on the page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="appearance" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex space-x-2">
                            <div 
                              className="h-10 w-10 rounded-md border" 
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Color used for buttons and highlights
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <div className="flex space-x-2">
                            <div 
                              className="h-10 w-10 rounded-md border" 
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Background color of the banner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="textColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Text Color</FormLabel>
                          <div className="flex space-x-2">
                            <div 
                              className="h-10 w-10 rounded-md border" 
                              style={{ backgroundColor: field.value }}
                            />
                            <FormControl>
                              <Input type="text" {...field} />
                            </FormControl>
                          </div>
                          <FormDescription>
                            Color of the text in the banner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="font"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Font family for the banner text
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cornerRadius"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Corner Radius: {field.value}px</FormLabel>
                          <FormControl>
                            <Slider
                              min={0}
                              max={20}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                            />
                          </FormControl>
                          <FormDescription>
                            Rounded corners for the banner and buttons
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Theme</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select theme" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="auto">Auto (Follow System)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Color theme for the banner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="showLogo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Show Logo
                            </FormLabel>
                            <FormDescription>
                              Display your brand logo in the banner
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Main heading of the cookie consent banner
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell visitors about your cookie policy"
                              className="h-24"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Explain your cookie policy to users
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <h3 className="text-lg font-medium">Button Labels</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="acceptButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accept Button</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="declineButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Decline Button</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customizeButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customize Button</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="savePreferencesButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Save Preferences Button</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="categories" className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Cookie Categories</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCookieCategory}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" /> Add Category
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {cookieCategories.map((category, index) => (
                      <Card key={category.id} className="relative">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-center">
                            <Input
                              value={category.name}
                              onChange={(e) => updateCookieCategory(index, 'name', e.target.value)}
                              className="text-lg font-semibold"
                              placeholder="Category name"
                            />
                            {!category.required && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCookieCategory(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea
                            value={category.description}
                            onChange={(e) => updateCookieCategory(index, 'description', e.target.value)}
                            placeholder="Describe this cookie category"
                            className="h-20"
                          />
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`required-${category.id}`}
                              checked={category.required}
                              onCheckedChange={(checked) => updateCookieCategory(index, 'required', Boolean(checked))}
                              disabled={category.id === 'necessary'}
                            />
                            <label
                              htmlFor={`required-${category.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Required (cannot be disabled by user)
                            </label>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="settings">
                      <AccordionTrigger>Cookie Settings</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="autoBlockCookies"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Auto-block Cookies
                                  </FormLabel>
                                  <FormDescription>
                                    Automatically block cookies until consent is given
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="respectDnt"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Respect "Do Not Track"
                                  </FormLabel>
                                  <FormDescription>
                                    Honor DNT browser settings
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="collectAnalytics"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Collect Consent Analytics
                                  </FormLabel>
                                  <FormDescription>
                                    Track consent rates and banner interactions
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="expireDays"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Consent Expiration (days)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 180)}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Days before asking for consent again
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="links">
                      <AccordionTrigger>Custom URLs</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="customPrivacyUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Privacy Policy URL</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="https://example.com/privacy" {...field} />
                              </FormControl>
                              <FormDescription>
                                Custom URL to your privacy policy (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="customTermsUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Terms & Conditions URL</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="https://example.com/terms" {...field} />
                              </FormControl>
                              <FormDescription>
                                Custom URL to your terms of service (optional)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="customization">
                      <AccordionTrigger>Advanced Customization</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="customCss"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Custom CSS</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder=".privacyvet-banner { /* your custom CSS */ }"
                                  className="h-32 font-mono"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Add custom CSS to override default banner styles
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="scripts">
                      <AccordionTrigger>Custom Scripts</AccordionTrigger>
                      <AccordionContent className="space-y-6">
                        <FormField
                          control={form.control}
                          name="cookieScript"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cookie Script</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="function() { /* Handle cookies */ }"
                                  className="h-32 font-mono"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Custom JavaScript for cookie handling
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="beforeAcceptScript"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Before Accept Script</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="function() { /* Run before consent */ }"
                                  className="h-32 font-mono"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                JavaScript to run before consent is given
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="afterAcceptScript"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>After Accept Script</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="function() { /* Run after consent */ }"
                                  className="h-32 font-mono"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                JavaScript to run after consent is given
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Banner
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            Banner Preview
          </CardTitle>
          <CardDescription>
            This is how your cookie consent banner will look on your website
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-hidden">
          <div className="border rounded-lg p-6 relative">
            <div 
              className="p-4 rounded"
              style={{
                backgroundColor: form.watch('backgroundColor'),
                color: form.watch('textColor'),
                fontFamily: form.watch('font'),
                borderRadius: `${form.watch('cornerRadius')}px`,
              }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-semibold">{form.watch('title')}</h3>
                  <p className="text-sm">{form.watch('description')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    className="text-white"
                    style={{
                      backgroundColor: form.watch('primaryColor'),
                      borderRadius: `${form.watch('cornerRadius')}px`,
                    }}
                  >
                    {form.watch('acceptButtonText')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    style={{
                      color: form.watch('textColor'),
                      borderColor: form.watch('textColor'),
                      borderRadius: `${form.watch('cornerRadius')}px`,
                    }}
                  >
                    {form.watch('customizeButtonText')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}