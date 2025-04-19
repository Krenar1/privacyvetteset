import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Eye, PlusCircle } from "lucide-react";
import BannerEditor from "./BannerEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Banner {
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

const BannerManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([
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
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const handleCreateBanner = () => {
    setCurrentBanner(null);
    setEditMode(false);
    setShowEditor(true);
  };
  
  const handleEditBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setEditMode(true);
    setShowEditor(true);
  };
  
  const handleDeleteBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (currentBanner) {
      setBanners(banners.filter(b => b.id !== currentBanner.id));
      setShowDeleteDialog(false);
    }
  };
  
  const handlePreviewBanner = (banner: Banner) => {
    setCurrentBanner(banner);
    setShowPreview(true);
  };
  
  const handleToggleActive = (id: string, active: boolean) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, active } : banner
    ));
  };
  
  const handleSaveBanner = (bannerData: any) => {
    if (editMode && currentBanner) {
      // Update existing banner
      setBanners(banners.map(b => 
        b.id === currentBanner.id ? { ...b, ...bannerData } : b
      ));
    } else {
      // Create new banner
      const newBanner = {
        ...bannerData,
        id: Math.random().toString(36).substring(2, 9),
        active: false,
        domains: []
      };
      setBanners([...banners, newBanner]);
    }
    setShowEditor(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Banner Management</h2>
        <Button onClick={handleCreateBanner}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Banner
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {banners.length === 0 ? (
          <div className="col-span-full text-center p-10 border rounded-lg bg-muted">
            <p className="text-muted-foreground">No banners created yet. Create your first banner to get started.</p>
          </div>
        ) : (
          banners.map(banner => (
            <Card key={banner.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="h-16 w-full"
                  style={{ backgroundColor: banner.backgroundColor }}
                />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{banner.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {banner.domains.length 
                          ? `Used on ${banner.domains.length} domain${banner.domains.length !== 1 ? 's' : ''}`
                          : 'Not assigned to any domains'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={banner.active}
                        onCheckedChange={(checked) => handleToggleActive(banner.id, checked)}
                        id={`banner-active-${banner.id}`}
                      />
                      <Label htmlFor={`banner-active-${banner.id}`} className="text-sm">
                        {banner.active ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{banner.layout} layout</Badge>
                    <Badge variant="outline">{banner.position} position</Badge>
                    <Badge variant="outline">{banner.cookieCategories.length} categories</Badge>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreviewBanner(banner)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditBanner(banner)}
                    >
                      <Pencil className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteBanner(banner)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Banner Editor */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <BannerEditor 
              onSave={handleSaveBanner} 
              onCancel={() => setShowEditor(false)} 
              initialData={editMode ? currentBanner : undefined} 
            />
          </div>
        </div>
      )}
      
      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the "{currentBanner?.name}" banner permanently. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Banner Preview */}
      {showPreview && currentBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Banner Preview</h2>
            
            <div 
              className="p-6 rounded-md"
              style={{ backgroundColor: currentBanner.backgroundColor }}
            >
              <h3 
                className="font-semibold text-lg"
                style={{ color: currentBanner.textColor }}
              >
                {currentBanner.title}
              </h3>
              <p 
                className="mt-2"
                style={{ color: currentBanner.textColor }}
              >
                {currentBanner.description}
              </p>
              
              {currentBanner.cookieCategories.length > 0 && (
                <div className="mt-4 space-y-2">
                  {currentBanner.cookieCategories.map(category => (
                    <div key={category.id} className="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        defaultChecked={category.required}
                        disabled={category.required}
                        style={{ accentColor: currentBanner.primaryColor }}
                      />
                      <div>
                        <div style={{ color: currentBanner.textColor }}>{category.name}</div>
                        <div style={{ color: currentBanner.textColor, opacity: 0.8, fontSize: '0.875rem' }}>{category.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <button 
                  style={{ 
                    backgroundColor: currentBanner.primaryColor, 
                    color: currentBanner.textColor,
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none'
                  }}
                >
                  {currentBanner.acceptButtonText}
                </button>
                <button 
                  style={{ 
                    backgroundColor: 'transparent', 
                    color: currentBanner.textColor,
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: `1px solid ${currentBanner.textColor}`
                  }}
                >
                  {currentBanner.declineButtonText}
                </button>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setShowPreview(false)}>Close Preview</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManager;