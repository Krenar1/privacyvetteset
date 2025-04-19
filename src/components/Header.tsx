import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShieldIcon } from "./ui-components";
import { Menu, X } from "lucide-react";
import { HashLink } from "react-router-hash-link";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8 bg-white",
        // isScrolled ? "glass shadow-sm backdrop-blur-xl py-3" : "bg-transparent"
      )}
    >
      <div className="container-wide px-2 flex items-center justify-between">
        {/* Logo */}
        <HashLink smooth to="/#hero" className="flex items-center">
          <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-md mr-2">
            <ShieldIcon className="text-white" />
          </div>
          <span className="text-xl font-semibold text-darkgray">
            PrivacyVet
          </span>
        </HashLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <HashLink smooth to="/#hero" className="text-darkgray hover:text-primary transition-colors">
            Home
          </HashLink>
          <HashLink smooth to="/#penalties" className="text-darkgray hover:text-primary transition-colors">
            Penalties
          </HashLink>
          <HashLink smooth to="/#services" className="text-darkgray hover:text-primary transition-colors">
            Services
          </HashLink>
          <HashLink smooth to="/#protection" className="text-darkgray hover:text-primary transition-colors">
            Protection
          </HashLink>
          <HashLink smooth to="/#book-a-demo" className="text-darkgray hover:text-primary transition-colors">
            Book a Demo
          </HashLink>
          <HashLink smooth to="/plans" className="text-darkgray hover:text-primary transition-colors">
            Plans
          </HashLink>
          <HashLink smooth to="/#about" className="text-darkgray hover:text-primary transition-colors">
            About
          </HashLink>
          <HashLink smooth to="/#book-a-demo" className="btn-primary">
            Get Started
          </HashLink>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-darkgray p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 top-[72px] bg-white z-40 transform transition-transform duration-300 ease-in-out lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col p-4 space-y-4">
          <HashLink
            smooth
            to="/#hero"
            className="text-darkgray py-3 px-4 rounded-md hover:bg-primary/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </HashLink>
          <HashLink
            smooth
            to="/#services"
            className="text-darkgray py-3 px-4 rounded-md hover:bg-primary/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Services
          </HashLink>
          <HashLink
            smooth
            to="/#protection"
            className="text-darkgray py-3 px-4 rounded-md hover:bg-primary/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Protection
          </HashLink>
          <HashLink
            smooth
            to="/#book-a-demo"
            className="text-darkgray py-3 px-4 rounded-md hover:bg-primary/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Book a Demo
          </HashLink>
          <HashLink
            smooth
            to="/plans"
            className="text-darkgray py-3 px-4 rounded-md hover:bg-primary/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            Plans
          </HashLink>
          <HashLink
            smooth
            to="/#about"
            className="text-darkgray py-3 px-4 rounded-md hover:bg-primary/5"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </HashLink>
          <HashLink
            smooth
            to="/#contact"
            className="btn-primary text-center mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            Get Started
          </HashLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
