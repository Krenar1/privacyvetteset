
import { Section, Container, SectionHeading, FeatureCard } from "./ui-components";
import { ShieldIcon, LockIcon, GlobeIcon, DatabaseIcon } from "./ui-components";

const Services = () => {
  const services = [
    {
      icon: <ShieldIcon />,
      title: "Privacy Policy Generator",
      description: "Generate customized, legally compliant privacy policies tailored to your website's specific needs and jurisdictions."
    },
    {
      icon: <LockIcon />,
      title: "Cookie Consent Manager",
      description: "Implement a GDPR & CCPA compliant cookie consent solution with customizable banners and automatic cookie scanning."
    },
    {
      icon: <GlobeIcon />,
      title: "Multi-Jurisdiction Compliance",
      description: "Stay compliant with privacy regulations worldwide including GDPR, CCPA, PIPEDA, and other regional requirements."
    },
    {
      icon: <DatabaseIcon />,
      title: "Data Processing Agreements",
      description: "Access and manage data processing agreements with customizable templates for your service providers."
    }
  ];

  return (
    <Section id="services" className="bg-white relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full z-1" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full z-1" />
      
      <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-primary/5 z-1 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full bg-primary/5 z-1 animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <Container>
        <SectionHeading 
          subtitle="Our Services" 
          title="Comprehensive Privacy Solutions for Your Website"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="animate-fade-in h-full flex" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FeatureCard 
                icon={service.icon}
                title={service.title}
                description={service.description}
                className="flex flex-col h-full"
              />
            </div>
          ))}
        </div>

        
        <div className="mt-24">
          <div className="glass overflow-hidden rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12">
                <SectionHeading 
                  subtitle="How It Works" 
                  title="Simple Process, Powerful Protection"
                />
                
                <div className="space-y-8">
                  {[
                    {
                      number: "01",
                      title: "Answer Simple Questions",
                      description: "Tell us about your website, what data you collect, and where your users are located."
                    },
                    {
                      number: "02",
                      title: "Review Generated Policies",
                      description: "We generate customized policies based on your answers and applicable regulations."
                    },
                    {
                      number: "03",
                      title: "Implement on Your Website",
                      description: "Add your policies to your website with our easy integration options or simple copy/paste."
                    },
                    {
                      number: "04",
                      title: "Stay Updated Automatically",
                      description: "Your policies automatically update when regulations change, keeping you compliant."
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {step.number}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                        <p className="text-darkgray/80">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <a href="#contact" className="btn-primary">
                    Get Started Today
                  </a>
                </div>
              </div>
              
              <div className="bg-primary relative hidden lg:block">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')] bg-cover bg-center opacity-20"></div>
                </div>
                <div className="relative z-10 h-full flex items-center justify-center p-12">
                  <div className="text-white text-center">
                    <h3 className="text-3xl font-semibold mb-4 text-white">Ready for Peace of Mind?</h3>
                    <p className="text-white font-medium mb-8 max-w-md mx-auto">
                      Join thousands of website owners who trust PrivacyVet to handle their compliance needs.
                    </p>
                    <div className="flex justify-center space-x-4">
                      {[
                        { number: "2M+", label: "Websites" },
                        { number: "150+", label: "Countries" },
                        { number: "99%", label: "Compliance" }
                      ].map((stat, index) => (
                        <div key={index} className="text-center">
                          <p className="text-3xl font-bold text-white">{stat.number}</p>
                          <p className="text-sm text-white font-medium">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Services;
