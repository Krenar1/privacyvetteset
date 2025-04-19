import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import PenaltiesSection from "@/components/PenaltiesSection";
import BookADemo from "@/components/BookaDemo";
import FAQ from "@/components/FAQ";
import UserProtectionSection from "@/components/UserProtection";
import ScanWebsite from "@/components/ScanWebsite";
import Testimonials from "@/components/Testimonials";

const Index = () => {
  // Smooth scroll implementation
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const hash = target.getAttribute('href');
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            window.scrollTo({
              top: element.getBoundingClientRect().top + window.scrollY - 80,
              behavior: 'smooth'
            });
            
            // Update URL without reload
            history.pushState(null, '', hash);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  // Initial animation on page load
  useEffect(() => {
    document.body.classList.add('animate-fade-in');
    
    return () => {
      document.body.classList.remove('animate-fade-in');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <Hero />
        {/* <ScanWebsite /> */}
        <PenaltiesSection />
        <Services />
        <UserProtectionSection />
        <About />
        <BookADemo />
        <Contact />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
