import React, { useState } from "react";
import { Plus, X } from "lucide-react"; // Import Plus and X icons from lucide-react

// Define a TypeScript interface for FAQ items
interface FAQItem {
  question: string;
  answer: string;
}

// FAQ data array with questions and answers, including one about privacy
const faqData: FAQItem[] = [
  {
    question: "How quickly can I implement PrivacyVet solutions?",
    answer:
      "Most of our solutions can be implemented within minutes. Simply answer a few questions about your website, and our system will generate the appropriate policies and tools for you to integrate.",
  },
  {
    question: "Do you offer solutions for specific regulations like GDPR or CCPA?",
    answer:
      "Yes, we provide specialized solutions for all major privacy regulations including GDPR, CCPA, PIPEDA, and many others. Our system automatically adapts to the regulations that apply to your specific audience.",
  },
  {
    question: "How do you handle policy updates when regulations change?",
    answer:
      "Our system continuously monitors regulatory changes worldwide. When significant changes occur, we automatically update your policies and notify you, ensuring your website remains compliant without manual intervention.",
  },
  {
    question: "Is PrivacyVet suitable for small websites and blogs?",
    answer:
      "Absolutely! We've designed our solutions to be accessible for websites of all sizes. We offer flexible pricing options that scale with your needs, making professional compliance available to everyone.",
  },
  {
    question: "How do you ensure the privacy of your data?",
    answer:
      "We take data privacy very seriously by implementing robust security measures such as encryption, regular audits, and strict compliance with international data protection standards. Your information is safeguarded at every step.",
  },
];

const FAQ: React.FC = () => {
  // State to track which FAQ items are open; using an array to allow multiple open items.
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  // Toggle the expanded state for a particular FAQ item
  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="my-20 mx-5 text-center">
      <h3 className="text-4xl font-semibold mb-6">Frequently Asked Questions</h3>
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
        {faqData.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div
              key={index}
              className="glass p-4 rounded-xl text-left cursor-pointer"
            >
              {/* Header with question text and toggle button */}
              <div
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center"
              >
                <h4 className="md:text-lg text-md font-semibold mb-2">{faq.question}</h4>
                <button
                  className="focus:outline-none"
                  aria-label={isOpen ? "Collapse answer" : "Expand answer"}
                >
                  {isOpen ? <X size={18} /> : <Plus size={18} />}
                </button>
              </div>

              {/* The answer div: its max-height, opacity, and padding change with the open state */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-96 opacity-100 py-2" : "max-h-0 opacity-0 py-0"
                }`}
              >
                <p className="text-darkgray/80">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FAQ;
