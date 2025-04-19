import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Edit, Plus, Trash, Link, Copy, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types for our data
type Product = {
  id: number;
  name: string;
  description: string | null;
  unit_amount: number;
  currency: string;
  interval: string;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  formatted_price?: string;
};

type PaymentLink = {
  id: number;
  link_id: string;
  product: number;
  product_details?: Product;
  created_at: string;
  expires_at: string | null;
  is_active: boolean;
  checkout_url: string;
};

type NewProduct = {
  name: string;
  description: string;
  unit_amount: number;
  currency: string;
  interval: string;
  active: boolean;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentLinks, setPaymentLinks] = useState<Record<number, PaymentLink>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Auth context
  const { user } = useAuth();

  // Form states
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    unit_amount: 0,
    currency: "usd",
    interval: "one_time",
    active: true,
  });

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<PaymentLink | null>(null);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch products using API service
        const productsData = await api.getProducts();

        // Format the price for display
        const formattedProducts = (productsData.results || []).map((product: Product) => ({
          ...product,
          formatted_price: `$${(product.unit_amount / 100).toFixed(2)} ${product.currency.toUpperCase()} (${formatInterval(product.interval)})`
        }));

        setProducts(formattedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format interval for display
  const formatInterval = (interval: string) => {
    switch (interval) {
      case "one_time":
        return "One-Time";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return interval;
    }
  };

  // Handle product form submission
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Convert amount from dollars to cents
      const productData = {
        ...newProduct,
        unit_amount: Math.round(newProduct.unit_amount * 100),
      };

      let updatedProduct;

      if (editMode && currentProductId) {
        // Update existing product
        updatedProduct = await api.updateProduct(currentProductId, productData);
      } else {
        // Create new product
        updatedProduct = await api.createProduct(productData);
      }

      // Refresh products list
      const productsData = await api.getProducts();

      // Format the price for display
      const formattedProducts = (productsData.results || []).map((product: Product) => ({
        ...product,
        formatted_price: `$${(product.unit_amount / 100).toFixed(2)} ${product.currency.toUpperCase()} (${formatInterval(product.interval)})`
      }));

      setProducts(formattedProducts);

      // Reset form and close dialog
      setNewProduct({
        name: "",
        description: "",
        unit_amount: 0,
        currency: "usd",
        interval: "one_time",
        active: true,
      });
      setProductDialogOpen(false);
      setEditMode(false);
      setCurrentProductId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  // Edit product
  const handleEditProduct = (product: Product) => {
    setNewProduct({
      name: product.name,
      description: product.description || "",
      unit_amount: product.unit_amount / 100, // Convert cents to dollars for display
      currency: product.currency,
      interval: product.interval,
      active: product.active,
    });
    setEditMode(true);
    setCurrentProductId(product.id);
    setProductDialogOpen(true);
  };

  // Create a payment link for a product
  const createPaymentLink = async (productId: number) => {
    try {
      // Create payment link using API service
      const paymentLink = await api.createPaymentLink(productId);

      // Update payment links
      setPaymentLinks(prev => ({
        ...prev,
        [productId]: paymentLink
      }));

      // Set current link and open dialog
      setCurrentLink(paymentLink);
      setLinkDialogOpen(true);

      return paymentLink;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      return null;
    }
  };

  // Copy link to clipboard
  const copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLinkId(link);

    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopiedLinkId(null);
    }, 2000);
  };

  // Delete product
  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      // Delete product using API service
      await api.deleteProduct(id);

      // Update products list
      setProducts(products.filter(product => product.id !== id));

      // Remove any payment links for this product
      const newPaymentLinks = { ...paymentLinks };
      delete newPaymentLinks[id];
      setPaymentLinks(newPaymentLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products & Pricing</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditMode(false);
                    setNewProduct({
                      name: "",
                      description: "",
                      unit_amount: 0,
                      currency: "usd",
                      interval: "one_time",
                      active: true,
                    });
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editMode ? "Edit Product" : "Add New Product"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit_amount">Price (USD)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                      <Input
                        id="unit_amount"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-8"
                        value={newProduct.unit_amount}
                        onChange={(e) => setNewProduct({...newProduct, unit_amount: parseFloat(e.target.value)})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interval">Billing Interval</Label>
                    <Select
                      value={newProduct.interval}
                      onValueChange={(value) => setNewProduct({...newProduct, interval: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">One-Time</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newProduct.active}
                      onCheckedChange={(checked) => setNewProduct({...newProduct, active: checked})}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setProductDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editMode ? "Update" : "Create"} Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {products.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No products found. Create your first product to get started.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Interval</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.description || "-"}</TableCell>
                      <TableCell>${(product.unit_amount / 100).toFixed(2)} {product.currency.toUpperCase()}</TableCell>
                      <TableCell>{formatInterval(product.interval)}</TableCell>
                      <TableCell>
                        <Badge variant={product.active ? "default" : "secondary"}>
                          {product.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => createPaymentLink(product.id)}>
                                  <Link className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Generate shareable payment link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

        {/* Payment Link Dialog */}
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Shareable Payment Link</DialogTitle>
            </DialogHeader>
            {currentLink && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Share this link with your customers to allow them to purchase this product directly.
                </p>

                <div className="flex items-center space-x-2">
                  <div className="flex-1 p-2 border rounded-md bg-gray-50 overflow-x-auto">
                    <code className="text-sm">{currentLink.checkout_url}</code>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyLinkToClipboard(currentLink.checkout_url)}
                  >
                    {copiedLinkId === currentLink.checkout_url ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <div className="bg-primary/5 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Product Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Name:</div>
                    <div>{currentLink.product_details?.name}</div>

                    <div className="font-medium">Price:</div>
                    <div>{currentLink.product_details?.formatted_price}</div>

                    <div className="font-medium">Link ID:</div>
                    <div>{currentLink.link_id}</div>

                    <div className="font-medium">Created:</div>
                    <div>{new Date(currentLink.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Products;
