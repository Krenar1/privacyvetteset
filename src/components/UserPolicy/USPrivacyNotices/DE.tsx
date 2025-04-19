import React from "react";
import { Link, useOutletContext } from "react-router-dom";

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}

const DE: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {

  return (
    <div className="px-2">
      <div>
        <p className="text-lg">
          This section provides additional information for Delaware residents under the Delaware Personal Data Privacy Act (DPDPA). The terms used in this section have the same meaning as in the DPDPA. This section does not apply to information that is not considered "personal data," such as deidentified or publicly available information as defined in the DPDPA.
        </p>
        <p className="text-lg">
          If you have any questions or wish to contact us regarding this privacy notice, please send an email to{" "}
          <Link
            to="mailto:privacy@yourdomain.com"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            privacy@yourdomain.com
          </Link>.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Data "Selling" and Targeted Advertising
        </h3>
        <p className="text-lg">
          We "sell" certain personal data to third parties, as that term is defined in the DPDPA, including Personal Identifiers, Internet Activity, Commercial Information, Financial Information, and Location Information.
        </p>
        <p className="text-lg">
          We process personal data for purposes of targeted advertising (as defined in the DPDPA), including: Personal Identifiers, Internet Activity, Commercial Information, and Location Information. This allows us to show you ads that are more relevant to you.
        </p>
        <p className="text-lg">
          <Link
            to="../your-privacy-choices"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            You may opt-out of these data practices here
          </Link>.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">Profiling</h3>
        <p className="text-lg">
          We do not profile consumers in furtherance of decisions that produce legal or similarly significant effects.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">DPDPA Rights</h3>
        <p className="text-lg">
          Your DPDPA rights are described below.{" "}
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
          If you make an Access Request more than once in a 12-month period, we may require you to pay a small fee for this service.
        </p>

        <h4 className="text-[18px] my-2">Right to Delete</h4>
        <p className="text-lg">
          You have the right to request that we delete any personal data provided by or obtained about you. We will permanently delete any such personal data from our records and direct our processors to do so. However, we may retain your personal data if it is necessary for certain purposes, as allowed by law.
        </p>
        <p className="text-lg">
          Any personal data retained for these purposes will not be processed for other purposes.
        </p>

        <h4 className="text-[18px] my-2">Right to Non-Discrimination</h4>
        <p className="text-lg">
          If you exercise your DPDPA privacy rights, we will not discriminate against you by, for example, charging a different price or offering a different level or quality of products or services.
        </p>
        <p className="text-lg">
          We will not retaliate against you, as an employee, applicant for employment, or independent contractor, for exercising your privacy rights.
        </p>

        <h4 className="text-[18px] my-2">Right to Opt-Out</h4>
        <p className="text-lg">
          Sale of Personal Data:<br />
          <Link
            to="../your-privacy-choices"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Exercise your right to opt-out here
          </Link>.
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
        <p className="text-lg">
          Profiling:<br />
          We do not profile consumers in furtherance of decisions that produce legal or similarly significant effects.
        </p>

        <h4 className="text-[18px] my-2">Authorized Agent</h4>
        <p className="text-lg">
          You may authorize an agent to submit a Request to Opt-Out on your behalf, including through a technology such as a web link, browser setting, or global device setting. We will comply with such requests if we are able to authenticate your identity and the agent&apos;s authority to act on your behalf.
        </p>

        <h4 className="text-[18px] my-2">Opt-Out Preference Signals</h4>
        <p className="text-lg">
          Your browser settings may allow you to automatically transmit an opt-out preference signal, such as the Global Privacy Control (GPC) signal, to online services you visit. When we detect such a signal, we place a U.S. Privacy String setting in your browser so that any third party who respects that signal will not track your activity on our website. Your Request to Opt-Out will be linked to your browser identifier only and not linked to any account information because the connection between your browser and the account is not known to us. GPC is supported by certain internet browsers or as a browser extension.{" "}
          <a
            href="https://globalprivacycontrol.org/"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Find out how to enable GPC.
          </a>
        </p>

        <h4 className="text-[18px] my-2">Right to Correct</h4>
        <p className="text-lg">
          You have the right to correct inaccuracies in your personal data, taking into account the nature of the data and our purposes for processing it.
        </p>

        <h4 className="text-[18px] my-2">Right to List of Third Parties</h4>
        <p className="text-lg">
          You have the right to obtain a list of the categories of third parties to whom we have disclosed your personal data. Please see the "How We Disclose Your Personal Information" section above for this information.
        </p>

        <h4 className="text-[18px] my-2">Authenticating Your Request</h4>
        <p className="text-lg">
          Once we receive your request, we will verify the information you provided by matching the information that we have collected. If we cannot authenticate your request, we may ask for additional information from you. If you are unable to provide additional information, or we are unable to authenticate the request using commercially reasonable efforts, we may deny your request. Authentication is not required for a Request to Opt-Out, but we may deny the request if we have a good faith, reasonable, and documented belief that the request is fraudulent.
        </p>

        <h4 className="text-[18px] my-2">Right to Appeal</h4>
        <p className="text-lg">
          If we decline to take action in response to any of your privacy requests, you have the right to appeal that decision within a reasonable amount of time, but no later than 90 days from the date of our decision.{" "}
          <Link
            to="../make-a-privacy-request"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            To submit a request for appeal, click here
          </Link>{" "}
          and select "Appeal a Decision" in the request type drop-down.
        </p>
        <p className="text-lg">
          If you believe your rights have been violated and you are not able to resolve the issue directly with us, you may file a complaint with{" "}
          <a
            href="https://attorneygeneral.delaware.gov/fraud/cmu/complaint/"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            the Delaware Attorney General&apos;s Office
          </a>.
        </p>
      </div>
    </div>
  );
};

export default DE;
