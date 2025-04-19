import { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Helper function to format website URL consistently
const formatWebsiteUrl = (url: string): string => {
  // Ensure URL has a scheme
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  try {
    // Parse the URL to get just the domain
    const urlObj = new URL(url);
    return urlObj.origin; // Returns just the scheme + domain + port
  } catch (e) {
    // If URL parsing fails, return the original URL
    console.error('Error parsing URL:', e);
    return url;
  }
};

// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  website: z.string().url({ message: 'Please enter a valid website URL' }).or(z.string().min(3, { message: 'Website must be at least 3 characters' })),
  phone: z.string().optional(),
});

// Define the form values type
type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  productName: string;
  amount: string;
  onSuccess?: () => void;
  initialEmail?: string;
  initialWebsite?: string;
  subdomain?: string; // Add subdomain parameter
}

/**
 * A component that renders a Stripe Payment Element.
 * IMPORTANT: This component must be used inside a Stripe Elements provider.
 */
const PaymentForm = ({ productName, amount, onSuccess, initialEmail = '', initialWebsite = '', subdomain = '' }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentElementReady, setPaymentElementReady] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialEmail,
      website: initialWebsite,
      phone: '',
    },
  });

  // Log when Stripe and Elements are ready
  useEffect(() => {
    if (stripe && elements) {
      console.log('Stripe and Elements are initialized');

      // Check if the PaymentElement is already mounted
      const paymentElement = elements.getElement(PaymentElement);
      if (paymentElement) {
        console.log('PaymentElement is already mounted');
        setPaymentElementReady(true);
      } else {
        console.log('PaymentElement is not yet mounted');
      }
    }
  }, [stripe, elements]);

  const onSubmit = async (data: FormValues) => {
    console.log('Payment form submitted with data:', data);

    if (!stripe) {
      console.error('Stripe not initialized');
      setError('Stripe has not been properly initialized. Please refresh the page.');
      return;
    }

    if (!elements) {
      console.error('Elements not initialized');
      setError('Payment form has not been properly initialized. Please refresh the page.');
      return;
    }

    if (!paymentElementReady) {
      console.error('PaymentElement not ready');
      setError('Payment form is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Confirming payment...');

      // Get the Payment Element instance
      const paymentElement = elements.getElement(PaymentElement);

      if (!paymentElement) {
        console.error('PaymentElement not found in elements');
        throw new Error('Payment element not found. Please refresh the page and try again.');
      }

      // Make sure we have a valid payment element before confirming
      if (!paymentElement._implementation) {
        console.error('PaymentElement is not fully initialized');
        throw new Error('Payment form is not complete. Please wait a moment and try again.');
      }

      console.log('Calling stripe.confirmPayment...');

      // Use a try-catch block specifically for the confirmPayment call
      try {
        const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            // Include payment_intent and redirect_status in the return URL
            return_url: window.location.origin + '/payment/success?redirect_status={PAYMENT_INTENT_CLIENT_SECRET}',
            payment_method_data: {
              billing_details: {
                email: data.email,
                phone: data.phone || undefined,
              },
              metadata: {
                website: formatWebsiteUrl(data.website),
                subdomain: subdomain || undefined,
              },
            },
          },
          redirect: 'if_required',
        });

        console.log('confirmPayment response:', {
          paymentError: paymentError ? { type: paymentError.type, message: paymentError.message } : null,
          paymentIntent: paymentIntent ? { id: paymentIntent.id, status: paymentIntent.status } : null
        });

        if (paymentError) {
          console.error('Payment confirmation error:', paymentError);
          throw new Error(paymentError.message || 'Payment failed');
        }

        if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('Payment succeeded:', paymentIntent.id);
          setSuccess(true);

          // Redirect to success page with payment intent ID and form data
          const params = new URLSearchParams({
            payment_intent: paymentIntent.id,
            redirect_status: 'succeeded',
            email: data.email,
            website: data.website,
          });
          if (data.phone) {
            params.append('phone', data.phone);
          }
          if (subdomain) {
            params.append('subdomain', subdomain);
          }
          window.location.href = `${window.location.origin}/payment/success?${params.toString()}`;
          return;
        } else if (paymentIntent && paymentIntent.status === 'requires_action') {
          console.log('Payment requires additional action');
          // The payment requires additional actions, but we're handling this with redirect: 'if_required'
        } else if (paymentIntent) {
          console.log('Payment not succeeded:', paymentIntent.status);
          throw new Error(`Payment not completed. Status: ${paymentIntent.status}`);
        } else {
          throw new Error('Payment failed. No payment information returned.');
        }
      } catch (confirmError) {
        console.error('Error in stripe.confirmPayment:', confirmError);
        throw new Error('Payment processing failed. Please try again or use a different payment method.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during payment processing');
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
        </CardHeader>
        <CardContent>
          <p>Thank you for your purchase of {productName}!</p>
          <p className="mt-2">Your payment of {amount} has been processed successfully.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  We'll send your receipt to this email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourwebsite.com" {...field} />
                </FormControl>
                <FormDescription>
                  The website you want to protect with our service.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
                </FormControl>
                <FormDescription>
                  We'll only use this for important account notifications.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4">
            <PaymentElement
              id="payment-element"
              onReady={() => {
                console.log('PaymentElement is ready');
                setPaymentElementReady(true);
              }}
              onChange={(event) => {
                console.log('PaymentElement change event:', event);
                setError(event.error ? event.error.message : null);
              }}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6"
          disabled={!stripe || !elements || loading || !paymentElementReady}
        >
          {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
          {loading ? 'Processing...' : `Pay ${amount}`}
        </Button>
      </form>
    </Form>
  );
};

export default PaymentForm;
