import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Container } from "@/components/ui-components";

const PartnerProgram = () => {
  return (
    <>
    <Header />
    <section
      id="partner-program"
      className="pt-32 pb-20 min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" />
      
      <Container>
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-primary">
            Partner Program
          </h1>
          <p className="text-lg text-darkgray/80 mb-6">
            Join our Partner Program and gain exclusive benefits, resources, and revenue opportunities while helping businesses stay compliant with privacy regulations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 animate-slide-up">
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Why Partner with Us?</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Exclusive Revenue Opportunities:</strong> Earn commissions and recurring revenue by referring businesses to our platform.</li>
              <li className="text-gray-500"><strong className="text-primary">Dedicated Partner Support:</strong> Gain access to a team of experts who provide guidance and assistance for seamless collaboration.</li>
              <li className="text-gray-500"><strong className="text-primary">Marketing & Sales Resources:</strong> Utilize co-branded materials, sales tools, and educational content to drive customer engagement.</li>
            </ul>
          </div>
          
          <div className="glass p-8 rounded-2xl shadow-xl text-left">
            <h3 className="text-2xl font-semibold mb-4 text-primary">Program Benefits</h3>
            <ul className="space-y-3">
              <li className="text-gray-500"><strong className="text-primary">Co-Branding Opportunities:</strong> Build credibility and expand your brand through strategic partnerships.</li>
              <li className="text-gray-500"><strong className="text-primary">Early Access to New Features:</strong> Stay ahead with exclusive previews of our latest compliance solutions.</li>
              <li className="text-gray-500"><strong className="text-primary">Flexible Engagement Models:</strong> Choose from different partnership levels that best suit your business goals.</li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
     <Footer />
     </>
  );
};

export default PartnerProgram;