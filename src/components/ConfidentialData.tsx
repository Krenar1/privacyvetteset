import React from 'react';
import dataInputImage from '../../dist/data-input.png'; // Replace with the correct path to your image

const ConfidentialDataSection: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
        {/* Section Header */}
        <div className="text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Your Privacy, Your Control
          </h3>
          <p className="text-gray-600 text-lg">
            Enter your personal information in a secure, private environment. Our system then automatically generates a tailored privacy policy just for you.
          </p>
        </div>
        
        {/* Image Container */}
        <div className="relative w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300">
          <img
            src={dataInputImage}
            alt="Secure data input and personalized privacy policy generation"
            className="w-full h-auto rounded-xl"
          />
          <div className="absolute -bottom-4 right-4 bg-primary text-white py-2 px-4 rounded-md shadow-lg">
            <p className="text-sm font-semibold">Data Remains Confidential</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfidentialDataSection;
