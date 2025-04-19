import { Ban, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Button } from "../ui/button";
import { usePrivacyRequest } from "@/pages/userPolicy/PrivacyPolicyPage";

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}
const MakeAPrivacyRequest: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {
  // Get shared color data from context

  const { policyRequest, setPolicyRequest } = usePrivacyRequest();

  const [loading, setLoading] = useState(false);
  const [requestID, setRequestID] = useState("");
  const [error, setError] = useState("");

  // Define the mapping of state codes to available request type options.
  const requestTypeOptions: { [key: string]: string[] } = {
    CCPA: ["Request to Correct", "Request to Delete", "Request to Know"],
    CPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    CTDPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    DPDPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    ICDPA: ["Access Request", "Appeal a Decision", "Deletion Request"],
    MCDPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    NDPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    NHPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    NJDPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    OCPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    TDPSA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
    UTCPA: ["Access Request", "Deletion Request"],
    VCDPA: ["Access Request", "Appeal a Decision", "Deletion Request", "Request to Correct"],
  };

  // Generic handleChange to update state; if the state field changes, reset requestType.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPolicyRequest((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" && { requestType: "" }),
    }));
  };

  // Simulate an API submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate a network call delay
    setTimeout(() => {
      // For simulation, we set a success rate of 80%
      if (Math.random() < 0.8) {
        setLoading(false);
        // Simulate receiving a request ID from the API
        setRequestID("GO6UI5AFL");
      } else {
        setLoading(false);
        setError("Your request could not be submitted. Please try again later.");
      }
    }, 2000);
  };

  // Get the request type options for the currently selected state.
  const currentRequestOptions = policyRequest.state
    ? requestTypeOptions[policyRequest.state] || []
    : [];

  // Reset function to allow submitting a new request
  const resetForm = () => {
    setPolicyRequest({
      state: "",
      requestType: "",
      firstName: "",
      lastName: "",
      email: "",
      organization: "",
    });
    setRequestID("");
    setError("");
  };


  return (
    <div className="p-6 bg-white space-y-6">
      <h2 className="text-2xl font-bold mb-4">Privacy Request</h2>
      <p className="text-gray-800 text-lg">
        Submit this form to make a Privacy Request. To exercise your right to opt-out
        of data selling/sharing, visit{" "}
        <Link
          to="../your-privacy-choices"
          style={{ color: primaryColor, textDecoration: "underline" }}
        >
          Your Privacy Choices
        </Link>
        . For additional information, please review our{" "}
        <Link
          to="/privacy"
          style={{ color: primaryColor, textDecoration: "underline" }}
        >
          Privacy Policy
        </Link>
        .
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 px-4 py-2 w-fit flex gap-3 items-center rounded bg-red-100">
           <Ban className="text-red-600 w-6 h-6"/>
           <p className="text-red-600 text-lg font-normal">
             {error}
            </p>
        </div>
      )}

      {/* Only show the form if not loading */}
      {requestID ? (
  <div className="submitted-form-response p-4 border rounded">
    <h4 className="text-2xl font-semibold mb-2">Your Deletion Request has been submitted.</h4>
    <p className="mb-2 text-lg">
      We have received your request. Our team will follow up within 10 business days.
    </p>
    <p className="mb-4 text-lg">
      Your request ID: <span className="font-bold">{requestID}</span>
    </p>
    <div className="button-confirm">
      <p className="confirm-button">
        <Button style={{background:primaryColor,color:accentColor,fontWeight:800}} onClick={()=> {resetForm()}}>Submit Another Request</Button>
      </p>
    </div>
  </div>
) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* State Field */}
          <div className="flex flex-col">
            <label htmlFor="state" className="mb-1 font-normal">
              State
            </label>
            <select
              id="state"
              name="state"
              required
              value={policyRequest.state}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded outline-none"
            >
              <option value="">Select a state</option>
              <option value="CCPA">California (CCPA)</option>
              <option value="CPA">Colorado (CPA)</option>
              <option value="CTDPA">Connecticut (CTDPA)</option>
              <option value="DPDPA">Delaware (DPDPA)</option>
              <option value="ICDPA">Iowa (ICDPA)</option>
              <option value="MCDPA">Montana (MCDPA)</option>
              <option value="NDPA">Nebraska (NDPA)</option>
              <option value="NHPA">New Hampshire (NHPA)</option>
              <option value="NJDPA">New Jersey (NJDPA)</option>
              <option value="OCPA">Oregon (OCPA)</option>
              <option value="TDPSA">Texas (TDPSA)</option>
              <option value="UTCPA">Utah (UTCPA)</option>
              <option value="VCDPA">Virginia (VCDPA)</option>
            </select>
          </div>

          {/* Request Type Field (disabled until a state is selected) */}
          <div className="flex flex-col">
            <label htmlFor="requestType" className="mb-1 font-normal">
              Request Type
            </label>
            <select
              id="requestType"
              name="requestType"
              required
              disabled={!policyRequest.state}
              value={policyRequest.requestType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded outline-none"
            >
              <option value="">
                {policyRequest.state ? "Select a request type" : "Select a state first"}
              </option>
              {currentRequestOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Conditional Deletion Confirmation */}
            {(policyRequest.requestType.toLowerCase().includes("delete") ||
              policyRequest.requestType.toLowerCase().includes("deletion")) && (
              <div className="mt-4">
                <p className="text-md text-black">
                  By submitting a Request to Delete, you are asking us to permanently erase any personal
                  information we have about you, including any information you have provided to us or that we have
                  collected in order to provide a product or service to you. Please confirm you would like us to
                  delete your personal information.
                </p>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="confirmDeletion"
                    name="confirmDeletion"
                    required
                    className="form-checkbox h-4 w-4"
                  />
                  <label htmlFor="confirmDeletion" className="ml-4 text-lg text-gray-700 select-none">
                    Yes, I confirm
                  </label>
                </div>
              </div>
            )}

            {/* Conditional "Know" and "Access" Confirmation */}
            {(policyRequest.requestType.toLowerCase().includes("know") ||
              policyRequest.requestType.toLowerCase().includes("access")) && (
              <div className="mt-4">
                <p className="text-md text-black">
                  I declare under penalty of perjury that the above information is true and correct and that I am
                  the person whose personal information is the subject of this request.
                </p>
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="confirmInfo"
                    name="confirmInfo"
                    required
                    className="form-checkbox h-4 w-4"
                  />
                  <label htmlFor="confirmInfo" className="ml-4 text-lg text-gray-700 select-none">
                    Yes, I confirm
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Name Fields */}
          <div className="flex flex-col sm:flex-row sm:gap-4">
            <div className="flex-1">
              <label htmlFor="firstName" className="mb-1 block font-normal">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={policyRequest.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="lastName" className="mb-1 block font-normal">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={policyRequest.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded outline-none"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-normal">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={policyRequest.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
          </div>

          {/* Company Field */}
          <div className="flex flex-col">
            <label htmlFor="organization" className="mb-1 font-normal">
              Which company have you interacted with?
            </label>
            <textarea
              id="organization"
              name="organization"
              rows={4}
              required
              value={policyRequest.organization}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              style={{ background: primaryColor }}
              className="py-2 px-6 text-white font-semibold rounded hover:bg-blue-700"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />: "Submit"}
            </button>
          </div>
        </form>
      )}
      {/* Alternative submission instructions */}
      <div>
        <p className="text-md text-gray-600">
          Other ways to submit a new Privacy Request:
        </p>
        <p className="text-md text-gray-600">
          <strong>Email:</strong>{" "}
          <span className="text-blue-600 underline">
            privacy@example.com
          </span>
        </p>
      </div>
    </div>
  );
};

export default MakeAPrivacyRequest;
