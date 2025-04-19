import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { api } from '@/services/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  const sessionId = searchParams.get('session_id');
  const paymentIntentId = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Verifying payment with:', { sessionId, paymentIntentId, redirectStatus });

        // Check URL for client secret
        const urlParams = new URLSearchParams(window.location.search);
        const allParams = {};
        urlParams.forEach((value, key) => {
          allParams[key] = value;
        });
        console.log('All URL parameters:', allParams);

        // Look for payment_intent_client_secret or client_secret in the URL
        const clientSecret = urlParams.get('payment_intent_client_secret') ||
                            urlParams.get('client_secret') ||
                            redirectStatus; // Sometimes the client secret is in the redirect_status

        // Extract payment intent ID from client secret if available
        let extractedPaymentIntentId = null;
        if (clientSecret && clientSecret.includes('_secret_')) {
          extractedPaymentIntentId = clientSecret.split('_secret_')[0];
          console.log('Extracted payment intent ID from client secret:', extractedPaymentIntentId);
        }

        // Use the best available ID for verification
        const paymentIdToVerify = paymentIntentId || extractedPaymentIntentId;

        if (sessionId) {
          // Verify checkout session
          console.log('Verifying checkout session:', sessionId);
          const session = await api.verifyCheckoutSession(sessionId);
          console.log('Session verified:', session);
          setPaymentInfo(session);
        } else if (paymentIdToVerify) {
          // Verify payment intent
          console.log('Verifying payment intent:', paymentIdToVerify);
          const paymentIntent = await api.verifyPaymentIntent(paymentIdToVerify);
          console.log('Payment intent verified:', paymentIntent);
          setPaymentInfo(paymentIntent);
        } else if (redirectStatus === 'succeeded') {
          // Payment succeeded but no IDs provided
          console.log('Payment succeeded based on redirect status');
          setPaymentInfo({ status: 'succeeded' });
        } else {
          // If we still don't have payment info, try to get the latest payment
          console.log('No specific payment ID found, getting latest payment');
          try {
            const latestPayment = await api.getLatestPayment();
            if (latestPayment) {
              console.log('Found latest payment:', latestPayment);
              setPaymentInfo(latestPayment);
            } else {
              throw new Error('No payment information found');
            }
          } catch (latestError) {
            console.error('Error getting latest payment:', latestError);
            throw new Error('No payment information provided');
          }
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err instanceof Error ? err.message : 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, paymentIntentId, redirectStatus]);

  const handleGoToDashboard = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Verifying Payment</CardTitle>
            <CardDescription>Please wait while we verify your payment</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Spinner className="h-8 w-8" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Payment Verification Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={handleGoToDashboard} className="w-full">
              Go back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
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
          <div className="p-4 bg-green-50 rounded-md border border-green-200 mb-4">
            <p className="text-green-800">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
          </div>

          {paymentInfo && paymentInfo.amount && (
            <div className="mt-4">
              <p className="font-medium">Payment Details:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Amount: ${(paymentInfo.amount / 100).toFixed(2)} {paymentInfo.currency?.toUpperCase()}</li>
                {paymentInfo.product_name && (
                  <li>Product: {paymentInfo.product_name}</li>
                )}
                {paymentInfo.payment_type && (
                  <li>Type: {paymentInfo.payment_type === 'one_time' ? 'One-Time Payment' :
                            paymentInfo.payment_type === 'monthly' ? 'Monthly Subscription' :
                            paymentInfo.payment_type === 'yearly' ? 'Yearly Subscription' :
                            paymentInfo.payment_type}</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGoToDashboard} className="w-full">
            Go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
