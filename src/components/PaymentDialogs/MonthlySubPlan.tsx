import { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { formDataType } from "../Pricing";
import API_CONFIG from "../../config/api";
import api from "../../services/api";

// Import Stripe configuration
import STRIPE_CONFIG from "../../config/stripe";

// Initialize Stripe with the publishable key from config
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey)

const MonthlySubPlan = ({name, email, website_url, company_address, company_phone}: formDataType) => {
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const stripe = useStripe();
  const elements = useElements();


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true); // Start loading when the payment process begins

    if (!stripe || !elements) {
      setIsLoading(false); // Stop loading if there's an issue with Stripe or elements
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Step 1: Create payment intent using API service
    let clientSecret;
    try {
      const paymentData = await api.createPaymentIntent({
        name: name,
        email: email,
        website_url: website_url,
        company_address: company_address,
        company_phone: company_phone,
        plan: "monthly",
      });

      if (paymentData.error) {
        alert(paymentData.error);
        setIsLoading(false); // Stop loading if there's an error
        return;
      }

      clientSecret = paymentData.clientSecret;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create payment intent');
      setIsLoading(false);
      return;
    }
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    setIsLoading(false); // Stop loading after the payment attempt is complete

    if (result.error) {
      alert(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        setIsPaymentCompleted(true);
      }
    }
  };

  return (
    <div className="text-center space-y-4">
      {!isPaymentCompleted ? (
        <div className="text-center space-y-4">
          <DialogTitle className="text-xl font-semibold text-primary">
            Complete Your Payment for Monthly Subscription Plan
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            You're one step away from securing continuous privacy compliance for your business. Here's what you'll receive:
          </DialogDescription>

          {/* List of what's covered */}
        <ScrollArea className="h-[200px]">
            <div className="space-y-2 text-left text-gray-600">
                <ul className="list-disc pl-6">
                <h3 className="mb-2">What you recieve:</h3>

                <li>
                    <p><strong>Everything in One-Time Plan:</strong></p>
                    <p className="text-sm">You'll receive all the benefits of our one-time privacy policy update.</p>
                </li>
                <li>
                    <p><strong>Monthly Compliance Audits:</strong></p>
                    <p className="text-sm">Regular audits to ensure your business remains compliant with privacy laws.</p>
                </li>
                <li>
                    <p><strong>Automatic Policy Updates:</strong></p>
                    <p className="text-sm">Your privacy policy will be updated automatically as laws and regulations change.</p>
                </li>
                <li>
                    <p><strong>Regulatory Change Alerts:</strong></p>
                    <p className="text-sm">Get alerts about changes in privacy laws that could affect your business.</p>
                </li>
                <li>
                    <p><strong>Priority Support:</strong></p>
                    <p className="text-sm">Access priority support for any compliance-related questions or issues.</p>
                </li>
                <li>
                    <p><strong>Cookie Consent System:</strong></p>
                    <p className="text-sm">Ensure that your website is compliant with cookie consent regulations.</p>
                </li>
                <li>
                    <p><strong>DSAR Handling Tools:</strong></p>
                    <p className="text-sm">Tools to help you manage Data Subject Access Requests (DSAR) efficiently.</p>
                </li>
                </ul>
            </div>
        </ScrollArea>

          {/* Payment Form */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium text-primary">Enter Your Payment Details:</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <CardElement
                  className="w-full px-4 py-2 rounded-md border border-lightgray focus:outline-none"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#32325d',
                        fontFamily: 'Arial, sans-serif',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                    },
                  }}
                />
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                  disabled={!stripe || isLoading}
                >
                  {isLoading ? (
                    <p className="font-bold text-white">Loading...</p>
                  ) : (
                    "Complete Payment"
                    )}
                </button>
              </form>
            </div>
          </div>
      ) : (
        <div className="space-y-4">
          <DialogTitle className="text-xl font-semibold text-primary">
            Payment Completed
          </DialogTitle>
          <DialogDescription className="text-green-600">
            Thank you for subscribing! You will receive your tailored privacy compliance services shortly.
          </DialogDescription>
        </div>
      )}
    </div>
  );
};

export default function StripePaymentWrapper({name, email, website_url, company_address, company_phone}: formDataType) {
  return (
    <Elements stripe={stripePromise}>
      <MonthlySubPlan name={name} email={email} website_url={website_url} company_address={company_address} company_phone={company_phone}/>
    </Elements>
  );
}
