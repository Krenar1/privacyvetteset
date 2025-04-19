import React, { createContext, useState, useContext, ReactNode } from "react";
import { Shield, Flag, Mail, User, Icon, ShieldIcon } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

// (Context providers remain unchanged)
interface USPrivacyStateContextType {
  selectedState: string;
  setSelectedState: React.Dispatch<React.SetStateAction<string>>;
}

const defaultState = sessionStorage.getItem("state") || "CA";

const USPrivacyStateContext = createContext<USPrivacyStateContextType | undefined>(undefined);

export const USPrivacyStateProvider = ({ children }: { children: ReactNode }) => {
  const [selectedState, setSelectedState] = useState<string>(defaultState);
  return (
    <USPrivacyStateContext.Provider value={{ selectedState, setSelectedState }}>
      {children}
    </USPrivacyStateContext.Provider>
  );
};

export const useUSPrivacyState = () => {
  const context = useContext(USPrivacyStateContext);
  if (!context) {
    throw new Error("useUSPrivacyState must be used within a USPrivacyStateProvider");
  }
  return context;
};

interface PolicyRequest {
  state: string;
  requestType: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
}

interface PrivacyRequestContextType {
  policyRequest: PolicyRequest;
  setPolicyRequest: React.Dispatch<React.SetStateAction<PolicyRequest>>;
}

const defaultPolicyRequest: PolicyRequest = {
  state: "",
  requestType: "",
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
};

const PrivacyRequestContext = createContext<PrivacyRequestContextType | undefined>(undefined);

export const PrivacyRequestProvider = ({ children }: { children: ReactNode }) => {
  const [policyRequest, setPolicyRequest] = useState<PolicyRequest>(defaultPolicyRequest);
  return (
    <PrivacyRequestContext.Provider value={{ policyRequest, setPolicyRequest }}>
      {children}
    </PrivacyRequestContext.Provider>
  );
};

export const usePrivacyRequest = () => {
  const context = useContext(PrivacyRequestContext);
  if (!context) {
    throw new Error("usePrivacyRequest must be used within a PrivacyRequestProvider");
  }
  return context;
};

interface PrivacyPolicyPageProps {
  primaryColor: string;
  accentColor: string;
  logoURL: string;
  name: string;
  hipaa: boolean;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  primaryColor,
  accentColor,
  logoURL,
  name,
  hipaa,
}) => {
  const sharedData = {
    mainColor: primaryColor,
    secondaryColor: accentColor,
  };
  if (sessionStorage.getItem("state")) {
    sessionStorage.setItem("state", "CA");
  }

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    "flex items-center gap-2 p-3 rounded-md font-bold text-lg cursor-pointer " +
    (isActive ? "text-white" : "text-gray-500 hover:bg-[whitesmoke]");

  const getLinkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? { backgroundColor: "whitesmoke", color: "#00aeef" } : {};

  return (
    <div className="mx-auto relative flex flex-col justify-between">
      <div className="">
      <div className="flex items-center relative top-0 bg-white shadow space-x-4 px-4 py-3 z-[100] flex md:hidden">
    <img src={logoURL} alt="Logo" className="w-18 max-h-16 object-contain" />
    <h1
      className="md:text-3xl text-2xl font-bold"
      style={{ color: sharedData.mainColor }}
    >
      {name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </h1>
  </div>
        
        <div className="flex flex-col md:flex-row-reverse min-h-screen">
          {/* Left Navigation */}
          <nav className="md:w-1/4 lg:w-1/5 md:h-screen mb-0 p-4 flex flex-col justify-between shadow z-[100]">
            <ul className="flex flex-col md:gap-4 gap-1">
              <li>
                {/* Use end (or empty string for the index route) so it matches only the index */}
                <NavLink end to={{ pathname: "." }} className={getLinkClass} style={getLinkStyle}>
                  <Shield className="h-5 w-5 h-4 md:flex" />
                  <span className="lg:text-[16px] md:text-[15px] text-[14px] md:leading-none leading-[14px]">
                    Privacy Policy
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{
                    pathname: "us-privacy-notices",
                    hash: `#${sessionStorage.getItem("state") || "CA"}`,
                  }}
                  className={getLinkClass}
                  style={getLinkStyle}
                >
                  <Flag className="w-5 h-5 md:flex" />
                  <span className="lg:text-[16px] md:text-[15px] text-[14px] md:leading-none leading-[14px]">
                    US Privacy Notices
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink to={{ pathname: "gdpr" }} className={getLinkClass} style={getLinkStyle}>
                  <Flag className="h-5 w-5 h-4 md:flex" />
                  <span className="lg:text-[16px] md:text-[15px] text-[14px] md:leading-none leading-[14px]">
                    GDPR Notices
                  </span>
                </NavLink>
              </li>
              {hipaa ? (
                <li>
                  <NavLink
                    to={{ pathname: "hipaa" }}
                    className={getLinkClass}
                    style={getLinkStyle}
                  >
                    <Flag className="h-5 w-5 h-4 md:flex" />
                    <span className="lg:text-[16px] md:text-[15px] text-[14px] md:leading-none leading-[14px]">
                      HIPAA Notices
                    </span>
                  </NavLink>
                </li>
              ) : null}
              <li>
                <NavLink
                  to={{ pathname: "make-a-privacy-request" }}
                  className={getLinkClass}
                  style={getLinkStyle}
                >
                  <Mail className="h-6 w-6 h-4 md:flex " />
                  <span className="lg:text-[16px] md:text-[15px] text-[14px] md:leading-none leading-[14px]">
                    Make a Privacy Request
                  </span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={{ pathname: "your-privacy-choices" }}
                  className={getLinkClass}
                  style={getLinkStyle}
                >
                  <User className="h-6 w-6 h-4 md:flex " />
                  <span className="lg:text-[16px] md:text-[15px] text-[14px] md:leading-none leading-[14px]">
                    Your Privacy Choices
                  </span>
                </NavLink>
              </li>
            </ul>
            <footer className="items-center pt-3 relative w-full hidden md:flex">
        <Link to="https://www.privacyvet.com/" className="flex flex-row items-center">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldIcon className="text-white" width={20} height={20} />
          </div>
          <span className="text-sm font-medium text-gray-700 ml-4">Powered by Privacyvet</span>
        </Link>
      </footer>
          </nav>
          <div className="md:w-3/4 lg:w-4/5 relative md:h-screen overflow-y-auto scrollbar-left">
  {/* sticky (not fixed) header inside the scroll area */}
  <div className="flex items-center sticky top-0 bg-white shadow space-x-4 px-4 py-3 z-10 hidden md:flex">
    <img src={logoURL} alt="Logo" className="w-18 max-h-16 object-contain" />
    <h1
      className="md:text-3xl text-2xl font-bold"
      style={{ color: sharedData.mainColor }}
    >
      {name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </h1>
  </div>

  {/* scrollable content */}
  <PrivacyRequestProvider>
    <USPrivacyStateProvider>
      <Outlet />
    </USPrivacyStateProvider>
  </PrivacyRequestProvider>
</div><footer className=" flex items-center p-3 py-2 relative w-full md:hidden border-t">
        <Link to="https://www.privacyvet.com/" className="flex flex-row items-center">
          <div className="bg-primary p-2 rounded-lg">
            <ShieldIcon className="text-white" width={20} height={20} />
          </div>
          <span className="text-sm font-medium text-gray-700 ml-4">Powered by Privacyvet</span>
        </Link>
      </footer> 
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
