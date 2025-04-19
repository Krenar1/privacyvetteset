import { ReactNode, useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import STRIPE_CONFIG from '../../config/stripe';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Log the Stripe publishable key to verify it's loaded correctly
console.log('Stripe publishable key:', STRIPE_CONFIG.publishableKey.substring(0, 10) + '...');

interface StripeProviderProps {
  clientSecret: string;
  children: ReactNode;
}

/**
 * A provider component that wraps Stripe Elements.
 * This should be used at a higher level in the component tree.
 */
const StripeProvider = ({ clientSecret, children }: StripeProviderProps) => {
  const [loading, setLoading] = useState(true);

  // Log when the component mounts and the client secret
  useEffect(() => {
    console.log('StripeProvider mounted with client secret:', clientSecret ? clientSecret.substring(0, 10) + '...' : 'none');

    // Set a short timeout to allow the component to render
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSecret]);

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
        borderRadius: '8px',
      },
    },
  };

  console.log('Initializing Elements with options:', {
    clientSecret: clientSecret ? clientSecret.substring(0, 10) + '...' : 'none',
    appearance: options.appearance.theme
  });

  if (!clientSecret) {
    console.error('No client secret provided to StripeProvider');
    return <div>Error: No payment session found. Please try again.</div>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Initializing payment form...</span>
        </div>
      ) : (
        children
      )}
    </Elements>
  );
};

export default StripeProvider;
