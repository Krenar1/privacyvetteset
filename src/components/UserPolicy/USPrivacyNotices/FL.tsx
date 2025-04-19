import React from "react";
import { useOutletContext } from "react-router-dom";

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}

const FL: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {

  return (
    <div className="px-2">
      <div>
        <p className="text-lg">
          This section provides additional information for Florida residents under the Florida Digital Bill of Rights (FDBR). The terms used in this section have the same meaning as in the FDBR.
        </p>
        <p className="text-lg">
          We do not sell your sensitive personal data.
        </p>
      </div>
    </div>
  );
};

export default FL;
