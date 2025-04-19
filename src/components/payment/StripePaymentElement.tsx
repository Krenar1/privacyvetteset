import { useState, useEffect, useRef } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface CheckoutFormProps {
  clientSecret: string; // Kept for backward compatibility, but not used
  productName: string;
  amount: string;
  onSuccess?: () => void;
}

// Inner form component that receives Stripe objects from wrapper
const CheckoutForm = ({
  clientSecret,
  productName,
  amount,
  onSuccess,
}: CheckoutFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get stripe and elements from the wrapper component
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError(
        "Stripe has not been properly initialized. Please refresh the page."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Confirm the payment
      const { error: paymentError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + "/payment/success",
          },
          redirect: "if_required",
        });

      if (paymentError) {
        throw new Error(paymentError.message || "Payment failed");
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        console.log("Payment succeeded:", paymentIntent.id);
        setSuccess(true);
        if (onSuccess) {
          onSuccess();
        }
      } else if (paymentIntent && paymentIntent.status === "requires_action") {
        console.log("Payment requires additional action");
        // The payment requires additional actions, but we're handling this with redirect: 'if_required'
      } else if (paymentIntent) {
        console.log("Payment not succeeded:", paymentIntent.status);
        throw new Error(
          `Payment not completed. Status: ${paymentIntent.status}`
        );
      } else {
        throw new Error("Payment failed. No payment information returned.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during payment processing"
      );
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
          <p className="mt-2">
            Your payment of {amount} has been processed successfully.
          </p>
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
        {loading ? <Spinner className="mr-2 h-4 w-4" /> : null}
        {loading ? "Processing..." : `Pay ${amount}`}
      </Button>
    </form>
  );
};

interface StripePaymentElementProps {
  clientSecret: string;
  productName: string;
  amount: string;
  onSuccess?: () => void;
}

// Main component that wraps the Elements provider
const StripePaymentElement = ({
  clientSecret,
  productName,
  amount,
  onSuccess,
}: StripePaymentElementProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a short timeout to allow the component to render before showing the payment element
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#00AEEF",
        colorBackground: "#ffffff",
        colorText: "#30313d",
        colorDanger: "#df1b41",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "8px",
      },
    },
  };

  if (!clientSecret) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No payment session found. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full">
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Spinner className="h-8 w-8" />
          <span className="ml-2">Loading payment form...</span>
        </div>
      )}

      <div className={loading ? "hidden" : ""}>
        <CheckoutFormWrapper
          productName={productName}
          amount={amount}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  );
};

interface CheckoutFormWrapperProps {
  productName: string;
  amount: string;
  onSuccess?: () => void;
}

// Wrapper component that accesses the Elements context
const CheckoutFormWrapper = ({
  productName,
  amount,
  onSuccess,
}: CheckoutFormWrapperProps) => {
  // We don't need to get the clientSecret here anymore since it's already passed to the Elements provider
  return (
    <CheckoutForm
      clientSecret="" // This is not used anymore since we're using the Elements context
      productName={productName}
      amount={amount}
      onSuccess={onSuccess}
    />
  );
};

// We don't need the useClientSecret hook anymore since we're passing the clientSecret to the Elements provider

export default StripePaymentElement;
