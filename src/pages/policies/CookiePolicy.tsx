import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const CookiePolicy = () => {
  return (
    <>
    <Header />
      <section
        id="cookie-policy"
        className="pt-24 pb-16 min-h-screen flex flex-col justify-center relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-primary/5 rounded-br-full -z-10" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/4 bg-primary/5 rounded-tl-full -z-10" />

        <Container>
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
              Cookie Policy
            </h1>
            <p className="text-lg text-darkgray/80 mb-6">
              This Cookie Policy explains how we use cookies and similar tracking technologies to enhance your experience on our website. We are committed to transparency regarding how cookies are used and how you can manage them in compliance with GDPR, CCPA, PIPEDA, LGPD, POPIA, ePrivacy, and other applicable data protection regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
            <div className="glass p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-primary">What Are Cookies?</h3>
              <ul className="space-y-3">
                <li className="text-darkgray">
                  <strong className="text-primary">Types of Cookies:</strong> Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve functionality.
                </li>
                <li className="text-darkgray">
                  <strong className="text-primary">How We Use Cookies:</strong> We use cookies to provide a personalized experience, analyze website traffic, enable essential website functionalities, and comply with legal obligations.
                </li>
                <li className="text-darkgray">
                  <strong className="text-primary">Managing Cookie Preferences:</strong> You can adjust your browser settings to accept, reject, or delete cookies at any time. However, disabling cookies may impact certain website functionalities.
                </li>
              </ul>
            </div>

            <div className="glass p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Your Choices</h3>
              <ul className="space-y-3">
                <li className="text-darkgray">
                  <strong className="text-primary">Accepting or Rejecting Cookies:</strong> You can manage your cookie preferences through your browser settings or our website’s cookie consent tool.
                </li>
                <li className="text-darkgray">
                  <strong className="text-primary">Third-Party Cookies:</strong> Some cookies are placed by third-party services we use for analytics, advertising, or social media integrations. We ensure these services comply with relevant data protection regulations.
                </li>
                <li className="text-darkgray">
                  <strong className="text-primary">Updating Your Preferences:</strong> You can review and update your cookie settings at any time to align with your privacy preferences.
                </li>
                <li className="text-darkgray">
                  <strong className="text-primary">Data Retention:</strong> Cookies are retained for a period necessary to fulfill their purposes, and data collected through cookies is processed in accordance with our privacy policies.
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 animate-fade-in">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Compliance and Updates</h3>
            <p className="text-lg text-darkgray/80 mb-6">
              We regularly review and update our cookie practices to ensure compliance with international data protection regulations. Changes to this Cookie Policy will be communicated clearly, and users are encouraged to review the policy periodically.
            </p>
            <p className="text-lg text-darkgray/80">
              For more information about how we use cookies or to make specific requests, please contact our data protection officer. Your rights regarding personal data are respected and protected.
            </p>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default CookiePolicy;