import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const TermsOfService = () => {
  return (
    <>
    <Header />
      <section
        id="terms-of-service"
        className="pt-24 pb-16 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-primary/5 rounded-br-full -z-10" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/4 bg-primary/5 rounded-tl-full -z-10" />

        <Container>
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
              Terms of Service
            </h1>
            <p className="text-lg text-darkgray/80 mb-6">
              By using our services, you agree to the following terms and conditions. Please read them carefully before proceeding.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 mt-10 animate-slide-up">
            <div className="glass p-8 rounded-2xl shadow-xl text-left">
              <h3 className="text-2xl font-semibold mb-4 text-primary">1. User Responsibilities</h3>
              <p className="text-darkgray mb-4">
                Users must provide accurate and complete information when creating an account and keep their account details secure. Users agree to comply with all applicable laws and regulations.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">2. Data Privacy & Security</h3>
              <p className="text-darkgray mb-4">
                We process your personal data in accordance with GDPR, CCPA, PIPEDA, LGPD, POPIA, ePrivacy, COPPA, PECR, CalOPPA, and VCDPA. Our <a href="/privacypolicy" className="text-primary underline">Privacy Policy</a> provides detailed information about how your data is collected, used, and protected. By using our services, you agree to comply with our Privacy Policy, which is an integral part of these Terms of Service.
                We may collect personal data to provide our services, including specific types of data we collect. You have rights under applicable laws to access, correct, or request deletion of your personal data.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">3. User Rights</h3>
              <p className="text-darkgray mb-4">
                You have the right to access, correct, or request the deletion of your personal data, as well as to withdraw your consent to our processing of your personal data where applicable. You may also have the right to object to or restrict processing in certain circumstances. For more details, please refer to our <a href="/privacypolicy" className="text-primary underline">Privacy Policy</a>.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">4. Children’s Privacy</h3>
              <p className="text-darkgray mb-4">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal data from children under the age of 13. If we learn that we have inadvertently collected personal data from a child under 13, we will take steps to delete that information as soon as possible.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">5. Cookies and Tracking Technologies</h3>
              <p className="text-darkgray mb-4">
                Our website uses cookies and similar tracking technologies to enhance the user experience. By using our website, you consent to our use of cookies as described in our <a href="/cookiepolicy" className="text-primary underline">Cookie Policy</a>. You can manage cookie preferences through your browser settings.
              </p>

              <h3 className="text-2xl font-semibold mb-4 text-primary">6. International Data Transfers</h3>
              <p className="text-darkgray mb-4">
                We may transfer your personal data to countries outside your country of residence, including to countries that may not have the same data protection laws as your country. By using our services, you consent to the transfer of your personal data in accordance with our <a href="/privacypolicy" className="text-primary underline">Privacy Policy</a>.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">7. Compliance with Privacy Laws</h3>
              <p className="text-darkgray mb-4">
                Our services are designed to comply with the data privacy laws applicable in your jurisdiction, including GDPR, CCPA, PIPEDA, LGPD, POPIA, ePrivacy, COPPA, PECR, CalOPPA, and VCDPA. If you have any questions or concerns regarding our compliance with these laws, please contact us.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">8. User Compliance</h3>
              <p className="text-darkgray mb-4">
                As a user of our services, you agree to comply with all applicable data protection laws, including GDPR, CCPA, PIPEDA, LGPD, POPIA, ePrivacy, COPPA, PECR, CalOPPA, and VCDPA, in connection with your use of our services. You also agree to ensure that any personal data you provide to us, or that we process on your behalf, is compliant with these laws.
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">9. Refund and Cancellations</h3>
              <p className="text-darkgray mb-4">
              For cancellations, please refer to our <a href="/refundpolicy" className="text-primary ">Refund Policy</a>.
                You may request a refund within 3 days of purchase, subject to our refund policy. 
              </p>
              <h3 className="text-2xl font-semibold mb-4 text-primary">10. Privacy Policy Implementation & Liability Disclaimer</h3>
              <p className="text-darkgray mb-4">
              Client acknowledges that we will provide a recommended Privacy Policy for use in connection with the purchased data records. It is the sole responsibility of the Client to properly implement, maintain, and comply with this Privacy Policy in accordance with applicable laws and regulations.
              We make no representations or warranties regarding the legal sufficiency, completeness, or enforceability of the Privacy Policy in the Client’s specific use case. Additionally, any modifications or deviations made by the Client from the provided Privacy Policy are solely at their own risk.
              The Client agrees that we shall not be liable for any claims, damages, liabilities, fines, or legal actions arising from the Client’s failure to implement the Privacy Policy, failure to comply with relevant laws, or any alterations made to the provided policy. The Client assumes full responsibility for ensuring that their data usage, storage, and privacy practices remain in compliance with all applicable legal and regulatory requirements.
              </p>
            </div>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default TermsOfService;