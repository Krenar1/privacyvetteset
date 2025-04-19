import { useState, useEffect, useRef } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
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
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import STRIPE_CONFIG from '../../config/stripe';
import api from '../../services/api';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Log the Stripe publishable key to verify it's loaded correctly
console.log('Stripe publishable key:', STRIPE_CONFIG.publishableKey.substring(0, 10) + '...');

interface CheckoutFormProps {
  clientSecret: string;
  productName: string;
  amount: number;
  currency: string;
  interval?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CheckoutForm = ({
  clientSecret,
  productName,
  amount,
  currency,
  interval,
  onSuccess,
  onCancel
}: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  // Log when Stripe and Elements are ready
  useEffect(() => {
    if (stripe && elements) {
      console.log('Stripe and Elements are initialized');
    }
  }, [stripe, elements]);

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

    if (!paymentElementReady) {
      setError('Payment form is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Confirming payment with client secret:', clientSecret.substring(0, 10) + '...');

      // Get the Payment Element instance
      const paymentElement = elements.getElement(PaymentElement);

      if (!paymentElement) {
        throw new Error('Payment element not found. Please refresh the page and try again.');
      }

      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
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
            Your payment for {productName} has been processed successfully.
          </p>
          <p className="font-medium">
            Amount: {formatCurrency(amount, currency)}
            {formatInterval(interval)}
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
            Secure payment for {productName}
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
              Amount: {formatCurrency(amount, currency)}
              {formatInterval(interval)}
            </p>
          </div>

          <div className="space-y-4">
            <PaymentElement
              onReady={() => {
                console.log('PaymentElement is ready');
                setPaymentElementReady(true);
              }}
              onChange={(event) => {
                console.log('PaymentElement change event:', event);
                if (event.complete) {
                  // The element is complete and ready for submission
                  console.log('PaymentElement is complete');
                }
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={!stripe || loading}>
            {loading ? <Spinner className="mr-2" /> : null}
            {loading ? 'Processing...' : `Pay ${formatCurrency(amount, currency)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

interface EmbeddedCheckoutProps {
  productId: number;
  customerInfo: {
    name: string;
    email: string;
    website_url: string;
    company_address?: string;
    company_phone?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EmbeddedCheckout = ({
  productId,
  customerInfo,
  onSuccess,
  onCancel,
}: EmbeddedCheckoutProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Initializing payment for product ID:', productId);

        // First, get the product details
        const product = await api.getProduct(productId);
        console.log('Product details retrieved:', product);
        setProductInfo(product);

        // Create a payment intent
        const paymentData = {
          name: customerInfo.name,
          email: customerInfo.email,
          website_url: customerInfo.website_url,
          company_address: customerInfo.company_address || '',
          company_phone: customerInfo.company_phone || '',
          plan: product.interval || 'one_time',
          price_id: productId,
        };

        console.log('Creating payment intent with data:', paymentData);
        const result = await api.createPaymentIntent(paymentData);

        if (!result.clientSecret) {
          throw new Error('No client secret returned from the server');
        }

        console.log('Payment intent created successfully with client secret:', result.clientSecret.substring(0, 10) + '...');
        setClientSecret(result.clientSecret);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [productId, customerInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner className="h-8 w-8" />
        <p className="ml-2">Initializing payment...</p>
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

  if (!clientSecret || !productInfo) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Unable to initialize payment</AlertDescription>
      </Alert>
    );
  }

  const options = {
    clientSecret,
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
    loader: 'auto',
  };

  console.log('Initializing Elements with options:', options);

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        clientSecret={clientSecret}
        productName={productInfo.name}
        amount={productInfo.unit_amount / 100} // Convert cents to dollars
        currency={productInfo.currency}
        interval={productInfo.interval}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default EmbeddedCheckout;
