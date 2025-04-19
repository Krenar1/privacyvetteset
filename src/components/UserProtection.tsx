import React from "react";
// If you use lucide-react or another icon library, import icons here:
// import { ShieldAlert, Gavel, EyeOff, CheckCircle } from "lucide-react";

import statesSelection from "../../public/states-selection.png";
import majorLogos from "../../public/major-logos.webp";
import editPolicy from "../../public/edit-policy.png";

const UserProtectionSection: React.FC = () => {
  return (
    // Added "relative" so that absolute children (editPolicy image) are positioned against this container.
    <section id="protection" className="relative py-16 pt-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-center md:justify-between gap-10 md:gap-16">
        {/* Left Column: Text / Explanation */}
        <div className="md:w-1/2">
          <h2 className="text-2xl md:text-3xl lg:text-[40px] font-bold mb-6 text-gray-800 leading-tight">
            Protecting You{" "}
            <span className="text-primary">From Day One</span>
          </h2>
          <p className="text-gray-600 text-lg mb-4">
            Your privacy isn’t just a policy—it’s our core mission. We employ
            cutting-edge security measures to ensure your data remains secure.
          </p>
          <p className="text-gray-600 text-lg mb-6">
            Additionally, our robust legal framework empowers us to swiftly detect and take action against any misuse. From real-time threat analysis to rigorous legal enforcement, your data is in trusted hands.
          </p>

          {/* List or Highlights */}
          <ul className="space-y-3">
            <li className="flex items-start">
              {/* Example icon placeholder */}
              {/* <ShieldAlert className="w-6 h-6 text-primary mt-1 mr-2" /> */}
              <span className="bg-primary text-white rounded-full w-6 h-6 min-w-6 flex items-center justify-center mr-3 font-bold">
                1
              </span>
              <span className="text-gray-700 text-[18px]">
                <strong>Real-Time Analysis:</strong> Our systems detect anomalies early, ensuring rapid response.
              </span>
            </li>
            <li className="flex items-start">
              {/* <Gavel className="w-6 h-6 text-primary mt-1 mr-2" /> */}
              <span className="bg-primary text-white rounded-full w-6 h-6 min-w-6 flex items-center justify-center mr-3 font-bold">
                2
              </span>
              <span className="text-gray-700 text-[18px]">
                <strong>Swift Legal Action:</strong> Leveraging international law, we hold offenders accountable.
              </span>
            </li>
            <li className="flex items-start">
              {/* <EyeOff className="w-6 h-6 text-primary mt-1 mr-2" /> */}
              <span className="bg-primary text-white rounded-full w-6 h-6 min-w-6 flex items-center justify-center mr-3 font-bold">
                3
              </span>
              <span className="text-gray-700 text-[18px]">
                <strong>Process Transparency:</strong> Every step of our enforcement is visible, keeping you informed.
              </span>
            </li>
          </ul>
          
          <img
          src={editPolicy}
          alt="Edit Privacy Policy"
          className="relative md:-bottom-20 -bottom-4  md:left-20 w-128 md:w-128 transform hover:rotate-6 hover:scale-110 scale-105 transition-[2s]"
          />
        </div>

        {/* Right Column: Custom Graphics */}
        <div className="md:w-1/2 flex flex-col-reverse gap-6 items-center">
          {/* States selection illustration with overlay */}
          <div className="relative w-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300">
            <img
              src={statesSelection}
              alt="Privacy Assurance"
              className="w-full h-auto rounded-xl"
            />
            <div className="absolute -bottom-4 left-11 bg-primary text-white py-2 px-4 rounded-md shadow-lg">
              <p className="text-md text-white font-semibold">Data Guard, Always On</p>
            </div>
          </div>

          {/* Major logos graphic */}
          <div className="relative transform shadow-lg border border-gray-100 p-4 rounded-xl hover:scale-105 transition-transform duration-300">
          <img
            
            src={majorLogos}
            alt="Trusted Partners"
            className="w-full h-auto rounded-xl "
            />
          <div className="relative mt-2 bg-[#fff]  text-white py-2 px-4 rounded-md">
              <p className="text-md text-gray-600 font-semibold"><span className="font-bold">Vendor Privacy Monitoring </span>
              Wondering about the data practices of your vendors? Our research monitors a broad range of suppliers to reveal how they handle customer information.</p>
            </div>
            </div>
        </div>
      
      </div>

      {/* Edit Policy Graphic: Absolute positioned in the bottom left */}
    </section>
  );
};

export default UserProtectionSection;
