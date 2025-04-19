import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import PersonalInformationSharingSegment from "./PrivacyPolicySection/PersonalInformationSharingSegment";
import PrivacyInformationSegment from "./PrivacyPolicySection/PrivacyInformationSegment";
import TrackingTechnologiesSegment from "./PrivacyPolicySection/TrackingTechnologiesSegment";

interface PrivacyPolicySectionProps {
  primaryColor: string; // Expected to be a valid CSS color (e.g., "#1E40AF")
  accentColor: string;  // Expected to be a valid CSS color (e.g., "#93C5FD")
}

const PrivacyPolicySection: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {
  // Manage expanded/collapsed state for accordion sections.
  const [openSections, setOpenSections] = useState({
    0: true,
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const allExpanded = Object.values(openSections).every(Boolean);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAllSections = () => {
    setOpenSections({
      0: !allExpanded,
      1: !allExpanded,
      2: !allExpanded,
      3: !allExpanded,
      4: !allExpanded,
    });
  };

  // Return a base class string for the button.
  // We'll use inline styles to control dynamic colors.
  const buttonClass = "flex items-center w-full gap-2 p-3 text-lg rounded-lg " +
    "cursor-pointer transition-colors duration-200";

  // This function returns inline styles if the section is active.
  const getButtonStyle = (isActive: boolean) =>
    isActive ? { backgroundColor: accentColor, color: primaryColor } : {};

  return (
    <div className="p-6 bg-white space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="md:text-2xl text-xl font-bold">Privacy Policy</h2>
        <button
          onClick={toggleAllSections}
          className="px-4 py-2 hover:bg-gray-50 text-gray-700 rounded transition-colors duration-200"
        >
          {allExpanded ? "Collapse All" : "Expand All"}
        </button>
      </div>

      {/* Accordion Item: Introduction */}
      <div className="rounded-lg">
        <button
          onClick={() => toggleSection(0)}
          className={buttonClass}
          style={getButtonStyle(openSections[0])}
        >
          <div className="flex items-center justify-between w-full">
            <span>Introduction</span>
            {openSections[0] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        {openSections[0] && (
          <div className="sm:px-4 py-2">
            <p className="text-lg">
              By accessing our site, you agree to our Privacy Policy and Terms of Use. All information provided here is for informational purposes only and should not replace professional advice.
            </p>
          </div>
        )}
      </div>

      {/* Accordion Item: Information You Provide */}
      <div className="rounded-lg">
        <button
          onClick={() => toggleSection(1)}
          className={buttonClass}
          style={getButtonStyle(openSections[1])}
        >
          <div className="flex items-center justify-between w-full">
            <span>Information You Provide</span>
            {openSections[1] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        {openSections[1] && (
          <div className="sm:px-4 py-2">
            <PrivacyInformationSegment />
          </div>
        )}
      </div>

      {/* Accordion Item: Cookies & Similar Technologies */}
      <div className="rounded-lg">
        <button
          onClick={() => toggleSection(2)}
          className={buttonClass}
          style={getButtonStyle(openSections[2])}
        >
          <div className="flex items-center justify-between w-full">
            <span>Cookies &amp; Similar Technologies</span>
            {openSections[2] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        {openSections[2] && (
          <div className="sm:px-4 py-2">
            <TrackingTechnologiesSegment mainColor={primaryColor} />
          </div>
        )}
      </div>

      {/* Accordion Item: Data Retention &amp; Usage */}
      <div className="rounded-lg">
        <button
          onClick={() => toggleSection(3)}
          className={buttonClass}
          style={getButtonStyle(openSections[3])}
        >
          <div className="flex items-center justify-between w-full">
            <span>Data Retention &amp; Usage</span>
            {openSections[3] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        {openSections[3] && (
          <div className="sm:px-4 py-2">
            <PersonalInformationSharingSegment />
          </div>
        )}
      </div>

      {/* Accordion Item: How to Delete Your Personal Data */}
      <div className="rounded-lg">
        <button
          onClick={() => toggleSection(4)}
          className={buttonClass}
          style={getButtonStyle(openSections[4])}
        >
          <div className="flex items-center justify-between w-full">
            <span>How to Delete Your Personal Data</span>
            {openSections[4] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
        {openSections[4] && (
          <div className="sm:px-4 py-2">
            <p className="text-lg">
              If you would like to delete your personal data, please submit a request through our&nbsp;
              <Link
                to="your-privacy-choices"
                className="pr-1"
                style={{ color: primaryColor, textDecoration: "underline" }}
              >
                dedicated form
              </Link>
              . We will process your request as soon as possible.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicySection;
