import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import api from "../services/api";
import Header from "./Header";
import EmbeddedCheckout from "./payment/EmbeddedCheckout";

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
  formatted_price?: string;
};

type PaymentLink = {
  link_id: string;
  created_at: string;
};

type CheckoutData = {
  product: Product;
  payment_link: PaymentLink;
};

const DirectCheckout = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website_url: "",
    company_address: "",
    company_phone: "",
  });

  const [formStep, setFormStep] = useState(1);
  const [formValid, setFormValid] = useState(false);

  // Fetch product details from the payment link
  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!linkId) {
        setError("Invalid payment link");
        setLoading(false);
        return;
      }

      try {
        // Use our API service to fetch checkout data
        console.log('Fetching checkout data for link ID:', linkId);
        const data = await api.getCheckoutData(linkId);
        console.log('Checkout data received:', data);

        setCheckoutData(data);

        // Format the price for display
        if (data.product) {
          const product = data.product;
          const formattedPrice = `$${(product.unit_amount / 100).toFixed(2)} ${product.currency.toUpperCase()}`;
          const interval = product.interval === 'one_time' ? ' (one-time)' :
                          product.interval === 'monthly' ? '/month' : '/year';

          setCheckoutData({
            ...data,
            product: {
              ...product,
              formatted_price: formattedPrice + interval
            }
          });

          // Auto-advance to payment step if we have product data
          if (formStep === 1) {
            // Pre-fill form data if available from the URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const email = urlParams.get('email');
            const name = urlParams.get('name');
            const website = urlParams.get('website');

            if (email || name || website) {
              setFormData(prev => ({
                ...prev,
                email: email || prev.email,
                name: name || prev.name,
                website_url: website || prev.website_url
              }));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [linkId, formStep]);

  // Validate form
  useEffect(() => {
    const { name, email, website_url } = formData;
    setFormValid(!!name && !!email && !!website_url);
  }, [formData]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      setFormStep(2);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center text-red-600">Checkout Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!checkoutData || !checkoutData.product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Product Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500">
              The product you're looking for is not available or has been removed.
            </p>
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { product } = checkoutData;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Header />
      <div className="max-w-4xl mx-auto mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="mt-2 text-gray-600">
            You're purchasing: <span className="font-medium">{product.name}</span>
          </p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">{product.formatted_price}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Details */}
            <div className="md:w-1/3 bg-gray-50 p-6">
              <div className="sticky top-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-2 border-t border-b">
                    <span>Price:</span>
                    <span className="font-semibold">{product.formatted_price}</span>
                  </div>

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center text-primary">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      <span>Secure checkout</span>
                    </div>
                    <p className="mt-2">
                      Your payment information is processed securely through Stripe.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="md:w-2/3 p-6">
              {formStep === 1 ? (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input
                        id="website_url"
                        name="website_url"
                        value={formData.website_url}
                        onChange={handleInputChange}
                        placeholder="example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company_address">Company Address (Optional)</Label>
                      <Input
                        id="company_address"
                        name="company_address"
                        value={formData.company_address}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company_phone">Company Phone (Optional)</Label>
                      <Input
                        id="company_phone"
                        name="company_phone"
                        value={formData.company_phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!formValid}
                    >
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                  <EmbeddedCheckout
                    productId={product.id}
                    customerInfo={formData}
                    onSuccess={() => navigate('/payment/success')}
                    onCancel={() => setFormStep(1)}
                  />
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setFormStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Information
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectCheckout;
