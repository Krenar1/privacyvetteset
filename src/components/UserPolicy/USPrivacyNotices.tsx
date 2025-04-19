import React from "react";
import CA from "./USPrivacyNotices/CA"
import OR from "./USPrivacyNotices/OR";
import UT from "./USPrivacyNotices/UT";
import MT from "./USPrivacyNotices/MT";
import CO from "./USPrivacyNotices/CO";
import NE from "./USPrivacyNotices/NE";
import TX from "./USPrivacyNotices/TX";
import IA from "./USPrivacyNotices/IA";
import VA from "./USPrivacyNotices/VA";
import FL from "./USPrivacyNotices/FL";
import NJ from "./USPrivacyNotices/NJ";
import DE from "./USPrivacyNotices/DE";
import NH from "./USPrivacyNotices/NH";
import CT from "./USPrivacyNotices/CT";
import { useUSPrivacyState } from "@/pages/userPolicy/PrivacyPolicyPage";
import GeneralNotices from "./USPrivacyNotices/GeneralNotices";

interface USState {
  code: string;
  name: string;
  generalNotices: boolean;
}
interface SharedData {
  mainColor: string;
  secondaryColor: string;
}

// Update the states so that only these are generalNotices:
// NH, MT, OR, UT, IA, NJ, CT, CA, CO, NE, DE, VA, TX, FL.
const states: USState[] = [
  { code: "AL", name: "Alabama", generalNotices: true },
  { code: "AK", name: "Alaska", generalNotices: true },
  { code: "AZ", name: "Arizona", generalNotices: true },
  { code: "AR", name: "Arkansas", generalNotices: true },
  { code: "CA", name: "California (CCPA)", generalNotices: false },
  { code: "CO", name: "Colorado (CPA)", generalNotices: false },
  { code: "CT", name: "Connecticut (CTDPA)", generalNotices: false },
  { code: "DE", name: "Delaware (DPDPA)", generalNotices: false },
  { code: "FL", name: "Florida (FDBR)", generalNotices: false },
  { code: "GA", name: "Georgia", generalNotices: true },
  { code: "HI", name: "Hawaii", generalNotices: true },
  { code: "ID", name: "Idaho", generalNotices: true },
  { code: "IL", name: "Illinois", generalNotices: true },
  { code: "IN", name: "Indiana", generalNotices: true },
  { code: "IA", name: "Iowa (ICDPA)", generalNotices: false },
  { code: "KS", name: "Kansas", generalNotices: true },
  { code: "KY", name: "Kentucky", generalNotices: true },
  { code: "LA", name: "Louisiana", generalNotices: true },
  { code: "ME", name: "Maine", generalNotices: true },
  { code: "MD", name: "Maryland", generalNotices: true },
  { code: "MA", name: "Massachusetts", generalNotices: true },
  { code: "MI", name: "Michigan", generalNotices: true },
  { code: "MN", name: "Minnesota", generalNotices: true },
  { code: "MS", name: "Mississippi", generalNotices: true },
  { code: "MO", name: "Missouri", generalNotices: true },
  { code: "MT", name: "Montana (MCDPA)", generalNotices: false },
  { code: "NE", name: "Nebraska (NDPA)", generalNotices: false },
  { code: "NV", name: "Nevada", generalNotices: true },
  { code: "NH", name: "New Hampshire (NHPA)", generalNotices: false },
  { code: "NJ", name: "New Jersey (NJDPA)", generalNotices: false },
  { code: "NM", name: "New Mexico", generalNotices: true },
  { code: "NY", name: "New York", generalNotices: true },
  { code: "NC", name: "North Carolina", generalNotices: true },
  { code: "ND", name: "North Dakota", generalNotices: true },
  { code: "OH", name: "Ohio", generalNotices: true },
  { code: "OK", name: "Oklahoma", generalNotices: true },
  { code: "OR", name: "Oregon (OCPA)", generalNotices: false },
  { code: "PA", name: "Pennsylvania", generalNotices: true },
  { code: "RI", name: "Rhode Island", generalNotices: true },
  { code: "SC", name: "South Carolina", generalNotices: true },
  { code: "SD", name: "South Dakota", generalNotices: true },
  { code: "TN", name: "Tennessee", generalNotices: true },
  { code: "TX", name: "Texas (TDPSA)", generalNotices: false },
  { code: "UT", name: "Utah (UTCPA)", generalNotices: false },
  { code: "VT", name: "Vermont", generalNotices: true },
  { code: "VA", name: "Virginia (VCDPA)", generalNotices: false },
  { code: "WA", name: "Washington", generalNotices: true },
  { code: "WV", name: "West Virginia", generalNotices: true },
  { code: "WI", name: "Wisconsin", generalNotices: true },
  { code: "WY", name: "Wyoming", generalNotices: true },
];

