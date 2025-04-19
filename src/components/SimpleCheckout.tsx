import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ShieldCheck, CheckCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "../services/api";
import Header from "./Header";
import STRIPE_CONFIG from "../config/stripe";

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

type Product = {
  id: number;
  name: string;
  description: string;
  unit_amount: number;
  currency: string;
  interval: string;
  formatted_price?: string;
};

type CheckoutData = {
  product: Product;
  payment_link: {
    link_id: string;
    created_at: string;
  };
};

interface CheckoutFormProps {
  product: Product;
  customerInfo: {
    name: string;
    email: string;
    website_url: string;
    company_address: string;
    company_phone: string;
  };
  onSuccess: () => void;
}

// Checkout Form Component (inner component that uses Stripe hooks)
const CheckoutForm = ({ product, customerInfo, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not been properly initialized. Please refresh the page.");
      return;
    }

    setLoading(true);

    try {
      // Create a payment intent on the server
      const paymentData = {
        name: customerInfo.name,
        email: customerInfo.email,
        website_url: customerInfo.website_url,
        company_address: customerInfo.company_address || '',
        company_phone: customerInfo.company_phone || '',
        plan: product.interval || 'one_time',
        price_id: product.id,
      };

      console.log('Creating payment intent with data:', paymentData);
      const result = await api.createPaymentIntent(paymentData);

      if (!result.clientSecret) {
        throw new Error('No client secret returned from the server');
      }

      // Confirm the payment
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret: result.clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/payment/success',
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        throw new Error(paymentError.message || 'Payment failed');
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'An error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Payment Successful
          </CardTitle>
          <CardDescription>
            Thank you for your purchase!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your payment for {product.name} has been processed successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 mb-6">
        <PaymentElement />
      </div>

      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? <Spinner className="mr-2" /> : null}
        {loading ? 'Processing...' : `Pay ${product.formatted_price}`}
      </Button>
    </form>
  );
};

// Main SimpleCheckout Component
const SimpleCheckout = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Form state with URL parameter prefill
  const [customerInfo, setCustomerInfo] = useState({
    name: searchParams.get('name') || "",
    email: searchParams.get('email') || "",
    website_url: searchParams.get('website') || "",
    company_address: "",
    company_phone: "",
  });

  // Form validation
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
        console.log('Fetching checkout data for link ID:', linkId);
        const data = await api.getCheckoutData(linkId);
        console.log('Checkout data received:', data);

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
        } else {
          throw new Error("Product information not available");
        }
      } catch (err) {
        console.error('Error fetching checkout data:', err);
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [linkId]);

  // Validate form
  useEffect(() => {
    const { name, email, website_url } = customerInfo;
    setFormValid(
      name.trim() !== "" &&
      email.trim() !== "" &&
      website_url.trim() !== ""
    );
  }, [customerInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto" />
          <p className="mt-4 text-gray-600">Loading checkout information...</p>
        </div>
      </div>
    );
  }

  if (error || !checkoutData || !checkoutData.product) {
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
              <AlertDescription>{error || "Product information not available"}</AlertDescription>
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

  const { product } = checkoutData;

  // Options for Stripe Elements
  const stripeOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#00AEEF',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
    loader: 'auto',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto pt-20 pb-12 px-4">
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
                  <div className="flex justify-between">
                    <span className="text-gray-600">{product.name}</span>
                    <span className="font-medium">{product.formatted_price}</span>
                  </div>

                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">{product.formatted_price}</span>
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
              <div className="space-y-6">
                {/* Customer Information Form */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Your Information</h2>
                  <div className="space-y-4">
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
                  </div>
                </div>

                {/* Payment Form */}
                {formValid && (
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                    <Elements stripe={stripePromise} options={stripeOptions}>
                      <CheckoutForm
                        product={product}
                        customerInfo={customerInfo}
                        onSuccess={() => navigate('/payment/success')}
                      />
                    </Elements>
                  </div>
                )}

                {!formValid && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Required Information</AlertTitle>
                    <AlertDescription>
                      Please fill in all required fields to continue to payment.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCheckout;
