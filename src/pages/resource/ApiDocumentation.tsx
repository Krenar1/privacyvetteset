import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const APIDocumentation = () => {
  return (
    <>
    <Header />
    <section
      id="api-documentation"
      className="pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" />
      
      <Container>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
            API Documentation
          </h1>
          <p className="text-lg text-darkgray/80 mb-6">
            API will be released soon! Integrate seamlessly with our API to automate compliance processes, handle user data requests, and stay up to date with privacy regulations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Getting Started</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Authentication & API Keys:</strong> Secure access using API keys and OAuth authentication.</li>
              <li className="text-gray-500"><strong className="text-primary">Making Requests:</strong> Use our RESTful endpoints to retrieve, update, and delete compliance-related data.</li>
              <li className="text-gray-500"><strong className="text-primary">Error Handling:</strong> Receive detailed responses and status codes for efficient debugging.</li>
            </ul>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Key Features</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">User Data Requests:</strong> Handle GDPR and CCPA user data requests efficiently.</li>
              <li className="text-gray-500"><strong className="text-primary">Compliance Reports:</strong> Generate reports to track compliance progress.</li>
              <li className="text-gray-500"><strong className="text-primary">Policy Updates:</strong> Automate policy updates and sync with regulatory changes.</li>
              <li className="text-gray-500"><strong className="text-primary">Webhook Integration:</strong> Receive real-time notifications for compliance actions.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
     <Footer />
     </>
  );
};

export default APIDocumentation;
