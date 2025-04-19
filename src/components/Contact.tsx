
import { useState } from "react";
import { Section, Container, SectionHeading } from "./ui-components";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";


export const socialNetworks = [
  // { name: "twitter", icon: <Twitter className="w-5 h-5" /> },
  { name: "facebook", icon: <Facebook className="w-5 h-5" /> },
  { name: "linkedin", icon: <Linkedin className="w-5 h-5"/> },
  { name: "instagram", icon: <Instagram className="w-5 h-5" /> },
];
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  
  const [formStatus, setFormStatus] = useState<null | "success" | "error">(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`https://api.privacyvet.com/contact-request/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus("success");
        // Reset form after submission
        setFormData({
          name: "",
          email: "",
          company: "",
          message: ""
        });

        // Clear success message after 5 seconds
        setTimeout(() => setFormStatus(null), 5000);
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Error submitting contact request:", error);
      setFormStatus("error");
    }
  };

  

  return (
    <Section id="contact" className="bg-white relative">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full z-1" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full z-1" />
      
      <Container>
        <SectionHeading 
          subtitle="Contact Us" 
          title="Get in Touch with Our Team"
          centered
        />
        
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 animate-slide-up">
              <h3 className="text-2xl font-semibold mb-6">Send Us a Message</h3>
              
              {formStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  Thank you for your message! We'll get back to you shortly.
                </div>
              )}
              
              {formStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  There was an error sending your message. Please try again.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-darkgray mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-darkgray mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-darkgray mb-1">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="Your Company"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-darkgray mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button type="submit" className="btn-primary w-full flex items-center justify-center">
                      Send Message
                      <Send size={18} className="ml-2" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="bg-primary text-white relative hidden lg:block">
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1488590528505-98d2b5aba04b')] bg-cover bg-center opacity-10"></div>
              </div>
              <div className="relative z-10 h-full flex flex-col justify-center p-12">
                <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Email Us</h4>
                      <p className="text-white font-medium">info@privacyvet.com</p>
                      <p className="text-white font-medium">support@privacyvet.com</p>
                    </div>
                  </div>
                  
                  {/* <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Call Us</h4>
                      <p className="text-white font-medium">+1 (555) 123-4567</p>
                      <p className="text-white font-medium">Mon-Fri, 9am-5pm EST</p>
                    </div>
                  </div> */}
                  
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Location</h4>
                      <p className="text-white font-medium">
                        2261 Market Street STE 86488<br />
                        CA 94114<br />
                        San Francisco
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12">
                  <h4 className="font-semibold mb-4 text-white">Follow Us</h4>
                  <div className="flex space-x-4">
                    {socialNetworks.map((social, index) => (
                      <a 
                        key={index}
                        // href=""
                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                      >
                        <span className="sr-only">{social.name}</span>
                        {social.icon}
                      </a>
                    ))}
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

export default Contact;