const gridAreas: { [code: string]: string } = {
  ME: "1 / 12",
  AK: "2 / 1",
  VT: "2 / 11",
  NH: "2 / 12",
  WA: "3 / 2",
  ID: "3 / 3",
  MT: "3 / 4",
  ND: "3 / 5",
  MN: "3 / 6",
  MI: "3 / 8",
  NY: "3 / 10",
  MA: "3 / 11",
  RI: "3 / 12",
  OR: "4 / 2",
  UT: "4 / 3",
  WY: "4 / 4",
  SD: "4 / 5",
  IA: "4 / 6",
  WI: "4 / 7",
  IN: "4 / 8",
  OH: "4 / 9",
  PA: "4 / 10",
  NJ: "4 / 11",
  CT: "4 / 12",
  CA: "5 / 2",
  NV: "5 / 3",
  CO: "5 / 4",
  NE: "5 / 5",
  MO: "5 / 6",
  IL: "5 / 7",
  KY: "5 / 8",
  WV: "5 / 9",
  MD: "5 / 10",
  DE: "5 / 11",
  AZ: "6 / 3",
  NM: "6 / 4",
  KS: "6 / 5",
  AR: "6 / 6",
  TN: "6 / 7",
  NC: "6 / 8",
  SC: "6 / 9",
  VA: "6 / 10",
  OK: "7 / 5",
  LA: "7 / 6",
  MS: "7 / 7",
  AL: "7 / 8",
  GA: "7 / 9",
  HI: "8 / 1",
  TX: "8 / 5",
  FL: "8 / 10",
};

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}

