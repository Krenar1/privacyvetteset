import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { useEffect } from "react";
import { Link } from "react-router-dom"; // Or "next/link" if you're using Next.js
import { Check } from "lucide-react"; // Import Check icon

const Plans: React.FC = () => {
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <>
      <Header />
      <section className="bg-white py-16 px-4 text-center mt-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Affordable Plans to <span className="text-primary">Empower Your Business</span>
          </h2>
          {/* Subheading */}
          <p className="text-md md:text-lg text-gray-600 mb-8">
            Discover a range of pricing options designed to grow with your enterprise. Our flexible plans ensure you receive just the right support and features at every stage.
          </p>

          {/* Pricing Card */}
          <div className="flex xl:flex-row flex-col justify-center items-center gap-10">

          <div
            className="
            mx-auto
            max-w-md
            w-full
            bg-white
            shadow-lg
            rounded-xl
            p-6
            md:p-8
              border
              border-gray-100
            "
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              The Ultimate Privacy Suite
            </h3>
            {/* Book Demo Button */}
            <Link
              to="/schedule"
              className="
              inline-block
              bg-primary
              text-white
              px-6
              py-3
              rounded-md
              font-semibold
              hover:bg-primary/90
              mb-4
              "
              >
              Schedule Your Demo
            </Link>

            {/* Features List */}
            <ul className="text-left space-y-2 mb-4 text-gray-700">
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" /> 
                <span>Comprehensive Privacy Hub</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" /> 
                <span>Bespoke Policy Builder</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" /> 
                <span>Consent &amp; Opt-Out Tools</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" /> 
                <span>Vendor &amp; Data Oversight</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" /> 
                <span>Automated DSAR Processing</span>
              </li>
              <li className="flex items-center">
                <Check className="w-5 h-5 text-primary mr-2" /> 
                <span>Enhanced compliance with coverage up to $250,000*</span>
              </li>
            </ul>

{/*             <p className="text-sm text-gray-400">
              *Subject to terms and conditions
            </p> */}
          </div>
          <img
            src="https://cdn.dribbble.com/userupload/42329428/file/original-060b5ae1efdffd8a95e8dd008d70d52a.gif"
            alt="Meeting Schedule Gif"
            className="w-full max-w-full md:max-w-[600px] mt-[50px] md:mt-0 h-auto"
          />
                </div>
        </div>
      </section>
      <FAQ />
      <Footer />
    </>
  );
};

export default Plans;
