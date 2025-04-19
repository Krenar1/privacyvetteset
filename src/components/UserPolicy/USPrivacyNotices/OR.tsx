import React from "react";
import { Link, useOutletContext } from "react-router-dom";

interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}

const OR: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {

  return (
    <div className="px-2">
      <div>
        <p className="text-lg">
          This section provides additional information for Oregon residents under the Oregon Consumer Privacy Act (OCPA). The terms used in this section have the same meaning as in the OCPA. This section does not apply to information that is not considered "personal data," such as deidentified or publicly available information as defined in the OCPA.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Data “Selling” and Targeted Advertising
        </h3>
        <p className="text-lg">
          We "sell" certain personal data to third parties, as that term is defined in the OCPA, including Personal Identifiers, Internet Activity, Commercial Information, Financial Information, and Location Information.
        </p>
        <p className="text-lg">
          We process personal data for purposes of targeted advertising (as defined in the OCPA), including: Personal Identifiers, Internet Activity, Commercial Information, and Location Information. This allows us to show you ads that are more relevant to you.
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
          The OCPA gives consumers the right to opt out of automated profiling that produces legal or similarly significant effects, such as approval for a loan, employment, or insurance.
        </p>
        <p className="text-lg">
          We do not profile consumers in furtherance of decisions that produce legal or similarly significant effects.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">OCPA Rights</h3>
        <p className="text-lg">
          Your OCPA rights are described below.{" "}
          <Link
            to="../make-a-privacy-request"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Make a Privacy Request by clicking here
          </Link>.
        </p>

        <h4 className="text-[18px] my-2">Right to Access</h4>
        <p className="text-lg">
          You have the right to confirm whether we are processing personal data about you and to access such data. Where processing is carried out by automated means, you have the right to receive a copy of your personal data in a portable format.
        </p>
        <p className="text-lg">
          If you make an Access Request more than once in a 12-month period, or we determine the request is manifestly unfounded or excessive, we may require you to pay a small fee for this service.
        </p>

        <h4 className="text-[18px] my-2">Right to Obtain List of Third Parties</h4>
        <p className="text-lg">
          You have the right to obtain a list of the specific third parties to whom we have disclosed personal data. We have or may have disclosed personal data to the following third parties:
        </p>
        <ul className="list-disc pl-6 text-lg mb-4">
          <li>Freestar</li>
          <li>Google Ads</li>
          <li>Google Analytics</li>
          <li>Meta Ad Network</li>
          <li>Microsoft Ads</li>
          <li>PayPal – Pay with PayPal, Venmo, Pay Later</li>
        </ul>

        <h4 className="text-[18px] my-2">Right to Delete</h4>
        <p className="text-lg">
          You have the right to request that we delete any personal data provided by or obtained about you. We will permanently delete such data from our records and direct our processors to do so. However, we may retain your data if necessary for certain purposes as allowed by law.
        </p>
        <p className="text-lg">
          Any personal data retained for these purposes will not be processed for other purposes.
        </p>

        <h4 className="text-[18px] my-2">Right to Non-Discrimination</h4>
        <p className="text-lg">
          If you exercise your OCPA privacy rights, we will not discriminate against you by charging a different price or offering a different level or quality of products or services.
        </p>
        <p className="text-lg">
          We will not retaliate against you, as an employee, job applicant, or independent contractor, for exercising your privacy rights.
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
          You may authorize an agent to submit a Request to Opt-Out on your behalf, including through a web link, browser setting, or global device setting. We will comply if we can authenticate your identity and the agent’s authority.
        </p>

        <h4 className="text-[18px] my-2">Opt-Out Preference Signals</h4>
        <p className="text-lg">
          Your browser settings may allow you to automatically transmit an opt-out preference signal, such as the Global Privacy Control (GPC) signal, to online services you visit. When we detect such a signal, we add a U.S. Privacy String setting in your browser so that any third party that respects that signal will not track your activity. Your Request to Opt-Out will be linked only to your browser identifier.
          {" "}
          <Link
            to="https://globalprivacycontrol.org/"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            Find out how to enable GPC.
          </Link>
        </p>

        <h4 className="text-[18px] my-2">Right to Correct</h4>
        <p className="text-lg">
          You have the right to correct inaccuracies in your personal data, taking into account its nature and our purposes for processing it.
        </p>

        <h4 className="text-[18px] my-2">Authenticating Your Request</h4>
        <p className="text-lg">
          Once we receive your request, we will verify the information you provided. If we cannot authenticate your request, we may ask for additional information or deny your request.
        </p>

        <h4 className="text-[18px] my-2">Right to Appeal</h4>
        <p className="text-lg">
          If we decline to take action in response to any of your privacy requests, you have the right to appeal the decision within 90 days.{" "}
          <Link
            to="../make-a-privacy-request"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            To submit an appeal, click here
          </Link>{" "}
          and select "Appeal a Decision" in the drop-down.
        </p>
        <p className="text-lg">
          If you believe your rights have been violated, you may file a complaint with{" "}
          <Link
            to="https://justice.oregon.gov/consumercomplaints/"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            the Oregon Attorney General’s Office
          </Link>.
        </p>

        <h4 className="text-[18px] my-2">Contact Us</h4>
        <p className="text-lg">
          If you have any privacy-related questions or have trouble accessing this notice, please email{" "}
          <span
            style={{ color: primaryColor, textDecoration: "underline" }}
          >
            dev@ycavirp
          </span>.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">Notice of Financial Incentive</h3>
        <p className="text-lg">
          Consumers who sign up for our marketing emails/SMS texts receive a 10% discount on their first purchase. To opt in, a consumer must enter their email address/phone number and consent to receive emails in exchange for a discount via coupon code. A consumer may unsubscribe using the unsubscribe link in the email footer or by replying STOP via text. We calculate the value of the offer by using the expense related to it.
        </p>
      </div>
    </div>
  );
};

export default OR;
