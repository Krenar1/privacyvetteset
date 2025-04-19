import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const ComplianceChecklist = () => {
  return (
    <>
    <Header />
    <section
      id="compliance-checklist"
      className="pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" />
      
      <Container>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
            Compliance Checklist
          </h1>
          <p className="text-lg text-darkgray/80 mb-6">
            Ensuring compliance with data privacy laws like GDPR and CCPA is crucial for protecting user information and avoiding legal penalties. This checklist will guide you through key requirements to make your website privacy-compliant.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Key Compliance Steps</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">GDPR Compliance:</strong> Obtain user consent before collecting personal data, provide opt-out options, and ensure transparency in data processing.</li>
              <li className="text-gray-500"><strong className="text-primary">CCPA Requirements:</strong> Allow California users to request access to or deletion of their data and offer a clear opt-out mechanism for data sharing.</li>
              <li className="text-gray-500"><strong className="text-primary">Cookie Policy:</strong> Implement a clear cookie consent banner that allows users to manage their tracking preferences.</li>
            </ul>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Best Practices for Data Protection</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Secure Data Storage:</strong> Encrypt sensitive user data and implement access controls to prevent unauthorized breaches.</li>
              <li className="text-gray-500"><strong className="text-primary">User Consent:</strong> Always ask for explicit user consent before collecting personal information and provide an easy way to revoke consent.</li>
              <li className="text-gray-500"><strong className="text-primary">Regular Compliance Audits:</strong> Periodically review your privacy policies, security measures, and data handling practices to stay up to date with regulations.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
     <Footer />
     </>
  );
};

export default ComplianceChecklist;
