import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const SupportCenter = () => {
  return (
    <>
    <Header />
    <section
      id="support-center"
      className="pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" />
      
      <Container>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
            Support Center
          </h1>
          <p className="text-lg text-darkgray/80 mb-6">
            Need help? Our support center provides solutions for privacy policies, compliance tools, and technical assistance. Find answers to your questions and troubleshoot issues easily.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Common Support Topics</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Privacy Policy Assistance:</strong> Learn how to create, update, and manage your privacy policy in compliance with regulations.</li>
              <li className="text-gray-500"><strong className="text-primary">Technical Support:</strong> Get help with troubleshooting errors, integration issues, and optimizing platform performance.</li>
              <li className="text-gray-500"><strong className="text-primary">Billing & Subscriptions:</strong> Understand pricing, manage your subscription, and resolve payment-related issues.</li>
            </ul>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Additional Assistance</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Compliance Best Practices:</strong> Ensure your website stays compliant with industry regulations and best practices.</li>
              <li className="text-gray-500"><strong className="text-primary">Integration Help:</strong> Learn how to integrate our compliance solutions with your existing platforms and services.</li>
              <li className="text-gray-500"><strong className="text-primary">Ongoing Support:</strong> Our team is available to assist with any questions or concerns related to privacy compliance.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
    <Footer />
    </>
  );
};

export default SupportCenter;
