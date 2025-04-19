import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import STRIPE_CONFIG from '../../config/stripe';
import api from '../../services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

export interface CustomerInfo {
  name: string;
  email: string;
  website_url: string;
  company_address?: string;
  company_phone?: string;
}

export interface ProductInfo {
  id?: number;
  name: string;
  description?: string;
  amount: number;
  currency?: string;
  interval?: 'one_time' | 'monthly' | 'yearly';
  stripe_price_id?: string;
}

interface CheckoutFormProps {
  clientSecret: string;
  productInfo: ProductInfo;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CheckoutForm = ({
  clientSecret,
  productInfo,
  onSuccess,
  onCancel
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'redirect'>('card');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe has not been properly initialized. Please refresh the page and try again.');
      return;
    }

    if (!clientSecret) {
      setError('Payment session has expired or is invalid. Please refresh the page and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Confirming payment with client secret:', clientSecret.substring(0, 10) + '...');

      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.origin + '/payment/success',
        },
        redirect: 'if_required',
      });

      if (submitError) {
        console.error('Payment confirmation error:', submitError);
        if (submitError.type === 'card_error') {
          throw new Error(submitError.message || 'Your card was declined. Please try another payment method.');
        } else if (submitError.type === 'validation_error') {
          throw new Error(submitError.message || 'Please check your card details and try again.');
        } else if (submitError.type === 'invalid_request_error') {
          throw new Error('The payment session has expired. Please refresh the page and try again.');
        } else {
          throw new Error(submitError.message || 'Payment failed');
        }
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent.id);
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else if (paymentIntent && paymentIntent.status === 'requires_action') {
        console.log('Payment requires additional action');
        // The payment requires additional actions, but we're handling this with redirect: 'if_required'
      } else if (paymentIntent) {
        console.log('Payment not succeeded:', paymentIntent.status);
        throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
      } else {
        throw new Error('Payment failed. No payment information returned.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during payment processing');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'usd') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatInterval = (interval?: string) => {
    if (!interval || interval === 'one_time') return '';
    return interval === 'monthly' ? '/month' : '/year';
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
          <p className="mb-4">
            Your payment for {productInfo.name} has been processed successfully.
          </p>
          <p className="font-medium">
            Amount: {formatCurrency(productInfo.amount, productInfo.currency)}
            {formatInterval(productInfo.interval)}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            Secure payment for {productInfo.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <p className="font-medium mb-2">
              Amount: {formatCurrency(productInfo.amount, productInfo.currency)}
              {formatInterval(productInfo.interval)}
            </p>
            {productInfo.description && (
              <p className="text-sm text-muted-foreground">{productInfo.description}</p>
            )}
          </div>

          <Tabs defaultValue="card" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" onClick={() => setPaymentMethod('card')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="other" onClick={() => setPaymentMethod('redirect')}>
                Other Payment Methods
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <PaymentElement />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={!stripe || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            {loading ? 'Processing...' : `Pay ${formatCurrency(productInfo.amount, productInfo.currency)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

interface UnifiedCheckoutProps {
  customerInfo: CustomerInfo;
  productInfo: ProductInfo;
  mode?: 'payment' | 'subscription';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const UnifiedCheckout = ({
  customerInfo,
  productInfo,
  mode = 'payment',
  onSuccess,
  onCancel,
}: UnifiedCheckoutProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Initializing checkout with Stripe Checkout Session');

        // Prepare common session data
        const sessionData = {
          email: customerInfo.email,
          name: customerInfo.name,
          website_url: customerInfo.website_url,
          company_address: customerInfo.company_address || '',
          company_phone: customerInfo.company_phone || '',
          success_url: window.location.origin + '/payment/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: window.location.origin + '/payment/cancel',
        };

        // Add product-specific data
        if (productInfo.stripe_price_id) {
          // If we have a Stripe price ID, use it directly
          sessionData['price_id'] = productInfo.stripe_price_id;
        } else if (productInfo.id) {
          // Otherwise use our internal product ID
          sessionData['product_id'] = productInfo.id;
        } else {
          throw new Error('No valid product information provided');
        }

        // Add mode information
        sessionData['mode'] = mode;

        console.log('Creating checkout session with data:', sessionData);

        const result = await api.createCheckoutSession(sessionData);

        if (!result.url) {
          throw new Error('No checkout URL returned from the server');
        }

        // Redirect to Stripe Checkout
        console.log('Redirecting to Stripe Checkout:', result.url);
        window.location.href = result.url;
      } catch (err) {
        console.error('Checkout initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize checkout. Please try again later.');
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [customerInfo, productInfo, mode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!clientSecret && mode === 'payment') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Unable to initialize payment</AlertDescription>
      </Alert>
    );
  }

  // If we're doing a subscription and we don't have a client secret,
  // it means we're redirecting to Stripe Checkout, so we don't need to render anything
  if (!clientSecret && mode === 'subscription') {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner className="h-8 w-8" />
        <p className="ml-2">Redirecting to secure checkout...</p>
      </div>
    );
  }

  const options = {
    clientSecret: clientSecret as string,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#00AEEF',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        clientSecret={clientSecret as string}
        productInfo={productInfo}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default UnifiedCheckout;
