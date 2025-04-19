import React, { createContext, useContext, ReactNode } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import STRIPE_CONFIG from '../../config/stripe';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

// Create context types
interface PaymentContextType {
  stripe: Promise<Stripe | null>;
  config: typeof STRIPE_CONFIG;
}

// Create the context
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// Provider component
interface PaymentProviderProps {
  children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const value = {
    stripe: stripePromise,
    config: STRIPE_CONFIG,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Hook to use the payment context
export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
