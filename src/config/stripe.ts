/**
 * Stripe configuration
 *
 * This file contains the configuration for Stripe integration.
 * The publishable key is used for the frontend, while the secret key is used for the backend.
 *
 * For local development, use the test keys.
 * For production, use the live keys.
 */

const STRIPE_CONFIG = {
  publishableKey: "pk_test_51MZVgHIONmcbWtEsz1tP5Rg3PI7AFNyDlzL4pZOSIuzW6hwrOhmMo98X5RXdMlEAqzcDo3fB19IC4NEeVq22bsxw00RLjSBVUD"
};

export default STRIPE_CONFIG;
