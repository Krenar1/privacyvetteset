import { useState, useEffect } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Dialog, DialogDescription, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { formDataType } from "../Pricing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import api from "../../services/api";

// Import Stripe configuration
import STRIPE_CONFIG from "../../config/stripe";

// Initialize Stripe with the publishable key from config
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

type Product = {
  id: number;
  name: string;
  description: string | null;
  unit_amount: number;
  currency: string;
  interval: string;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  active: boolean;
  formatted_price?: string;
};

interface CustomProductPaymentProps extends formDataType {
  productId?: number;
  isDirectCheckout?: boolean;
}

const CustomProductPayment = ({
  name,
  email,
  website_url,
  company_address,
  company_phone,
  productId,
  isDirectCheckout = false,
}: CustomProductPaymentProps) => {
  const [isPaymentCompleted, setIsPaymentCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    productId || null
  );
  const [error, setError] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  // Format interval for display
  const formatInterval = (interval: string) => {
    switch (interval) {
      case "one_time":
        return "One-Time";
      case "monthly":
        return "Monthly";
      case "yearly":
        return "Yearly";
      default:
        return interval;
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products using API service
        const productsData = await api.getProducts();

        // Format the price for display and filter active products
        const formattedProducts = (productsData.results || [])
          .filter((product: Product) => product.active)
          .map((product: Product) => ({
            ...product,
            formatted_price: `$${(product.unit_amount / 100).toFixed(
              2
            )} ${product.currency.toUpperCase()} (${formatInterval(
              product.interval
            )})`,
          }));

        setProducts(formattedProducts);

        // If in direct checkout mode with a specific product ID, set it directly
        if (isDirectCheckout && productId) {
          setSelectedProductId(productId);
        }
        // Otherwise set default selection if available and no productId was provided
        else if (formattedProducts.length > 0 && !productId) {
          setSelectedProductId(formattedProducts[0].id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchData();
  }, [isDirectCheckout, productId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProductId) {
      setError("Please select a product");
      return;
    }

    setIsLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setIsLoading(false);
      return;
    }

    try {
      // Create a payment data object
      const paymentData = {
        name: name,
        email: email,
        website_url: website_url,
        company_address: company_address,
        company_phone: company_phone,
        plan: "custom",
        price_id: selectedProductId, // Now using product ID
      };

      // Create payment intent with custom product using the API service
      const paymentResponseData = await api.createPaymentIntent(paymentData);

      if (paymentResponseData.error) {
        setError(paymentResponseData.error);
        setIsLoading(false);
        return;
      }

      const clientSecret = paymentResponseData.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setIsPaymentCompleted(true);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Get selected product details
  const selectedProduct = selectedProductId
    ? products.find((product) => product.id === selectedProductId)
    : null;

  return (
    <div className="p-6">
      <Dialog>
        <DialogTitle className="text-xl font-bold mb-4">
          {isDirectCheckout ? "Complete Your Purchase" : "Custom Product Payment"}
        </DialogTitle>
        <DialogDescription className="mb-6">
          {isDirectCheckout
            ? "Complete your payment to get started."
            : "Select a product and complete your payment to get started."}
        </DialogDescription>

        {isPaymentCompleted ? (
          <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-4">
            <h3 className="text-green-800 font-semibold text-lg mb-2">
              Payment Successful!
            </h3>
            <p className="text-green-700">
              Thank you for your purchase. We've sent a confirmation email to{" "}
              {email} with your receipt and next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 p-4 rounded-md border border-red-200 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {!isDirectCheckout && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="product">Select Product</Label>
                  <Select
                    value={selectedProductId?.toString() || ""}
                    onValueChange={(value) => {
                      const productId = parseInt(value);
                      setSelectedProductId(productId);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem
                          key={product.id}
                          value={product.id.toString()}
                        >
                          {product.name} - {product.formatted_price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Show product info for both direct checkout and regular mode */}
            {selectedProduct && (
              <div className="bg-primary/5 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Selected Product:</span>
                  <span className="font-semibold">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Price:</span>
                  <span className="font-semibold">
                    {selectedProduct.formatted_price}
                  </span>
                </div>
                {selectedProduct.description && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="font-medium">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedProduct.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="card-element">Card Details</Label>
              <div className="p-3 border rounded-md">
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#32325d",
                        fontFamily: "Arial, sans-serif",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={
                !stripe ||
                isLoading ||
                (!isDirectCheckout && !selectedProductId)
              }
            >
              {isLoading ? (
                <p className="font-bold text-white">Processing...</p>
              ) : (
                "Complete Payment"
              )}
            </button>
          </form>
        )}

        <div className="mt-6">
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Terms and Conditions</h3>
              <p className="text-sm text-gray-600">
                By completing this payment, you agree to our Terms of Service
                and Privacy Policy. All payments are processed securely through
                Stripe. Your payment information is never stored on our servers.
              </p>
              <p className="text-sm text-gray-600">
                For subscription plans, you will be billed automatically
                according to the selected billing cycle. You can cancel your
                subscription at any time by contacting our support team.
              </p>
              <p className="text-sm text-gray-600">
                For one-time payments, you will not be charged again unless you
                make another purchase.
              </p>
              <p className="text-sm text-gray-600">
                If you have any questions about your payment or our services,
                please contact our support team.
              </p>
            </div>
          </ScrollArea>
        </div>
      </Dialog>
    </div>
  );
};

export default function CustomProductPaymentWrapper({
  name,
  email,
  website_url,
  company_address,
  company_phone,
}: formDataType) {
  return (
    <Elements stripe={stripePromise}>
      <CustomProductPayment
        name={name}
        email={email}
        website_url={website_url}
        company_address={company_address}
        company_phone={company_phone}
      />
    </Elements>
  );
}
