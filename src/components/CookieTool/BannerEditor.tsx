import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ColorPicker } from "./ColorPicker";

interface BannerEditorProps {
  onSave: (bannerData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const BannerEditor: React.FC<BannerEditorProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    title: "Cookie Consent",
    description: "We use cookies to improve your experience on our site. By clicking 'Accept', you agree to our use of cookies.",
    acceptButtonText: "Accept",
    declineButtonText: "Decline",
    position: "bottom",
    layout: "bar",
    primaryColor: "#2563eb",
    textColor: "#ffffff",
    backgroundColor: "#1e293b",
    domains: [],
    cookieCategories: [
      { id: "necessary", name: "Necessary", description: "Required for the website to function properly", required: true },
      { id: "analytics", name: "Analytics", description: "Help us understand how visitors interact with our website", required: false },
      { id: "marketing", name: "Marketing", description: "Used to track visitors across websites for advertising purposes", required: false },
    ]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleColorChange = (name: string, color: string) => {
    setFormData({ ...formData, [name]: color });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-lg border">
      <h2 className="text-2xl font-semibold">{initialData ? "Edit Banner" : "Create Banner"}</h2>
      
      <Tabs defaultValue="content">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor="name">Banner Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter a name for internal reference"
            />
          </div>
          
          <div>
            <Label htmlFor="title">Banner Title</Label>
            <Input 
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Cookie Consent"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Banner Description</Label>
            <Textarea 
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Explain your cookie policy to users"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="acceptButtonText">Accept Button Text</Label>
              <Input 
                id="acceptButtonText"
                name="acceptButtonText"
                value={formData.acceptButtonText}
                onChange={handleInputChange}
                placeholder="Accept"
              />
            </div>
            <div>
              <Label htmlFor="declineButtonText">Decline Button Text</Label>
              <Input 
                id="declineButtonText"
                name="declineButtonText"
                value={formData.declineButtonText}
                onChange={handleInputChange}
                placeholder="Decline"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Position</Label>
              <Select 
                value={formData.position} 
                onValueChange={(value) => handleSelectChange("position", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom-left">Bottom Left</SelectItem>
                  <SelectItem value="bottom-right">Bottom Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="layout">Layout</Label>
              <Select 
                value={formData.layout} 
                onValueChange={(value) => handleSelectChange("layout", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="popup">Popup</SelectItem>
                  <SelectItem value="floating">Floating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Primary Color</Label>
              <ColorPicker 
                color={formData.primaryColor} 
                onChange={(color) => handleColorChange("primaryColor", color)} 
              />
            </div>
            <div>
              <Label>Text Color</Label>
              <ColorPicker 
                color={formData.textColor} 
                onChange={(color) => handleColorChange("textColor", color)} 
              />
            </div>
            <div>
              <Label>Background Color</Label>
              <ColorPicker 
                color={formData.backgroundColor} 
                onChange={(color) => handleColorChange("backgroundColor", color)} 
              />
            </div>
          </div>

          <div className="p-4 border rounded-lg mt-4">
            <div className="text-sm text-muted-foreground mb-2">Preview (Representative Only)</div>
            <div 
              className="p-4 rounded-md flex flex-col gap-2" 
              style={{ backgroundColor: formData.backgroundColor }}
            >
              <h3 style={{ color: formData.textColor, fontWeight: 'bold' }}>{formData.title}</h3>
              <p style={{ color: formData.textColor, fontSize: '0.875rem' }}>{formData.description}</p>
              <div className="flex gap-2 mt-2">
                <button 
                  style={{ backgroundColor: formData.primaryColor, color: formData.textColor, padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                >
                  {formData.acceptButtonText}
                </button>
                <button 
                  style={{ backgroundColor: 'transparent', color: formData.textColor, padding: '6px 12px', borderRadius: '4px', border: `1px solid ${formData.textColor}`, cursor: 'pointer' }}
                >
                  {formData.declineButtonText}
                </button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4">
          <div>
            <Label>Cookie Categories</Label>
            <div className="space-y-3 mt-2">
              {formData.cookieCategories.map((category: any, index: number) => (
                <div key={category.id} className="flex items-center gap-2 p-3 border rounded-md">
                  <input
                    type="checkbox"
                    checked={category.required}
                    readOnly={category.id === 'necessary'}
                    onChange={(e) => {
                      const updatedCategories = [...formData.cookieCategories];
                      updatedCategories[index].required = e.target.checked;
                      setFormData({ ...formData, cookieCategories: updatedCategories });
                    }}
                    disabled={category.id === 'necessary'}
                  />
                  <div>
                    <div className="font-medium">{category.name}</div>
                    <div className="text-sm text-muted-foreground">{category.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>{initialData ? "Update" : "Create"}</Button>
      </div>
    </div>
  );
};

export default BannerEditor;