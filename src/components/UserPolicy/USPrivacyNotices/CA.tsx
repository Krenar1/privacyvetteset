import React from "react";
import { Link, useOutletContext } from "react-router-dom";


interface PrivacyPolicySectionProps {
  primaryColor: string; 
  accentColor: string; 
}
const CA: React.FC<PrivacyPolicySectionProps> = ({ primaryColor, accentColor }) => {

  return (
    <div className="content content--with-max-width state-content sm:px-2">
      <div>
        <p className="text-lg">
          This section provides additional information for California residents
          under the California Consumer Privacy Act (CCPA). The terms used in this
          section have the same meaning as in the CCPA. This section does not apply
          to information that is not considered "personal information," such as
          anonymous, deidentified, or aggregated information, nor does it apply to
          publicly available information as defined in the CCPA.
        </p>
        <p className="text-lg">
          To the extent we process deidentified personal information, we will make no
          attempt to reidentify such data.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Information we collect from you
        </h3>
        <p className="text-lg">
          We collect the personal information you provide to us when you purchase our
          products or visit our website. The categories of information we may collect
          include:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
  <li>
    Personal Identifiers, including name, email address, postal address,
    telephone number, and online Identifiers
  </li>
  <li>Internet Activity</li>
  <li>Commercial Information, including purchases</li>
  <li>
    Financial Information, including credit or debit card number
  </li>
  <li>
    Location Information, including general location data
  </li>
</ul>

        <p className="text-lg">
          To the extent we process deidentified personal information, we will make no
          attempt to reidentify such data.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          How long we keep your data
        </h3>
        <p className="text-lg">
          We do not retain data for any longer than is necessary for the purposes described
          in this Policy.
        </p>
        <p className="text-lg">
          We generally retain data according to the guidelines below.
        </p>

        <table className="min-w-full border-collapse rounded-lg mt-6 mb-3">
  <caption className="sr-only">Data Retention</caption>
  <thead>
    <tr className="border border-[2px] border-gray-50">
      <th
        scope="col"
        className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px] align-top"
      >
        Type of Data
      </th>
      <th
        scope="col"
        className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px] align-top"
      >
        Retention Period
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Cookies and online data we collect while you use our website, including
        Online Identifiers, Internet Activity, General location data
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        We delete or anonymize data concerning your use of our website within
        2 years of collecting it.
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data we collect in order to process and ship orders you place with us,
        including Name, Email address, Postal address, Telephone number, Purchases,
        Credit or debit card number
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        We retain records related to process and ship orders as long as necessary
        to maintain order history.
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data we collect when you contact us for customer support and other inquiries,
        including Name, Email address, Telephone number, Purchases
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        We keep customer feedback and correspondence with our customer service for
        up to 2 years to help us respond to any questions or complaints. We may keep
        data beyond this period in anonymized form.
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data we collect when you sign up for promotional and marketing communications,
        including Name, Email address, Postal address, Telephone number, Online
        Identifiers, Internet Activity, Purchases
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Where you have signed up to receive promotional and marketing communications
        from us, we will retain any data collected until you opt out or request its
        deletion. We may keep data beyond this period in anonymized form. We will further
        retain a record of any opt-outs in order to prevent sending you future communications.
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data we collect when you review our products, answer surveys, or send feedback,
        including Name, Email address, Purchases
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        We retain review, survey, and feedback data for up to 10 years following your
        last contact with us. We may keep data beyond this period in anonymized form to help
        improve our products and services.
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data we collect in connection with privacy requests, including Name, Email
        address, Online Identifiers
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        We retain records related to privacy requests as long as necessary to comply with
        our legal obligations.
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data we collect for security purposes, including Name, Email address, Online
        Identifiers
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        We retain security-related data as long as necessary to comply with our legal
        obligations and to maintain and improve our information security measures.
      </td>
    </tr>
  </tbody>
