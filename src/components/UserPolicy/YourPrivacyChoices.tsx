import { Info, CheckCircle } from "lucide-react";
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}
const YourPrivacyChoices: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {
  
  const [location, setLocation] = useState("");
  const [requestTypes, setRequestTypes] = useState(false);
  
  const [optOutJustSubmitted, setOptOutJustSubmitted] = useState(false);
  const [optOutSubmitted, setoptOutSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOptOutJustSubmitted(true);
    setTimeout(() => {
      setOptOutJustSubmitted(false);
      setoptOutSubmitted(true);
    }, 5000);
  };

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">Your Privacy Choices</h2>
      <h2 className="text-xl font-normal mb-4">Request to Opt-Out</h2>

       {optOutSubmitted ? (
        // Unchanged info callout: shown when an opt-out request was previously submitted.
        <div
          className="p-2 px-4 mb-4 rounded w-fit"
          style={{ background: accentColor }}
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6" color={primaryColor} />
            <p style={{ color: primaryColor }} className="font-[400] tracking-[0.75px]">
              You already submitted an opt out request and we no longer sell or share your personal information.
            </p>
          </div>
        </div>
      ) : <></>} 
        <>
          <div className="mb-6">
            <div>
              <p className="mt-2 font-normal text-lg">
                We use third party data analytics providers whose collection of
                information may be considered a “sale” of information under some
                privacy laws.
              </p>
              <p className="mt-2 font-normal text-lg">
                <em>
                  We use the{" "}
                  <Link
                    to="https://iabtechlab.com/gpp/"
                    style={{ color: primaryColor, textDecoration: "underline" }}
                  >
                    Global Privacy Platform (GPP)
                  </Link>{" "}
                  mechanism to communicate your Request to Opt-Out to third parties
                  that collect information via cookies on our website. If you choose,
                  you may also use the{" "}
                  <Link
                    to="http://www.aboutads.info/choices"
                    style={{ color: primaryColor, textDecoration: "underline" }}
                  >
                    Digital Advertising Alliance (DAA) WebChoices Tool
                  </Link>{" "}
                  to globally opt-out of third-party tracking via website cookies.
                </em>
              </p>
            </div>
          </div>

          {/* Opt-out Form */}
          {optOutJustSubmitted ? (
        // New green callout: shown when the form was just submitted.
        <div className="flex items-center p-4 bg-green-100 rounded-lg">
          <CheckCircle className="w-6 h-6 mr-3 text-green-800" />
          <p className="text-green-800">
            Your request was received. Opt-outs will be processed by Apr 30, 2025. Your request ID is CZAW44GUK.
          </p>
        </div>
      ) : (<form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="requestRegionCountryCode"
                className="block font-medium mb-1"
              >
                I certify I am a resident of
              </label>
              <select
                name="requestCountryRegionCode"
                id="requestRegionCountryCode"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border rounded p-2 w-full outline-none"
              >
                <option value="" disabled>
                  Select your location
                </option>
                <option value="US-CA">California</option>
                <option value="US-CO">Colorado</option>
                <option value="US-CT">Connecticut</option>
                <option value="US-DE">Delaware</option>
                <option value="US-IA">Iowa</option>
                <option value="US-MT">Montana</option>
                <option value="US-NE">Nebraska</option>
                <option value="US-NH">New Hampshire</option>
                <option value="US-NJ">New Jersey</option>
                <option value="US-OR">Oregon</option>
                <option value="US-TX">Texas</option>
                <option value="US-UT">Utah</option>
                <option value="US-VA">Virginia</option>
              </select>
            </div>
            <div className="mb-4 flex items-center select-none">
              <input
                type="checkbox"
                id="requestTypes"
                name="requestTypes"
                checked={requestTypes}
                onChange={(e) => setRequestTypes(e.target.checked)}
                style={{ color: primaryColor }}
                className="form-checkbox h-4 w-4"
              />
              <label htmlFor="requestTypes" className="ml-2 font-medium">
                Request Type(s)
              </label>
            </div>

            <button
              type="submit"
              style={{ background: primaryColor }}
              className="text-white px-4 py-2 rounded"
            >
              Submit Request
            </button>
            <p className="mt-4 text-lg">
              <em>
                Please note that online opt-outs are device and browser-specific.
                You may still see personalized ads from us while using a different
                device or browser, unless you also opt-out using that device or
                browser.
              </em>
            </p>
          </form>)}
        </>
    </div>
  );
};

export default YourPrivacyChoices;
