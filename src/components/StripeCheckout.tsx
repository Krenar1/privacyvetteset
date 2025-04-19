import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface CheckoutFormProps {
  clientSecret: string;
  productName: string;
  amount: number;
  currency: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CheckoutForm = ({ clientSecret, productName, amount, currency, onSuccess, onCancel }: CheckoutFormProps) => {
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
          return_url: window.location.origin + '/payment/success',
        },
        redirect: 'if_required',
      });
      
      if (submitError) {
        throw new Error(submitError.message || 'Payment failed');
      }
      
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        throw new Error('Payment failed');
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
            <p className="font-medium mb-2">Amount: {formatCurrency(amount, currency)}</p>
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
            {loading ? 'Processing...' : `Pay ${formatCurrency(amount, currency)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

interface StripeCheckoutProps {
  productId?: number;
  productName: string;
  amount: number;
  currency?: string;
  email: string;
  name?: string;
  websiteUrl?: string;
  companyAddress?: string;
  companyPhone?: string;
  plan?: 'one_time' | 'monthly' | 'custom';
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripeCheckout = ({
  productId,
  productName,
  amount,
  currency = 'usd',
  email,
  name,
  websiteUrl,
  companyAddress,
  companyPhone,
  plan = 'one_time',
  onSuccess,
  onCancel,
}: StripeCheckoutProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const paymentData = {
          name,
          email,
          website_url: websiteUrl,
          company_address: companyAddress,
          company_phone: companyPhone,
          plan,
          price_id: productId,
        };
        
        const result = await api.createPaymentIntent(paymentData);
        
        setClientSecret(result.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create payment intent');
      } finally {
        setLoading(false);
      }
    };
    
    createPaymentIntent();
  }, [productId, email, name, websiteUrl, companyAddress, companyPhone, plan]);
  
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
        <AlertDescription>Unable to initialize payment</AlertDescription>
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
      <CheckoutForm
        clientSecret={clientSecret}
        productName={productName}
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default StripeCheckout;
