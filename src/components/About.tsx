
import { Section, Container, SectionHeading, ValueItem, TestimonialCard } from "./ui-components";

const About = () => {
  const values = [
    {
      title: "Reliability",
      description: "We are honest, hardworking people that can be counted on. All of our compliance solutions are of professional quality, made to withstand the rigors of regulatory scrutiny."
    },
    {
      title: "Flexibility",
      description: "We're adaptable and can adjust to changing regulations and circumstances. We believe that your business shouldn't be limited by compliance concerns."
    },
    {
      title: "Inclusivity",
      description: "Nothing should stand between you and global operations. We believe in empowering everyone with great compliance products that help websites of all sizes."
    }
  ];

  const testimonials = [
    {
      quote: "PrivacyVet has completely transformed how we handle privacy compliance. Their solution is intuitive, thorough, and constantly updated.",
      author: "Sarah Johnson",
      company: "Tech Innovators Inc."
    },
    {
      quote: "As a small business owner, I was overwhelmed by privacy regulations. PrivacyVet made compliance simple and affordable.",
      author: "Michael Chen",
      company: "Global Retail Solutions"
    },
    {
      quote: "The automatic updates to our privacy policy whenever regulations change has saved us countless hours of legal consultation.",
      author: "Emma Rodriguez",
      company: "Health Services Platform"
    }
  ];

  return (
    <Section id="about" className="relative">
      
      <div className="absolute top-[20%] left-[15%] w-64 h-64 rounded-full bg-primary/5 z-1 animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 rounded-full bg-primary/5 z-1 animate-pulse-slow" style={{ animationDelay: "1s" }} />
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading 
              subtitle="About Us" 
              title="Empowering Website Owners with Simple Compliance Solutions"
            />
            
            <p className="text-lg mb-8 text-darkgray/80">
              PrivacyVet was founded with a clear mission: to simplify privacy compliance for website owners worldwide. We understand the challenges of navigating complex international regulations, which is why we've built intuitive tools that make compliance accessible to everyone.
            </p>
            
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-darkgray/80">
                PrivacyVet's mission is to empower website owners with affordable, flexible, and reliable compliance solutions. By building innovative tools that assist users in maintaining proper privacy policies and regulatory compliance, we seek to bring peace of mind to website owners everywhere.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-4">Our Values</h3>
              <div className="space-y-6">
                {values.map((value, index) => (
                  <ValueItem 
                    key={index}
                    title={value.title}
                    description={value.description}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute top-1/4 -left-4 w-64 h-64 bg-primary/5 rounded-full -z-10 animate-pulse-slow" />
            
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in" 
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <TestimonialCard 
                    quote={testimonial.quote}
                    author={testimonial.author}
                    company={testimonial.company}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-24">
          <div className="glass rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-semibold mb-6">Our Compliance Solutions Cover</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center max-w-4xl mx-auto">
              {[
                "GDPR", "CCPA", "PIPEDA", "LGPD", "POPIA", 
                "ePrivacy", "COPPA", "PECR", "CalOPPA", "VCDPA"
              ].map((regulation, index) => (
                <div 
                  key={index} 
                  className="bg-white/50 p-3 rounded-lg shadow-sm border border-primary/10 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="font-semibold text-primary">{regulation}</span>
                </div>
              ))}
            </div>
            <p className="mt-8 text-darkgray/80 max-w-2xl mx-auto">
              Our solutions automatically adapt to the latest regulatory changes, ensuring your website remains compliant with evolving privacy laws worldwide.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default About;