</table>


        <h3 className="text-[24px] mt-4 mb-2">
          Why we process your information
        </h3>
        <p className="text-lg">
          We process personal information for the following business and commercial purposes:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Analyzing Data</li>
          <li>Delivering Targeted Ads</li>
          <li>Fulfilling Customer Orders</li>
          <li>Improving our Products &amp; Services</li>
          <li>Internal Business Operations</li>
          <li>Marketing Our Products &amp; Services</li>
          <li>Meeting Compliance &amp; Legal Requirements</li>
          <li>Operating Our Website or Mobile Apps</li>
          <li>Processing Payments</li>
          <li>Providing Customer Support</li>
          <li>Providing Cybersecurity</li>
          <li>Sending Promotional Communications</li>
          <li>Storing and Managing Data</li>
          <li>Tracking Purchases &amp; Customer Data</li>
        </ul>

        <h3 className="text-[24px] mt-4 mb-2">
          How we disclose your information
        </h3>
        <p className="text-lg">
          We may disclose personal information about you for business and commercial purposes
          when you purchase our products or visit our website:
        </p>
        <table className="min-w-full border-collapse rounded-lg mt-6 mb-3">
  <caption className="sr-only">Data Disclosure</caption>
  <thead>
    <tr className="border border-[2px] border-gray-50">
      <th
        scope="col"
        className="font-[600] bg-gray-50 px-4 py-2 text-left md:w-1/3 sm:w-1/4 w-1/5 md:text-[16px] sm:text-[13px] text-[12px] align-top"
      >
        Personal Information Category
      </th>
      <th
        scope="col"
        className="font-[600] bg-gray-50 px-4 py-2 text-left md:w-1/3 sm:w-2/4 w-3/5 md:text-[16px] sm:text-[13px] text-[12px] align-top"
      >
        Categories of Service Providers
      </th>
      <th
        scope="col"
        className="font-[600] bg-gray-50 px-4 py-2 text-left md:w-1/3 sm:w-1/4 w-1/5 md:text-[16px] sm:text-[13px] text-[12px] align-top"
      >
        Categories of Third Parties
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Personal Identifiers
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Business Operations Tool, Collaboration &amp; Productivity Tools, Commerce Software Tools,
        Contractors, Cybersecurity Providers, Data Analytics Providers, Governance, Risk &amp;
        Compliance Software, IT Infrastructure Services, Payment Processors, and Sales &amp;
        Marketing Tools
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Ad Networks and Data Analytics Providers
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Internet Activity
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Commerce Software Tools, Cybersecurity Providers, Data Analytics Providers, and Sales &amp;
        Marketing Tools
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Ad Networks and Data Analytics Providers
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Commercial Information
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Business Operations Tool, Collaboration &amp; Productivity Tools, Commerce Software Tools,
        Contractors, Data Analytics Providers, Payment Processors, and Sales &amp; Marketing Tools
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Ad Networks, Data Analytics Providers, and Payment Processors
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Financial Information
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Business Operations Tool, Collaboration &amp; Productivity Tools, Commerce Software Tools,
        Contractors, Data Analytics Providers, Payment Processors, and Sales &amp; Marketing Tools
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Data Analytics Providers and Payment Processors
      </td>
    </tr>
    <tr>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Location Information
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Business Operations Tool, Commerce Software Tools, and Data Analytics Providers
      </td>
      <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
        Ad Networks and Data Analytics Providers
      </td>
    </tr>
  </tbody>
