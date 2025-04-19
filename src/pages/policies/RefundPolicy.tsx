import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const RefundPolicy = () => {
  return (
    <>
    <Header />
      <section
        id="refund-policy"
        className="pt-24 pb-16 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-primary/5 rounded-br-full -z-10" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/4 bg-primary/5 rounded-tl-full -z-10" />

        <Container>
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
              Refund Policy
            </h1>
            <p className="text-lg text-darkgray/80 mb-6">
              We want you to be completely satisfied with your purchase. If you're not fully satisfied, please review our refund policy below to understand your options.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-10 animate-slide-up">
            <div className="glass p-8 rounded-2xl shadow-xl text-left">
              <h3 className="text-2xl font-semibold mb-4 text-primary">1. Eligibility for Refunds</h3>
              <p className="text-darkgray mb-4">
                We offer a refund within 3 days of your purchase for our services. To be eligible for a refund, you must request it within this period and provide proof of purchase.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">2. Refund Request Process</h3>
              <p className="text-darkgray mb-4">
                To request a refund, please contact our support team at support@privacyvet.com. Include your order number and the reason for the refund request. We will review your request and notify you of the approval or rejection of your refund.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">3. Refund Criteria</h3>
              <p className="text-darkgray mb-4">
                Refunds may be granted under the following conditions:
                <ul className="list-disc pl-8 mt-2 mb-2">
                  <li>Defective product or service</li>
                  <li>Failure to provide the agreed-upon features</li>
                  <li>Unauthorized charge or billing issues</li>
                </ul>
                Refunds will not be issued for:
                <ul className="list-disc pl-8 mt-2">
                  <li>Change of mind</li>
                  <li>Usage of the product or service beyond a reasonable trial period</li>
                </ul>
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">4. Refund Method</h3>
              <p className="text-darkgray mb-4">
                If your refund request is approved, refunds will be processed via the original payment method. Depending on your bank or card issuer, it may take several business days for the refund to be reflected in your account.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">5. Exceptions and Non-Refundable Items</h3>
              <p className="text-darkgray mb-4">
                Certain services and products may not be eligible for a refund, including but not limited to:
                <ul className="list-disc pl-8 mt-2">
                  <li>Digital downloads that have been accessed or downloaded</li>
                  <li>Services that have already been rendered or completed</li>
                </ul>
                Please refer to the specific terms for each product or service for more details.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">6. Compliance with Privacy Regulations</h3>
              <p className="text-darkgray mb-4">
                We process your personal data in accordance with applicable data privacy laws, including GDPR, CCPA, PIPEDA, LGPD, POPIA, ePrivacy, COPPA, PECR, CalOPPA, and VCDPA. For more details on how your personal data is handled, please refer to our <a href="/privacypolicy" className="text-primary underline">Privacy Policy</a>.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">7. Changes to the Refund Policy</h3>
              <p className="text-darkgray mb-4">
                We reserve the right to update or change our refund policy at any time. Any changes will be posted on this page, and the effective date will be updated accordingly. We encourage you to review this policy periodically to stay informed.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default RefundPolicy;
