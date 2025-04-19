import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const PrivacyGuide = () => {
  return (
    <>
    <Header />
    <section
      id="privacy-guide"
      className="pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
      >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" />
      
      <Container>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
            Privacy Guide
          </h1>
          <p className="text-lg text-darkgray/80 mb-6">
            Understanding privacy laws and compliance is essential for businesses in today's digital world. This guide will provide you with everything you need to know about GDPR, CCPA, and best practices for safeguarding user data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Why Privacy Compliance Matters</h3>
            <p className="mb-6 text-darkgray/80">
              Privacy compliance is not just about legal obligations—it's about building trust with your users. Protecting personal data helps prevent security breaches, legal penalties, and reputational damage.
            </p>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">GDPR (General Data Protection Regulation):</strong> Applies to businesses handling data of EU citizens, requiring clear consent and strong security measures.</li>
              <li className="text-gray-500"><strong className="text-primary">CCPA (California Consumer Privacy Act):</strong> Gives California residents rights over their personal data, including access, deletion, and opt-out options.</li>
              <li className="text-gray-500"><strong className="text-primary">Best Practices:</strong> Implement transparent privacy policies, secure data storage, and minimize data collection.</li>
            </ul>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Steps to Stay Compliant</h3>
            <p className="mb-6 text-darkgray/80">
              Ensuring compliance requires ongoing efforts. Follow these key steps to stay aligned with regulations:
            </p>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Create a Privacy Policy:</strong> Clearly outline how user data is collected, stored, and used.</li>
              <li className="text-gray-500"><strong className="text-primary">Get User Consent:</strong> Ensure that users actively agree to data collection and provide options to revoke consent.</li>
              <li className="text-gray-500"><strong className="text-primary">Secure Data Storage:</strong> Use encryption, firewalls, and access controls to prevent unauthorized access.</li>
              <li className="text-gray-500"><strong className="text-primary">Stay Updated:</strong> Privacy laws evolve, so review and update policies regularly to maintain compliance.</li>
            </ul>
          </div>
        </div>
      </Container>
      
    </section>
    <Footer />
        </>
  );
};

export default PrivacyGuide;
