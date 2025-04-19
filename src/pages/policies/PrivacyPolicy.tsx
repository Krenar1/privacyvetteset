import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const PrivacyPolicy = () => {
  return (
    <>
    <Header />
      <section
        id="privacy-policy"
        className="pt-24 pb-16 min-h-screen flex flex-col justify-center relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary/5 rounded-tr-full -z-10" />

        <Container>
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary pb-4">
              Privacy Policy
            </h1>
          </div>

          <div className="space-y-8 text-left animate-slide-up">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">1. Introduction</h2>
              <p>
                PrivacyVet is committed to protecting the privacy of our users, particularly those interacting with our eCommerce services. This Privacy Policy outlines how we collect, use, store, and protect your personal data in compliance with global privacy regulations.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">2. Data We Collect</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>Personal Information: Name, email, phone number, address, and other identifiers.</li>
                <li>Account Information: Usernames, passwords, and security questions.</li>
                <li>Order & Transaction Data: Purchase history, payment details (secured and encrypted), and shipping information.</li>
                <li>Device & Technical Data: IP address, browser type, operating system, device ID, and location data.</li>
                <li>Usage Data: Pages visited, interaction logs, product preferences, and browsing behavior.</li>
                <li>Children’s Data: Collected in compliance with COPPA with parental consent.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">3. How We Use Your Data</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>Processing and fulfilling orders, including payment and shipping.</li>
                <li>Managing user accounts and providing customer support.</li>
                <li>Enhancing and optimizing our eCommerce platform.</li>
                <li>Sending updates, promotional offers, and newsletters (with consent).</li>
                <li>Ensuring security, detecting fraud, and enforcing our terms of service.</li>
                <li>Compliance with legal obligations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">4. Legal Basis for Processing</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-500">
                <li>Consent: When you provide explicit consent.</li>
                <li>Contractual Obligation: For fulfilling purchase orders.</li>
                <li>Legal Compliance: When required by law.</li>
                <li>Legitimate Interests: To enhance user experience and security.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">5. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have rights including access, correction, deletion, restriction, and objection to data processing. Contact us at [Insert Contact Information] to exercise these rights.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">6. Data Sharing & Third Parties</h2>
              <p>We may share data with payment processors, shipping providers, service providers, regulatory authorities, and marketing partners (with consent where applicable).</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">7. Data Retention</h2>
              <p>We retain personal data for as long as necessary for the purposes outlined in this policy.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">8. Security Measures</h2>
              <p>We implement industry-standard security measures to protect your data, including encryption and secure storage.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">9. Cross-Border Data Transfers</h2>
              <p>We ensure cross-border data transfers comply with relevant regulations using Standard Contractual Clauses or by obtaining your consent.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">10. Cookies & Tracking Technologies</h2>
              <p>We use cookies for analytics and personalization. Manage your preferences via our <a href="/cookiepolicy" className="text-primary underline">Cookie Policy</a> page.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">11. Children's Privacy (COPPA)</h2>
              <p>We obtain parental consent before collecting data from children under 13.</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">12. Updates to This Policy</h2>
              <p>We may update this policy periodically. Changes will be posted with an updated "Effective Date."</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-primary">13. Contact Us</h2>
              <p>PrivacyVet, 2261 Market Street STE 86488, San Francisco, CA 94114,  info@privacyvet.com </p>
            </div>

            <div className="mt-8  text-gray-600">
              <p>By using our services, you also agree to our <a href="/termsofservice" className="text-primary underline">Terms and Conditions</a> and <a href="/cookiepolicy" className="text-primary underline">Cookie Policy</a>.</p>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