const USPrivacyNotices: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {
  // Default to a generalNotices state (California in this example)
  const { selectedState, setSelectedState } = useUSPrivacyState();

  const handleStateClick = (state: USState): void => {
    setSelectedState(state.code);
    sessionStorage.setItem("state",state.code)
    window.history.replaceState(null, "", `#${state.code}`);
  };

  const renderStateComponent = (code: string) => {

    switch (code) {
      case "CA":
        return <CA primaryColor={primaryColor} accentColor={accentColor}/>;
      case "OR":
        return <OR primaryColor={primaryColor} accentColor={accentColor}/>;
      case "UT":
        return <UT primaryColor={primaryColor} accentColor={accentColor}/>;
      case "MT":
        return <MT primaryColor={primaryColor} accentColor={accentColor}/>;
      case "CO":
        return <CO primaryColor={primaryColor} accentColor={accentColor}/>;
      case "NE":
        return <NE primaryColor={primaryColor} accentColor={accentColor}/>;
      case "TX":
        return <TX primaryColor={primaryColor} accentColor={accentColor}/>;
      case "IA":
        return <IA primaryColor={primaryColor} accentColor={accentColor}/>;
      case "VA":
        return <VA primaryColor={primaryColor} accentColor={accentColor}/>;
      case "FL":
        return <FL primaryColor={primaryColor} accentColor={accentColor}/>;
      case "NJ":
        return <NJ primaryColor={primaryColor} accentColor={accentColor}/>;
      case "DE":
        return <DE primaryColor={primaryColor} accentColor={accentColor}/>;
      case "NH":
        return <NH primaryColor={primaryColor} accentColor={accentColor}/>;
      case "CT":
        return <CT primaryColor={primaryColor} accentColor={accentColor}/>;
      default:
        return <GeneralNotices primaryColor={primaryColor} accentColor={accentColor}/>;
    }
  };

  function getOpacityColor(hex: string, opacity: number): string {
    const normalized = hex.startsWith('#') ? hex.slice(1) : hex;
    if (normalized.length !== 6) {
      return hex
    }
    
    // Parse the red, green, and blue components.
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    
    // Return the color in rgba format with the specified opacity.
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Get the details for the currently selected state.
  const currentState = states.find((state) => state.code === sessionStorage.getItem("state")) || {
    "code": "CA",
    "name": "California (CCPA)",
    "generalNotices": true
};

  return (
    <div className="p-6 bg-white space-y-6">
      <h2 className="md:text-3xl text-xl font-bold mb-4">US Privacy Notices</h2>
      <div
        className="grid grid-cols-12 gap-2 lg:h-[400px] sm:h-[320px] h-[240px] lg:w-[700px] sm:w-[520px] w-[330px] relative mx-auto"
      >
        {states.map((state) => {
          // Use gridArea if defined in our mapping.
          const area = gridAreas[state.code];
          if (area) {
            return !state.generalNotices ? (
              <button
                key={state.code}
                onClick={() => handleStateClick(state)}
                style={{ gridArea: area,color:currentState.code === state.code ? primaryColor :null,background:currentState.code === state.code ?  accentColor : !currentState.generalNotices ? getOpacityColor(accentColor,0.15) :null }}
                className={`flex items-center justify-center md:rounded-lg rounded-sm md:text-[16px] text-[12px] transition-colors duration-200 select-none shadow-lg ${
                  currentState.code === state.code
                    ? `font-semibold`
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {state.code}
              </button>
            ) : (
              <button
                key={state.code}
                onClick={() => handleStateClick(state)}
                style={{ gridArea: area, color:"black" }}
                className={`flex items-center justify-center md:rounded-lg rounded-sm md:text-[16px] text-[12px] transition-colors duration-200 select-none shadow-md ${
                  currentState.code === state.code
                    ? `font-semibold bg-primary`
                    : !currentState.generalNotices ? "bg-white" : "text-gray-700 hover:bg-gray-50 bg-primary/5"
                }`}
              >
                {state.code}
              </button>
            );
          }
          return null;
        })}
      </div>
      <div>
        <div className="flex items-center md:mb-1">
          <div style={{ background: accentColor }} className="md:w-8 md:h-5 w-5 h-3"></div>
          <div style={{background:getOpacityColor(accentColor,0.15)}} className="md:w-8 md:h-5 w-5 h-3"></div>
          <h2 className="ml-3 font-normal md:text-[16px] text-[14px]">Individual State Notices</h2>
        </div>
        <div className="flex items-center">
          <div className="bg-primary md:w-8 md:h-5 w-5 h-3"></div>
          <div className="bg-primary/5 md:w-8 md:h-5 w-5 h-3"></div>
          <h2 className="ml-3 font-normal md:text-[16px] text-[14px]">General State Notices</h2>
        </div>
      </div>


      {/* Display the selected state details */}
      <div className="mt-6">
        {currentState && (
          <div className="space-y-4">
            {!currentState.generalNotices ?
            <h3 className="md:text-2xl text-xl font-bold px-5 py-2 w-fit text-white rounded-lg" style={{background:accentColor,color:primaryColor}}>{currentState.name}</h3>
            : 
            <h3 className="md:text-2xl text-xl font-bold px-5 py-2 w-fit text-white rounded-lg color-black bg-primary">{currentState.name} (General State Notices)</h3>
            }
            {renderStateComponent(currentState.code)}
          </div>
        )}
      </div>
    </div>
  );
};

export default USPrivacyNotices;
