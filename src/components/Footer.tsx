import { socialNetworks } from "./Contact";
import { ShieldIcon } from "./ui-components";
import { Link } from "react-router-dom"; // Import React Router Link
import { HashLink } from 'react-router-hash-link';

const Footer = () => {
  const navLinks = [
    { name: "Home", link: "/#hero" },
    { name: "Penalties", link: "/#penalties" },
    { name: "Services", link: "/#services" },
    { name: "Protection", link: "/#protection" },
    { name: "Book a Demo", link: "/#book-a-demo" },
    { name: "Plans", link: "/plans" },
    { name: "About Us", link: "/#about" },
    { name: "Contact Us", link: "/#contact" },
  ];
  
  // Function to scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <footer className="bg-darkgray text-white pt-16 pb-8">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-md mr-2">
                <ShieldIcon className="text-white" />
              </div>
              <span className="text-xl font-semibold">PrivacyVet</span>
            </div>
            <p className="text-white/70 mb-4">
              Empowering website owners with affordable, flexible, and reliable compliance solutions.
            </p>
            <div className="flex space-x-4">
              {socialNetworks.map((social, index) => (
                <a 
                  key={index}
                  // href="#"
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
          
          <div className="opacity-[0.5] select-none">
            <h3 className="text-lg font-semibold mb-4 text-white">Solutions</h3>
            <ul className="space-y-2">
              {["Privacy Policy Generator", "Cookie Consent Manager", "GDPR Compliance", "CCPA Compliance", "Data Processing Agreements"].map((item, index) => (
                <li key={index}>
                  <a className="text-white/70 transition-colors ">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              {navLinks.map((item, index) => (
                <li key={index}>
                  <HashLink 
                    smooth 
                    to={item.link} 
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              {[
                { name: "Privacy Guide", link: "/privacyguide" },
                { name: "Compliance Checklist", link: "/compliancechecklist" },
                { name: "FAQs", link: "/faqs" },
                { name: "API Documentation", link: "/apidocumentation" },
                { name: "Support Center", link: "/supportcenter" },
                { name: "Partner Program", link: "/partnerprogram" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    onClick={scrollToTop}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} PrivacyVet. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {[
                { name: "Terms of Service", link: "/termsofservice" },
                { name: "Privacy Policy", link: "/privacypolicy" },
                { name: "Cookie Policy", link: "/cookiepolicy" },
                { name: "Acceptable Use Policy", link: "/acceptancepolicy" }
              ].map((item, index) => (
                <li key={index} className="list-none">
                  <Link 
                    to={item.link} 
                    onClick={scrollToTop}
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
