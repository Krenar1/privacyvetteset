import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ApiLink from "../../apiLink";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface PaymentFormProps {
  token: string;
}

function PaymentFormContent({ token }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<{
    type: string;
    amount: number;
    email: string;
  } | null>(null);
  
  const stripe = useStripe();
  const elements = useElements();
  const { paymentId } = useParams<{ paymentId: string }>();

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await fetch(`${ApiLink.url}/payment-info/${paymentId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Invalid or expired payment link");
        }

        const data = await response.json();
        setPaymentInfo(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load payment information");
      }
    };

    if (paymentId) {
      fetchPaymentInfo();
    }
  }, [paymentId, token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements || !paymentInfo) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch(`${ApiLink.url}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          payment_id: paymentId,
          type: paymentInfo.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret } = await response.json();

      // Confirm the payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card element not found");
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <a href="/" className="text-primary hover:underline">
          Return to homepage
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-green-600 mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. You will receive a confirmation email shortly.
        </p>
        <a href="/" className="text-primary hover:underline">
          Return to homepage
        </a>
      </div>
    );
  }

  if (!paymentInfo) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Complete Your Payment</h2>
      
      <div className="mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Payment Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Type:</span>
            <span>{paymentInfo.type === "one_time" ? "One-time Update" : 
                   paymentInfo.type === "monthly" ? "Monthly Subscription" :
                   "Free Audit"}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Amount:</span>
            <span>${paymentInfo.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span>{paymentInfo.email}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-3 border rounded-md">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#32325d',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#dc2626',
                  },
                },
              }}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !stripe}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : `Pay $${paymentInfo.amount.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export function PaymentForm() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent token={localStorage.getItem("token") || ""} />
    </Elements>
  );
} 