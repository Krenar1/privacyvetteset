
import { Container } from "./ui-components";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="hero"
      className="pt-32 pb-20 min-h-screen flex items-center relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10" />
      {/* <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10" /> */}
      
      <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-primary/5 -z-10 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full bg-primary/5 -z-10 animate-pulse-slow" style={{ animationDelay: "1s" }} />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 animate-slide-up">
            <div className="inline-block px-3 py-1 mb-6 text-sm font-semibold text-primary bg-primary/10 rounded-full">
              Global Privacy Compliance Solutions
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight text-balance">
              Simplifying Privacy Compliance for Website Owners
            </h1>
            <p className="text-lg mb-8 text-darkgray/80 max-w-xl">
              PrivacyVet empowers website owners with affordable, flexible, and reliable compliance solutions. Focus on your core business while we handle complex privacy regulations.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <a href="#services" className="btn-primary flex items-center">
                Explore Solutions
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a href="#contact" className="btn-secondary">
                Contact Us
              </a>
            </div>
            
            <div className="mt-12 flex items-center space-x-6">
              <div>
                <p className="text-3xl font-semibold text-primary">2M+</p>
                <p className="text-lightgray">Websites Protected</p>
              </div>
              <div className="h-10 w-px bg-lightgray/30"></div>
              <div>
                <p className="text-3xl font-semibold text-primary">99%</p>
                <p className="text-lightgray">Compliance Rate</p>
              </div>
              <div className="h-10 w-px bg-lightgray/30"></div>
              <div>
                <p className="text-3xl font-semibold text-primary">24/7</p>
                <p className="text-lightgray">Support</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 animate-scale-in">
            <div className="relative">
              <div className="glass p-8 rounded-2xl shadow-xl">
                <div className="w-12 h-12 mb-6 flex items-center justify-center bg-primary text-white rounded-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Simplified Compliance</h3>
                <p className="mb-6 text-darkgray/80">
                  Our solutions automatically adapt to the latest regulations worldwide, ensuring your website remains compliant with GDPR, CCPA, PIPEDA, and more.
                </p>
                <div className="space-y-3">
                  {["Automatic Policy Updates", "Multi-Language Support", "Customizable to Your Brand", "Real-time Regulation Monitoring"].map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-darkgray">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-xl -z-10" />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-primary/10 rounded-xl -z-10" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
