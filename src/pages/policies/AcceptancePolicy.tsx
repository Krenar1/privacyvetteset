import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const AcceptancePolicy = () => {
  return (
    <>
    <Header />
      <section
        id="acceptance-policy"
        className="pt-24 pb-16 min-h-screen flex flex-col justify-center relative overflow-hidden"
      >
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/4 bg-primary/5 rounded-tr-full -z-10" />

        <Container>
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
              Acceptance Policy
            </h1>
            <p className="text-lg text-darkgray/80 mb-6">
              This Acceptance Policy outlines the conditions and guidelines that users must adhere to when using our platform. By accessing and using our services, you agree to comply with the rules and regulations set forth to ensure a safe, respectful, and legally compliant environment for all users.
            </p>
            <p className="text-lg text-darkgray/80 mb-6">
              Our policies are designed to protect user rights, prevent abuse, and maintain ethical standards within our platform. We reserve the right to modify these policies as needed to ensure compliance with industry standards and legal requirements, including but not limited to GDPR, CCPA, PIPEDA, LGPD, POPIA, ePrivacy, COPPA, PECR, CalOPPA, and VCDPA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
            <div className="glass p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-primary">User Conduct</h3>
              <ul className="space-y-3">
                {["Respectful Communication", "Prohibited Content", "Fair Use Policy", "Data Protection Compliance", "Age-Appropriate Interactions"].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-darkgray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-primary">Enforcement</h3>
              <ul className="space-y-3">
                {["Policy Violations", "Account Suspension", "Reporting Issues", "Data Breach Notification", "Appeals Process"].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-darkgray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 animate-fade-in">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Compliance and Updates</h3>
            <p className="text-lg text-darkgray/80 mb-6">
              We are committed to ensuring compliance with global data protection regulations, including GDPR, CCPA, and others. Users are encouraged to regularly review our policies, as updates may be implemented to reflect changes in legal requirements and industry standards. Non-compliance with updated policies may result in restricted access or account termination.
            </p>
            <p className="text-lg text-darkgray/80">
              If you have any questions regarding our acceptance policy or wish to report concerns, please contact our compliance team. Your engagement ensures a transparent and secure platform for all.
            </p>
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
};

export default AcceptancePolicy;
