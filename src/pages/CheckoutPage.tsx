import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import UnifiedCheckout, { CustomerInfo, ProductInfo } from '@/components/payment/UnifiedCheckout';
import api from '@/services/api';
import Header from '@/components/Header';

const CheckoutPage = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const productId = searchParams.get('productId');
  const mode = searchParams.get('mode') as 'payment' | 'subscription' || 'payment';
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  
  // Form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    website_url: '',
    company_address: '',
    company_phone: '',
  });
  
  const [formStep, setFormStep] = useState(1);
  const [formValid, setFormValid] = useState(false);
  
  // Fetch product details
  useEffect(() => {
    const fetchProductInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (linkId) {
          // Fetch from payment link
          const data = await api.getCheckoutData(linkId);
          
          if (data.product) {
            const product = data.product;
            setProductInfo({
              id: product.id,
              name: product.name,
              description: product.description,
              amount: product.unit_amount / 100, // Convert cents to dollars
              currency: product.currency,
              interval: product.interval as 'one_time' | 'monthly' | 'yearly',
              stripe_price_id: product.stripe_price_id,
            });
          } else {
            throw new Error('Product not found');
          }
        } else if (productId) {
          // Fetch product by ID
          const product = await api.getProduct(parseInt(productId));
          
          setProductInfo({
            id: product.id,
            name: product.name,
            description: product.description,
            amount: product.unit_amount / 100, // Convert cents to dollars
            currency: product.currency,
            interval: product.interval as 'one_time' | 'monthly' | 'yearly',
            stripe_price_id: product.stripe_price_id,
          });
        } else {
          throw new Error('No product specified');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductInfo();
  }, [linkId, productId]);
  
  // Validate form
  useEffect(() => {
    const { name, email, website_url } = customerInfo;
    setFormValid(
      name.trim() !== '' && 
      email.trim() !== '' && 
      website_url.trim() !== ''
    );
  }, [customerInfo]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValid) {
      setFormStep(2);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="mt-4 text-gray-600">Loading checkout information...</p>
        </div>
      </div>
    );
  }
  
  if (error || !productInfo) {
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
              <AlertDescription>{error || 'Product information not available'}</AlertDescription>
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Header />
      <div className="max-w-4xl mx-auto mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
          <p className="mt-2 text-gray-600">
            You're purchasing: <span className="font-medium">{productInfo.name}</span>
          </p>
          <p className="mt-1 text-gray-600">
            <span className="font-medium">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: productInfo.currency?.toUpperCase() || 'USD',
              }).format(productInfo.amount)}
              {productInfo.interval && productInfo.interval !== 'one_time' 
                ? ` / ${productInfo.interval === 'monthly' ? 'month' : 'year'}`
                : ''}
            </span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Details */}
            <div className="md:w-1/3 bg-gray-50 p-6">
              <div className="sticky top-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{productInfo.name}</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: productInfo.currency?.toUpperCase() || 'USD',
                      }).format(productInfo.amount)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: productInfo.currency?.toUpperCase() || 'USD',
                      }).format(productInfo.amount)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 bg-blue-50 p-4 rounded-md">
                  <div className="flex items-start">
                    <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-blue-800">Secure Checkout</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Your payment information is encrypted and secure. We use Stripe for secure payment processing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Checkout Form */}
            <div className="md:w-2/3 p-6">
              {formStep === 1 ? (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                  <form onSubmit={handleContinue} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website_url">Website URL</Label>
                      <Input
                        id="website_url"
                        name="website_url"
                        value={customerInfo.website_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company_address">Company Address (Optional)</Label>
                      <Input
                        id="company_address"
                        name="company_address"
                        value={customerInfo.company_address}
                        onChange={handleInputChange}
                        placeholder="123 Main St, City, State, ZIP"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company_phone">Company Phone (Optional)</Label>
                      <Input
                        id="company_phone"
                        name="company_phone"
                        value={customerInfo.company_phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
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
                  <UnifiedCheckout
                    customerInfo={customerInfo}
                    productInfo={productInfo}
                    mode={mode}
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

export default CheckoutPage;
