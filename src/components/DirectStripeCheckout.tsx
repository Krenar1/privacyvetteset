import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "../services/api";

const DirectStripeCheckout = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Immediately create a checkout session and redirect to Stripe
  useEffect(() => {
    const createCheckoutSession = async () => {
      if (!linkId) {
        setError("Invalid payment link");
        setLoading(false);
        return;
      }

      try {
        console.log('Creating checkout session for link ID:', linkId);

        // Get the product details from the payment link
        const linkData = await api.getCheckoutData(linkId);
        console.log('Checkout data received:', linkData);

        if (!linkData.product) {
          throw new Error("Product information not available");
        }

        console.log('Product details:', linkData.product);

        // Check if the product has a Stripe price ID
        if (!linkData.product.stripe_price_id) {
          console.warn("Product does not have a stripe_price_id, will try to use product_id instead");
        }

        // Get URL parameters for pre-filling customer info
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const name = urlParams.get('name');
        const website = urlParams.get('website');

        // Create a checkout session with all available information
        const sessionData = linkData.product.stripe_price_id
          ? {
              // If we have a stripe_price_id, use it
              price_id: linkData.product.stripe_price_id,
              success_url: window.location.origin + '/payment/success?session_id={CHECKOUT_SESSION_ID}',
              cancel_url: window.location.origin + '/payment/cancel',
              mode: linkData.product.interval === 'one_time' ? 'payment' : 'subscription',
              email: email || '',
              name: name || '',
              website_url: website || '',
            }
          : {
              // Otherwise, fall back to using product_id
              product_id: linkData.product.id,
              success_url: window.location.origin + '/payment/success?session_id={CHECKOUT_SESSION_ID}',
              cancel_url: window.location.origin + '/payment/cancel',
              mode: linkData.product.interval === 'one_time' ? 'payment' : 'subscription',
              email: email || '',
              name: name || '',
              website_url: website || '',
            };

        // Log which ID we're using
        if (linkData.product.stripe_price_id) {
          console.log('Using Stripe price ID:', linkData.product.stripe_price_id);
        } else {
          console.log('Using product ID as fallback:', linkData.product.id);
        }

        console.log('Creating Stripe checkout session with data:', sessionData);
        const result = await api.createCheckoutSession(sessionData);

        if (result.url) {
          // Redirect to Stripe Checkout
          console.log('Redirecting to Stripe Checkout:', result.url);
          window.location.href = result.url;
        } else {
          throw new Error("No checkout URL returned from the server");
        }
      } catch (err) {
        console.error('Error creating checkout session:', err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
      }
    };

    createCheckoutSession();
  }, [linkId, navigate]);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner className="h-8 w-8 mx-auto" />
        <p className="mt-4 text-gray-600">Redirecting to secure checkout...</p>
      </div>
    </div>
  );
};

export default DirectStripeCheckout;
