import React from 'react';
import { Container } from "./ui-components";
import { motion } from 'framer-motion';

// Define animation variants for the news cards.
const cardVariants = {
  offscreen: {
    opacity: 0,
    y: 50,
  },
  onscreen: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.3, // Stagger the animation by 0.3s increments
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

const PenaltiesSection = () => {
  // Updated data for the penalty cards with smaller companies.
  const cards = [
    {
      id: 1,
      title: "Texas E-commerce Retailer Fined $600k for Data Breach",
      text: "A mid-sized e-commerce retailer in Texas was fined $600k after an investigation revealed significant security lapses that exposed sensitive customer data. Regulators emphasized the need for improved cybersecurity measures.",
    },
    {
      id: 2,
      title: "Florida Healthcare Provider Penalized $500k Over Data Exposure",
      text: "A regional healthcare provider in Florida faced a $500k fine for failing to implement adequate data protection safeguards. The penalty was imposed following an extensive review of the provider’s security practices, highlighting vulnerabilities in handling patient information.",
    },
    {
      id: 3,
      title: "Colorado Financial Firm Fined $350k for Privacy Violations",
      text: "A Colorado-based financial services firm was fined $350k for misusing consumer data for unauthorized marketing campaigns. The enforcement action underlined the importance of strict privacy controls and regulatory compliance in the financial sector.",
    },
  ];

  const imageData = {
    id: 'image',
    title: "U-Miss Medical Center Fined $2.75 Million for Decade-Long HIPAA Violations",
    imageUrl: "https://www.currentware.com/wp-content/uploads/2019/12/hipaa-compliance-1.jpg"
  };
  
  

  return (
    <section id="penalties" className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-tl-full -z-10" />

      <Container>
        <div className="text-center max-w-3xl mx-auto mb-2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-balance">
            Recent Data Privacy Enforcement Actions
          </h2>
          <p className="text-lg md:text-xl text-darkgray/80">
            Explore the latest cases where companies have faced significant fines for data mishandling and privacy violations.
          </p>
        </div>

        {/* Main Content Wrapper with animated news cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              className="bg-white shadow-lg rounded-xl p-6"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              custom={index}
              variants={cardVariants}
            >
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-darkgray/80">{card.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Optional Image Section */}
        <div className="mt-8 flex justify-center">
          <div>
            <img
              src={imageData.imageUrl}
              alt="Gavel and legal documents symbolizing data penalty enforcement"
              className="max-h-[250px] w-auto rounded-xl shadow-lg"
            />
            <h3 className="text-xl font-semibold mt-4 text-center">
              {imageData.title}
            </h3>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default PenaltiesSection;
