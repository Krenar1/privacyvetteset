import { useState, useEffect, useRef } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import STRIPE_CONFIG from '../../config/stripe';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface StripeEmbeddedCheckoutProps {
  clientSecret: string;
  sessionId: string;
  onSuccess?: () => void;
}

const StripeEmbeddedCheckout = ({ clientSecret, sessionId, onSuccess }: StripeEmbeddedCheckoutProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle checkout completion
  useEffect(() => {
    if (!clientSecret) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'stripe-embedded-checkout:completed') {
        console.log('Checkout completed successfully');
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      }

      if (event.data.type === 'stripe-embedded-checkout:loaded') {
        console.log('Checkout loaded successfully');
        setLoading(false);
        // Clear the loading timeout if checkout loaded successfully
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
      }

      if (event.data.type === 'stripe-embedded-checkout:error') {
        console.error('Checkout error:', event.data.payload);
        setError('An error occurred during checkout. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);

    // Set a timeout to detect if the checkout doesn't load within 5 seconds
    loadingTimeoutRef.current = setTimeout(() => {
      console.log('Checkout loading timeout - switching to fallback mode');
      setFallbackMode(true);
      setLoading(false);
    }, 5000);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [clientSecret, onSuccess]);

  if (!clientSecret) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>No checkout session found. Please try again.</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thank you for your purchase! Your payment has been processed successfully.</p>
        </CardContent>
      </Card>
    );
  }

  // Function to redirect to Stripe's hosted checkout
  const redirectToStripeCheckout = () => {
    // Redirect to Stripe's hosted checkout using the session ID
    window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
  };

  // Render fallback UI when embedded checkout fails to load
  if (fallbackMode) {
    return (
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Checkout Not Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">The embedded checkout is taking too long to load. This might be due to an ad blocker or privacy extension.</p>
            <p className="mb-6">You can continue with Stripe's secure hosted checkout instead.</p>
            <Button onClick={redirectToStripeCheckout} className="w-full">
              Continue to Stripe Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Spinner className="h-8 w-8" />
          <span className="ml-2">Loading checkout...</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="link"
              className="p-0 h-auto text-red-700 underline ml-2"
              onClick={redirectToStripeCheckout}
            >
              Try Stripe's hosted checkout instead
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className={loading ? 'hidden' : ''}>
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
};

export default StripeEmbeddedCheckout;
