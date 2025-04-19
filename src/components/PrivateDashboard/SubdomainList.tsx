import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { api } from "../../services/api";
import { format } from "date-fns";

// Define the Subdomain interface
interface Subdomain {
  id: number;
  name: string;
  user: string;
  is_active: boolean;
  primary_color: string;
  accent_color: string;
  logo_url?: string;
  created_at: string;

  // Trial-related fields
  status: 'trial' | 'active' | 'expired' | 'inactive';
  is_trial: boolean;
  trial_end_date?: string;
  paid_until?: string;
  days_left: number;
  trial_status: string;
}

interface SubdomainListProps {
  onSubdomainCreated?: (url: string) => void;
}

const SubdomainList = ({ onSubdomainCreated }: SubdomainListProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for the add/edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubdomain, setCurrentSubdomain] = useState<Subdomain | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    subdomain: "",
    primaryColor: "#00AEEF", // Default primary color
    accentColor: "#10B981", // Default accent color
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Fetch subdomains on component mount
  useEffect(() => {
    fetchSubdomains();
  }, []);

  // Fetch all subdomains
  const fetchSubdomains = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api.getAllSubdomains();
      setSubdomains(data.results || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch subdomains");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch subdomains",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);

      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for adding a new subdomain
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentSubdomain(null);
    setFormData({
      subdomain: "",
      primaryColor: "#00AEEF",
      accentColor: "#10B981",
    });
    setLogo(null);
    setLogoPreview(null);
    setIsModalOpen(true);
  };

  // Open modal for editing a subdomain
  const openEditModal = (subdomain: Subdomain) => {
    setIsEditing(true);
    setCurrentSubdomain(subdomain);
    setFormData({
      subdomain: subdomain.name,
      primaryColor: subdomain.primary_color,
      accentColor: subdomain.accent_color,
    });
    setLogo(null);
    setLogoPreview(subdomain.logo_url || null);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate subdomain format
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(formData.subdomain)) {
        throw new Error("Subdomain can only contain lowercase letters, numbers, and hyphens");
      }

      // Validate color format
      const colorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!colorRegex.test(formData.primaryColor) || !colorRegex.test(formData.accentColor)) {
        throw new Error("Colors must be valid hex color codes (e.g., #00AEEF)");
      }

      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append("subdomain", formData.subdomain);
      formDataObj.append("primary_color", formData.primaryColor);
      formDataObj.append("accent_color", formData.accentColor);

      if (logo) {
        formDataObj.append("logo", logo);
      }

      let data: { url?: string; [key: string]: any };
      if (isEditing && currentSubdomain) {
        // Update existing subdomain
        data = await api.updateSubdomain(currentSubdomain.id, formDataObj);
        toast({
          title: "Success!",
          description: "Subdomain has been updated successfully.",
          variant: "default",
        });
      } else {
        // Create new subdomain
        data = await api.setupSubdomain(formDataObj);
        toast({
          title: "Success!",
          description: "New subdomain has been created successfully.",
          variant: "default",
        });

        // If onSubdomainCreated callback is provided, call it with the URL
        if (onSubdomainCreated && data.url) {
          onSubdomainCreated(data.url);
          return; // Return early to prevent closing the modal and refreshing the list
        }
      }

      // Close modal and refresh the list
      closeModal();
      fetchSubdomains();

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save subdomain",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle subdomain deletion
  const handleDelete = async (subdomain: Subdomain) => {
    if (!confirm(`Are you sure you want to delete the subdomain "${subdomain.name}"?`)) {
      return;
    }

    setLoading(true);
    try {
      await api.deleteSubdomain(subdomain.id);
      toast({
        title: "Success!",
        description: "Subdomain has been deleted successfully.",
        variant: "default",
      });
      fetchSubdomains();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete subdomain",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Subdomain Management</h2>
        <Button onClick={openAddModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Subdomain
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subdomains</CardTitle>
          <CardDescription>
            Manage your branded PrivacyVet instances
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && subdomains.length === 0 ? (
            <div className="text-center py-4">Loading subdomains...</div>
          ) : subdomains.length === 0 ? (
            <div className="text-center py-4">No subdomains found. Create one to get started.</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Colors</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subdomains.map((subdomain) => (
                    <TableRow key={subdomain.id}>
                      <TableCell className="font-medium">{subdomain.name}</TableCell>
                      <TableCell>
                        <a
                          href={`https://${subdomain.name}.privacyvet.com`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:underline"
                        >
                          {subdomain.name}.privacyvet.com
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>{formatDate(subdomain.created_at)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {/* Show status badge with appropriate color */}
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              !subdomain.is_active ? 'bg-red-100 text-red-800' :
                              subdomain.is_trial && subdomain.days_left > 0 ? 'bg-blue-100 text-blue-800' :
                              subdomain.is_trial && subdomain.days_left <= 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {subdomain.trial_status}
                            </span>

                            {/* Show upgrade button for expired trials */}
                            {subdomain.is_active && subdomain.is_trial && subdomain.days_left <= 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="ml-2 h-6 text-xs"
                                onClick={() => window.location.href = `/checkout/e9197d4b?subdomain=${subdomain.name}`}
                              >
                                Upgrade
                              </Button>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: subdomain.primary_color }}
                            title="Primary color"
                          />
                          <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: subdomain.accent_color }}
                            title="Accent color"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(subdomain)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(subdomain)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Subdomain Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        // Only close the modal if it's explicitly being closed
        // This prevents the modal from closing when clicking on the color picker
        if (!open) {
          setIsModalOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]" onPointerDownOutside={(e) => {
          // Prevent closing when clicking on the color picker popover
          const target = e.target as HTMLElement;
          if (target.closest('.react-colorful') || target.closest('[data-radix-popper-content-wrapper]')) {
            e.preventDefault();
          }
        }}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Subdomain" : "Add New Subdomain"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details for this subdomain"
                : "Create a branded version of PrivacyVet for your clients"}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain Name</Label>
                <div className="flex items-center">
                  <Input
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    placeholder="your-subdomain"
                    className="rounded-r-none"
                    required
                    disabled={isEditing} // Disable editing of subdomain name
                  />
                  <div className="bg-gray-100 px-3 py-2 border border-l-0 border-input rounded-r-md text-gray-500">
                    .privacyvet.com
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Only lowercase letters, numbers, and hyphens are allowed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo (Optional)</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {logoPreview ? (
                      <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={logoPreview}
                          alt="Logo preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="cursor-pointer"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum file size: 5MB. Recommended size: 200x200px
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-4">
                    <ColorPicker
                      value={formData.primaryColor}
                      onChange={(color) => setFormData({ ...formData, primaryColor: color })}
                      className="h-10 w-10"
                    />
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="text"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      placeholder="#00AEEF"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Used for main UI elements
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center space-x-4">
                    <ColorPicker
                      value={formData.accentColor}
                      onChange={(color) => setFormData({ ...formData, accentColor: color })}
                      className="h-10 w-10"
                    />
                    <Input
                      id="accentColor"
                      name="accentColor"
                      type="text"
                      value={formData.accentColor}
                      onChange={handleInputChange}
                      placeholder="#10B981"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Used for buttons and highlights
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : isEditing ? "Update Subdomain" : "Create Subdomain"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubdomainList;
