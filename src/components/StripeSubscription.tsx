import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Spinner } from './ui/spinner';
import STRIPE_CONFIG from '../config/stripe';
import api from '../services/api';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface SubscriptionFormProps {
  clientSecret: string;
  productName: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SubscriptionForm = ({ 
  clientSecret, 
  productName, 
  amount, 
  currency, 
  interval,
  onSuccess, 
  onCancel 
}: SubscriptionFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error: submitError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/subscription/success',
        },
        redirect: 'if_required',
      });
      
      if (submitError) {
        throw new Error(submitError.message || 'Subscription setup failed');
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Subscription setup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };
  
  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5" />
            Subscription Activated
          </CardTitle>
          <CardDescription>
            Thank you for subscribing!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Your subscription to {productName} has been set up successfully.
          </p>
          <p className="font-medium">
            Amount: {formatCurrency(amount, currency)}/{interval}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Set Up Your Subscription</CardTitle>
          <CardDescription>
            Subscribe to {productName}
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
              Amount: {formatCurrency(amount, currency)}/{interval}
            </p>
          </div>
          
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
            {loading ? 'Processing...' : `Subscribe for ${formatCurrency(amount, currency)}/${interval}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

interface StripeSubscriptionProps {
  priceId: string;
  productName: string;
  amount: number;
  currency?: string;
  interval: 'monthly' | 'yearly';
  email: string;
  name?: string;
  websiteId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripeSubscription = ({
  priceId,
  productName,
  amount,
  currency = 'usd',
  interval,
  email,
  name,
  websiteId,
  onSuccess,
  onCancel,
}: StripeSubscriptionProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const setupSubscription = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First, create a payment method
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
          billing_details: {
            email,
            name,
          },
        });
        
        setPaymentMethodId(paymentMethod.id);
        
        // Then create the subscription
        const subscriptionData = {
          price_id: priceId,
          email,
          name,
          website_id: websiteId,
          payment_method_id: paymentMethod.id,
        };
        
        const result = await api.createSubscription(subscriptionData);
        
        setClientSecret(result.client_secret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to set up subscription');
      } finally {
        setLoading(false);
      }
    };
    
    if (stripe && elements) {
      setupSubscription();
    }
  }, [priceId, email, name, websiteId, stripe, elements]);
  
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
  
  if (!clientSecret) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Unable to initialize subscription</AlertDescription>
      </Alert>
    );
  }
  
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };
  
  return (
    <Elements stripe={stripePromise} options={options}>
      <SubscriptionForm
        clientSecret={clientSecret}
        productName={productName}
        amount={amount}
        currency={currency}
        interval={interval}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripeSubscription;
