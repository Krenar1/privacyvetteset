import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const FAQs = () => {
  return (
    <>
    <Header />
    <section
      id="faqs"
      className="pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" />
      
      <Container>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-darkgray/80 mb-6">
            Here are some of the most common questions about privacy policies, compliance, and data protection.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">General Privacy Questions</h3>
            <ul className="space-y-4">
              <li className="text-gray-500"><strong className="text-primary">What is GDPR and does it apply to my business?</strong> GDPR (General Data Protection Regulation) applies to any business handling the personal data of EU citizens, requiring strict data protection measures and user consent.</li>
              <li className="text-gray-500"><strong className="text-primary">How does CCPA impact my website?</strong> CCPA (California Consumer Privacy Act) gives California residents rights over their personal data, requiring businesses to provide opt-out options and clear privacy policies.</li>
              <li className="text-gray-500"><strong className="text-primary">Do I need a cookie consent banner?</strong> Yes, regulations like GDPR require explicit user consent before placing cookies that track personal information.</li>
            </ul>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Compliance & Legal</h3>
            <ul className="space-y-4">
              <li className="text-gray-500"><strong className="text-primary">What happens if I don't comply with privacy laws?</strong> Non-compliance can lead to heavy fines, legal actions, and reputational damage. Staying compliant ensures your business avoids these risks.</li>
              <li className="text-gray-500"><strong className="text-primary">How can PrivacyVet help me stay compliant?</strong> PrivacyVet provides automated solutions for privacy compliance, including real-time policy updates, consent management, and compliance reports tailored to your business needs.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
     <Footer />
     </>
  );
};

export default FAQs;