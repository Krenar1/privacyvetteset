import React from "react";
import { Link, useOutletContext } from "react-router-dom";

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}
const UT: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {

  return (
    <div className="px-2">
      <div>
        <p className="text-lg">
          This section provides additional information for Utah residents under the Utah Consumer Privacy Act (UTCPA). The terms used in this section have the same meaning as in the UTCPA. This section does not apply to information that is not considered "personal data," such as deidentified, aggregated, or publicly available information as defined in the UTCPA.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">Data “Selling” and Targeted Advertising</h3>
        <p className="text-lg">
          We process personal data for purposes of targeted advertising (as defined in the UTCPA), including: Personal Identifiers, Internet Activity, Commercial Information, and Location Information. This allows us to show you ads that are more relevant to you.
        </p>
        <p className="text-lg">
          <Link
            to="../your-privacy-choices"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            You may opt-out of these data practices here
          </Link>.
        </p>
        <p className="text-lg">
          We do not receive monetary consideration in exchange for your data and therefore do not "sell" your data as defined in the UTCPA.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">UTCPA Rights</h3>
        <p className="text-lg">
          Your UTCPA rights are described below.{" "}
          <Link
            to="../make-a-privacy-request"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Make a Privacy Request by clicking here
          </Link>.
        </p>

        <h4 className="text-[18px] my-2">Right to Access</h4>
        <p className="text-lg">
          You have the right to confirm whether we are processing personal data about you and to access such data. Where processing is carried out by automated means, you have a right to receive a copy of your personal data in a portable and readily usable format that allows you to transmit your data to another controller.
        </p>
        <p className="text-lg">
          If you make an Access Request more than once in a 12-month period, or the request is manifestly unfounded or excessive, or it is part of an organized effort to harass, disrupt, or place undue burden on our business, we may require you to pay a small fee for this service.
        </p>

        <h4 className="text-[18px] my-2">Right to Delete</h4>
        <p className="text-lg">
          You have the right to request that we delete any personal data you have provided to us. Subject to certain limitations, we will permanently delete any such personal data from our records and direct our processors to do the same.
        </p>

        <h4 className="text-[18px] my-2">Right to Non-Discrimination</h4>
        <p className="text-lg">
          If you exercise your UTCPA privacy rights, we will not discriminate against you by, for example, charging a different price or offering a different level or quality of products or services.
        </p>
        <p className="text-lg">
          We will not retaliate against you, as an employee, applicant for employment, or independent contractor, for exercising your privacy rights.
        </p>

        <h4 className="text-[18px] my-2">Right to Opt-Out</h4>
        <p className="text-lg">
          Sale of Personal Data:<br />
          We do not sell your personal data, as defined by the UTCPA.
        </p>
        <p className="text-lg">
          Targeted Advertising:<br />
          <Link
            to="../your-privacy-choices"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Exercise your right to opt-out here
          </Link>.
        </p>

        <h4 className="text-[18px] my-2">Authorized Agent</h4>
        <p className="text-lg">
          You may authorize an agent to submit a Request to Opt-Out on your behalf, including through a technology such as a web link, browser setting, or global device setting. We will comply with such requests if we are able to authenticate your identity and the agent’s authority to act on your behalf.
        </p>

        <h4 className="text-[18px] my-2">Opt-Out Preference Signals</h4>
        <p className="text-lg">
          Your browser settings may allow you to automatically transmit an opt-out preference signal, such as the Global Privacy Control (GPC) signal, to online services you visit. When we detect such a signal, we add a U.S. Privacy String setting in your browser so that any third party that respects that signal will not track your activity. Your Request to Opt-Out will be linked to your browser identifier only and not linked to any account information because the connection between your browser and the account is not known to us. GPC is supported by certain internet browsers or as a browser extension.{" "}
          <Link
            to="https://globalprivacycontrol.org/"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Find out how to enable GPC.
          </Link>
        </p>

        <h4 className="text-[18px] my-2">Authenticating Your Request</h4>
        <p className="text-lg">
          Once we receive your request, we will verify the information you provided by matching the information that we have collected. If we cannot authenticate your request, we may ask for additional information from you. If you are unable to provide additional information, or we are unable to authenticate the request using commercially reasonable efforts, we may deny your request.
        </p>
        <p className="text-lg">
          If you believe your rights have been violated and you are not able to resolve the issue directly with us, you may file a complaint with{" "}
          <Link
            to="https://dcp.utah.gov/"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            the Utah Division of Consumer Protection
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default UT;