</table>


        <h3 className="text-[24px] mt-4 mb-2">
          Information “sharing” and “selling”
        </h3>
        <p className="text-lg">
          We “share” certain personal information with third party ad networks for purposes of
          behavioral advertising, including: Personal Identifiers, Internet Activity, Commercial
          Information, and Location Information. This allows us to show you ads that are more
          relevant to you.
        </p>
        <p className="text-lg">
          We "sell" certain personal data to third parties, as that term is defined in the CCPA,
          including Personal Identifiers, Internet Activity, Commercial Information, Financial
          Information, and Location Information.
        </p>
        <p className="text-lg">
          <Link to="../your-privacy-choices" style={{ color: primaryColor, textDecoration: "underline" }}>You may opt-out of these data practices here</Link>.
        </p>
        <p className="text-lg">
          We do not knowingly sell or share (for cross-context behavioral advertising) the
          personal information of consumers under 16 years of age.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Opt-out preference signals
        </h3>
        <p className="text-lg">
          Your browser settings may allow you to automatically transmit an opt-out preference
          signal, such as the Global Privacy Control (GPC) signal, to online services you visit.
          When we detect such signal, we place a U.S. Privacy String setting in your browser so that
          any third party who respects that signal will not track your activity on our website.
          Your request to opt-out of sale/sharing will be linked to your browser identifier only and
          not linked to any account information because the connection between your browser and the
          account is not known to us. GPC is supported by certain internet browsers or as a browser
          extension. <Link to="https://globalprivacycontrol.org/" style={{ color: primaryColor, textDecoration: "underline" }}>Find out how to enable GPC</Link>.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Your CCPA rights
        </h3>
        <p className="text-lg">
          Your privacy rights under the CCPA are described below. <Link to="../make-a-privacy-request" style={{ color: primaryColor, textDecoration: "underline" }}>Make a Privacy Request by clicking here</Link>{" "}
          or by emailing us at {" "}
            <span style={{ color: primaryColor, textDecoration: "underline" }}>dev@ycavirp</span>.
        </p>

        <h4 className="text-[18px] my-2">
          Right to Access
        </h4>
        <p className="text-lg">
          You have the right to access the specific pieces of personal information we have
          collected about you.
        </p>
        <p className="text-lg">
          If you make an Access Request more than twice in a 12-month period, or we determine the request is manifestly unfounded or excessive, we may require you to pay a small fee for this service.
        </p>

        <h4 className="text-[18px] my-2">
          Right to Delete
        </h4>
        <p className="text-lg">
          You have the right to request that we delete any personal information about you that you have provided to us. Subject to certain limitations, we will delete your personal information from our records and notify our service providers, contractors, and third parties that you have requested deletion of your personal information.
        </p>

        <h4 className="text-[18px] my-2">
          Right to Non-Discrimination
        </h4>
        <p className="text-lg">
          If you exercise your CCPA privacy rights, we will not discriminate against you by, for example, charging a different price or offering a different level or quality of products or services.
        </p>
        <p className="text-lg">
          We will not retaliate against you, as an employee, applicant for employment, or independent contractor, for exercising your privacy rights.
        </p>

        <h4 className="text-[18px] my-2">
          Right to Opt-Out
        </h4>
        <p className="text-lg">You have the right to opt-out of any selling and sharing of your personal information.</p>
        <p className="text-lg">
        <Link to="../your-privacy-choices" style={{ color: primaryColor, textDecoration: "underline" }}>You may exercise your right to opt-out here</Link>.
        
        </p>

        <h4 className="text-[18px] my-2">
          Right to Correct
        </h4>
        <p className="text-lg">
          You have the right to correct inaccuracies in your personal data, taking into account the nature of the data and our purposes for processing it.
        </p>

        <h4 className="text-[18px] my-2">
          Right to Limit the Use of Sensitive Personal Information
        </h4>
        <p className="text-lg">
          The Right to Limit does not apply because we do not use your sensitive personal information to infer characteristics about you.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Request Verification
        </h3>
        <p className="text-lg">
          Before we can respond to a privacy request, we will verify that you are the consumer who is the subject of the CCPA request. Requests to Opt-Out or Limit the Use of Sensitive Data (if applicable) do not require verification.
        </p>
        <p className="text-lg">
          Typically, identity verification will require you to confirm certain information about yourself based on information we have already collected. For example, we will ask you to verify that you have access to the email address we have on file for you. If we cannot verify your identity based on our records, we cannot fulfill your CCPA request.
        </p>

        <h4 className="text-[18px] my-2">
          Authorized Agent
        </h4>
        <p className="text-lg">
          A California resident's authorized agent may submit a rights request under the CCPA by emailing us at 
            moc.aidemefilemoh@ycavirp. 
            Requests submitted by an authorized agent will still require verification of the consumer who is the subject of the request in accordance with the process described above. We will also ask for proof that the consumer who is the subject of the request authorized an agent to submit a privacy request on their behalf by either verifying their own identity with us directly or directly confirming with us that they provided the authorized agent permission to submit the request. An authorized agent that has power of attorney pursuant to California Probate Code section 4121 to 4130 may also submit proof of statutory power of attorney, which does not require separate consumer verification.
        </p>
        <p className="text-lg">
          If you have trouble accessing this notice, please contact us at
            moc.aidemefilemoh@ycavirp.
        </p>

        <h4 className="text-[18px] my-2">
          Contact Us
        </h4>
        <p className="text-lg">
          If you have any privacy-related questions or have trouble accessing this notice, please email 
            moc.aidemefilemoh@ycavirp.
        </p>

        <h3 className="text-[24px] mt-4 mb-2">
          Notice of Financial Incentive
        </h3>
        <p className="text-lg">
          Consumers who sign up for our marketing emails/SMS texts receive a 10% discount on their first purchase. To opt in, a consumer must enter their email address/phone number into the form and consent to receive emails in exchange for a discount provided via coupon code. A consumer may unsubscribe from our marketing emails by using the unsubscribe link in the email footer/replying STOP via text at any time. We calculate the value of the offer and financial incentive by using the expense related to the offer.
        </p>
      </div>
    </div>
  );
};

export default CA;
