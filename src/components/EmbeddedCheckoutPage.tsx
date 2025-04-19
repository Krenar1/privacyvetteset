import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import api from "../services/api";
import Header from "./Header";
import StripePaymentElement from "./payment/StripePaymentElement";

type Product = {
  id: number;
  name: string;
  description: string;
  unit_amount: number;
  currency: string;
  interval: string;
  stripe_price_id: string;
  formatted_price?: string;
};

type CheckoutData = {
  product: Product;
  payment_link: {
    link_id: string;
    created_at: string;
  };
};

const CheckoutPage = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch product details and create checkout session
  useEffect(() => {
    const initializeCheckout = async () => {
      if (!linkId) {
        setError("Invalid payment link");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Get the product details from the payment link
        console.log('Fetching checkout data for link ID:', linkId);
        const data = await api.getCheckoutData(linkId);
        console.log('Checkout data received:', data);

        if (!data.product) {
          throw new Error("Product information not available");
        }

        // Format the price for display
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

        // Step 2: Create a checkout session
        console.log('Creating checkout session for product:', product.name);

        // Get URL parameters for pre-filling customer info
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const name = urlParams.get('name');
        const website = urlParams.get('website');

        const sessionData = {
          price_id: product.stripe_price_id,
          success_url: window.location.origin + '/payment/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: window.location.origin + '/payment/cancel',
          mode: product.interval === 'one_time' ? 'payment' : 'subscription',
          email: email || '',
          name: name || '',
          website_url: website || '',
          ui_mode: 'payment_element', // Use payment element instead of embedded checkout
        };

        console.log('Creating checkout session with data:', sessionData);
        const result = await api.createCheckoutSession(sessionData);

        if (!result.client_secret || !result.id) {
          throw new Error("No client secret or session ID returned from the server");
        }

        console.log('Checkout session created with client secret:', result.client_secret.substring(0, 10) + '...');
        console.log('Checkout session ID:', result.id);
        setClientSecret(result.client_secret);
        setSessionId(result.id);
      } catch (err) {
        console.error('Error initializing checkout:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [linkId]);

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
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              {clientSecret ? (
                <StripePaymentElement
                  clientSecret={clientSecret}
                  productName={product.name}
                  amount={product.formatted_price || `$${(product.unit_amount / 100).toFixed(2)}`}
                  onSuccess={() => navigate('/payment/success')}
                />
              ) : (
                <div className="flex justify-center items-center py-8">
                  <Spinner className="h-8 w-8" />
                  <span className="ml-2">Initializing checkout...</span>
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
