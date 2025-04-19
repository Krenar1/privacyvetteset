
import { Section, Container, SectionHeading } from "./ui-components";
import { Shield, RefreshCw, CheckCircle2, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import FreeAudit from "./PaymentDialogs/FreeAudit";
import FullPrivacyPolicy from "./PaymentDialogs/FullPrivacyPolicy";
import MonthlySubPlan from "./PaymentDialogs/MonthlySubPlan";
import CustomProductPayment from "./PaymentDialogs/CustomProductPayment";
import API_CONFIG from "../config/api";
import api from "../services/api";


export interface formDataType {
  name: string;
  email: string;
  website_url: string;
  company_address: string;
  company_phone: string;
}

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website_url: '',
    company_address: '',
    company_phone: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);

    // Show toast confirmation
      toast({
        title: "Plan selected",
        description: `You've selected the ${planId} plan. Proceed to checkout to complete your purchase.`,
        duration: 5000,
      });

      setTimeout(() => {
        const targetDiv = document.getElementById("checkout-section");
        targetDiv?.scrollIntoView({ behavior: "smooth" });
      }, 150);

    };


    const handleSubscribe = async () => {
      setIsLoading(true);
      try {
        const data = await api.createPaymentIntent({
          name: formData.name,
          email: formData.email,
          website_url: formData.website_url,
          company_address: formData.company_address,
          company_phone: formData.company_phone,
          plan: "free",
        });

        setIsDialogOpen(true);
        // setSubscribed(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong!");
      } finally {
        setIsLoading(false);
      }
    };

    const handleCheckout = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const { name, email, website_url } = formData;

      if (!name.trim() || !email.trim() || !website_url.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter your full name, email address, and website URL before proceeding.",
          duration: 5000,
        });
        return;
      }

      if (selectedPlan === "free-audit") {
        handleSubscribe();
        return;
      }

      setIsDialogOpen(true);
      setTimeout(() => {
        const dialogElement = document.getElementById("payment-dialog");
        dialogElement?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };

  return (
    <Section id="pricing" className="bg-gradient-to-b from-white to-primary/5">
      <Container>
        <SectionHeading
          subtitle="Pricing Plans"
          title="Select one of our plans"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {/* Free Audit Plan */}
            <div className={`glass rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full ${selectedPlan === "free-audit" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md hover:-translate-y-1"}`}>
              <div className="bg-primary/10 p-6">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white text-primary rounded-lg">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-semibold">Free Privacy Audit</h3>
                <div className="mt-4 flex items-end">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-darkgray/60 ml-2">One-time</span>
                </div>
              </div>

              {/* Content container with flex-grow to push button down */}
              <div className="p-6 pb-0 flex-grow">
                <ul className="space-y-3 mb-6">
                  {["Basic compliance assessment", "Summary report of findings", "Recommended actions", "No obligation"].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-darkgray/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Button stays at the bottom */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handlePlanSelection("free-audit")}
                  className={`w-full py-2.5 px-4 rounded-md font-semibold transition-colors ${
                    selectedPlan === "free-audit"
                      ? "bg-primary text-white"
                      : "bg-white border border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>

            {/* One-time Update Plan */}
            <div className={`glass rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full ${selectedPlan === "one-time" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md hover:-translate-y-1"}`}>
              <div className="bg-primary/10 p-6">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white text-primary rounded-lg">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-semibold">Full Policy Update</h3>
                <div className="mt-4 flex items-end">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-darkgray/60 ml-2">One-time</span>
                </div>
              </div>

              <div className="p-6 pb-0 flex-grow">
                <ul className="space-y-3 mb-6">
                  {[
                    "Complete privacy policy creation",
                    "Customized to your business",
                    "GDPR, CCPA, PIPEDA compliant",
                    "One-time update",
                    "30 days of support",
                    "Delivered directly to your email",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-darkgray/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handlePlanSelection("one-time")}
                  className={`w-full py-2.5 px-4 rounded-md font-semibold transition-colors ${
                    selectedPlan === "one-time"
                      ? "bg-primary text-white"
                      : "bg-white border border-primary text-primary hover:bg-primary/5"
                  }`}
                >
                  Select Plan
                </button>
              </div>
            </div>

            {/* Monthly Subscription Plan */}
            <div className={`glass rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full relative ${selectedPlan === "monthly" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md hover:-translate-y-1"}`}>
              <div className="absolute top-0 right-0">
                <span className="inline-block bg-accent text-white text-sm md:text-md font-semibold px-6 py-2 rounded-bl-lg">
                  Most Popular
                </span>
              </div>
              <div className="bg-primary/10 p-6">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white text-primary rounded-lg">
                  <RefreshCw size={24} />
                </div>
                <h3 className="text-xl font-semibold">Full Compliance</h3>
                <div className="mt-4 flex items-end">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-darkgray/60 ml-2">/month</span>
                </div>
              </div>

              <div className="p-6 pb-0 flex-grow">
                <ul className="space-y-3 mb-6">
                  {[
                    "Everything in one-time plan",
                    "Monthly compliance audits",
                    "Automatic policy updates",
                    "Regulatory change alerts",
                    "Priority support",
                    "Cookie consent system",
                    "DSAR handling tools",
                    "Delivered directly to your email",

                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-darkgray/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0" id="checkout-section">
                <button
                  onClick={() => handlePlanSelection("monthly")}
                  className={`w-full py-2.5 px-4 rounded-md font-semibold transition-colors ${
                    selectedPlan === "monthly"
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-primary"
                  }`}
                >
                  Select Plan
                </button>
              </div>
            </div>

            {/* Custom Products Plan */}
            <div className={`glass rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full ${selectedPlan === "custom" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md hover:-translate-y-1"}`}>
              <div className="bg-primary/10 p-6">
                <div className="w-12 h-12 mb-4 flex items-center justify-center bg-white text-primary rounded-lg">
                  <Package size={24} />
                </div>
                <h3 className="text-xl font-semibold">Custom Products</h3>
                <div className="mt-4 flex items-end">
                  <span className="text-3xl font-bold">Varies</span>
                  <span className="text-darkgray/60 ml-2">Custom pricing</span>
                </div>
              </div>

              <div className="p-6 pb-0 flex-grow">
                <ul className="space-y-3 mb-6">
                  {[
                    "Choose from our custom products",
                    "Specialized compliance solutions",
                    "Tailored to your specific needs",
                    "Multiple pricing options",
                    "One-time or subscription plans",
                    "Premium support included",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 size={18} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-darkgray/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => handlePlanSelection("custom")}
                  className={`w-full py-2.5 px-4 rounded-md font-semibold transition-colors ${
                    selectedPlan === "custom"
                      ? "bg-primary text-white"
                      : "bg-white text-primary border border-primary"
                  }`}
                >
                  Select Plan
                </button>
              </div>
            </div>
          </div>


        {selectedPlan && (
          <div  className="glass p-6 rounded-xl max-w-2xl mx-auto animate-scale-in">
            <h3 className="text-xl font-semibold mb-4">Complete Your Order</h3>
            <form onSubmit={handleCheckout}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-darkgray mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="John Doe"
                    required
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-darkgray mb-1">
                    Website Url
                  </label>
                  <input
                    type="text"
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="https://www.privacyvet.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company-address" className="block text-sm font-medium text-darkgray mb-1">
                    Company Address
                  </label>
                  <input
                    type="text"
                    id="company_address"
                    name="company_address"
                    value={formData.company_address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="St. Privacy Policy, NY 10000"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company_phone" className="block text-sm font-medium text-darkgray mb-1">
                    Company Contact Phone Number
                  </label>
                  <input
                    type="text"
                    id="company_phone"
                    name="company_phone"
                    value={formData.company_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-md border border-lightgray/30 focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="+1 123 456 7869"
                    required
                  />
                </div>

                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    className="h-4 w-4 text-primary focus:ring-0"
                    required
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="ml-2 text-sm text-darkgray"
                  >
                    I agree to the <a target="_blank" href="/termsofservice" className="text-primary underline">Terms and Conditions</a>
                  </label>
                </div>

                <div className="bg-primary/5 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Selected Plan:</span>
                    <span className="font-semibold">
                      {selectedPlan === "free-audit" && "Free Privacy Audit"}
                      {selectedPlan === "one-time" && "Full Policy Update"}
                      {selectedPlan === "monthly" && "Full Compliance"}
                      {selectedPlan === "custom" && "Custom Products"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Price:</span>
                    <span className="font-semibold">
                      {selectedPlan === "free-audit" && "$0.00"}
                      {selectedPlan === "one-time" && "$99.00"}
                      {selectedPlan === "monthly" && "$29.00/month"}
                      {selectedPlan === "custom" && "Varies based on selection"}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {selectedPlan === "free-audit" ? "Get Free Audit" : "Proceed to Payment"}
                  </button>

                  {/* Conditional Dialog Rendering */}
                  {isDialogOpen && selectedPlan && (
                    <div>
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogContent id="payment-dialog">
                        {selectedPlan === "free-audit" && <FreeAudit subscribed={subscribed}/>}
                        {selectedPlan === "one-time" && <FullPrivacyPolicy {...formData} />}
                        {selectedPlan === "monthly" && <MonthlySubPlan {...formData} />}
                        {selectedPlan === "custom" && <CustomProductPayment {...formData} />}
                      </DialogContent>
                      </Dialog>
                    </div>

                  )}
                  {/* <button
                    type="submit"
                    className="w-full py-3 px-4 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {selectedPlan === "free-audit" ? "Get Free Audit" : "Proceed to Payment"}
                  </button> */}
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-4">Common Questions About Our Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes, you can upgrade from the free audit or one-time update to the monthly plan at any time. We'll even apply credit from your one-time purchase."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, PayPal, and bank transfers for business customers. All payments are securely processed."
              },
              {
                question: "Is there a contract for the monthly plan?",
                answer: "No long-term contracts required. The monthly plan is billed monthly and you can cancel at any time without penalties."
              },
              {
                question: "Do you offer custom enterprise plans?",
                answer: "Yes, we offer custom solutions for enterprise clients with specific compliance needs. Contact our sales team for details."
              }
            ].map((faq, index) => (
              <div key={index} className="glass p-5 rounded-xl text-left">
                <h4 className="font-semibold mb-2">{faq.question}</h4>
                <p className="text-darkgray/80 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

export default Pricing;
