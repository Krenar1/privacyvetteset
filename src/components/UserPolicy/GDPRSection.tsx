import React from "react";
import { Link } from "react-router-dom";

interface GDPRSectionProps {
  primaryColor: string;
  accentColor: string;
}

const GDPRSection: React.FC<GDPRSectionProps> = ({ primaryColor, accentColor }) => {
  return (
    <div className="content content--with-max-width state-content p-6">
      <div>
        {/* Main Heading styled with accent color */}
        <h2 className="md:text-2xl text-xl mb-4 w-fit py-1 font-bold rounded-lg">
          GDPR – General Data Protection Regulation
        </h2>

        {/* Introduction */}
        <p className="text-lg">
          This section provides comprehensive information for European residents regarding the General Data Protection Regulation (GDPR). It explains how we collect, process, and safeguard your personal data in compliance with EU law. The terms used herein have the meanings provided by the GDPR.
        </p>
        <p className="text-lg">
          We are fully committed to ensuring your privacy and protecting your data. Our practices are designed to maintain transparency, fairness, and accountability in all data processing activities.
        </p>

        {/* Principles of Data Protection */}
        <h3 className="text-[24px] mt-4 mb-2">Principles of Data Protection</h3>
        <p className="text-lg">
          In line with the GDPR, we adhere to the following key principles when processing personal data:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li><span className="font-semibold">Lawfulness, Fairness, and Transparency:</span> Your data is processed in a lawful, fair, and transparent manner.</li>
          <li><span className="font-semibold">Purpose Limitation:</span> Data is collected only for specified, explicit, and legitimate purposes.</li>
          <li><span className="font-semibold">Data Minimization:</span> We limit data collection to what is necessary.</li>
          <li><span className="font-semibold">Accuracy:</span> We take reasonable steps to ensure your data is accurate and up-to-date.</li>
          <li><span className="font-semibold">Storage Limitation:</span> Data is retained only as long as necessary for its intended purpose.</li>
          <li><span className="font-semibold">Integrity and Confidentiality:</span> We ensure appropriate security for your data.</li>
        </ul>

        {/* Information We Collect */}
        <h3 className="text-[24px] mt-4 mb-2">Information We Collect</h3>
        <p className="text-lg">
          We collect the personal data you voluntarily provide when interacting with our website and services. The categories of data we gather include:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Personal Identifiers (name, date of birth, government-issued IDs)</li>
          <li>Contact Information (email address, telephone number, postal address)</li>
          <li>Online Identifiers (IP addresses, cookie identifiers, device IDs)</li>
          <li>Usage Data (browsing behavior, website interactions, preferences)</li>
          <li>Financial Data (payment details, billing information)</li>
          <li>Geolocation Data (approximate location from your IP or device settings)</li>
        </ul>

        {/* Legal Basis for Processing */}
        <h3 className="text-[24px] mt-4 mb-2">Legal Basis for Processing</h3>
        <p className="text-lg">
          We process your personal data based on one or more of the following legal bases as provided under the GDPR:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>
            <span className="font-semibold">Consent:</span> Where you have provided explicit consent for specific processing activities.
          </li>
          <li>
            <span className="font-semibold">Contractual Necessity:</span> When processing is required to perform a contract to which you are a party.
          </li>
          <li>
            <span className="font-semibold">Legal Obligation:</span> To comply with our legal obligations under EU or member state law.
          </li>
          <li>
            <span className="font-semibold">Legitimate Interests:</span> When processing is necessary for our legitimate business interests,
            provided those interests are not overridden by your rights and freedoms.
          </li>
        </ul>

        {/* How We Process Your Data */}
        <h3 className="text-[24px] mt-4 mb-2">How We Process Your Data</h3>
        <p className="text-lg">
          Your personal data is used to:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Provide and manage our services</li>
          <li>Process transactions and fulfill orders</li>
          <li>Enhance and personalize your experience on our website</li>
          <li>Respond to inquiries and provide customer support</li>
          <li>Send marketing communications, if you have opted-in</li>
          <li>Conduct analytics to improve our products and services</li>
          <li>Meet our legal and regulatory obligations</li>
        </ul>

        {/* Data Retention */}
        <h3 className="text-[24px] mt-4 mb-2">How Long We Keep Your Data</h3>
        <p className="text-lg">
          We retain your personal data only for as long as is necessary to fulfill the purposes for which it was collected or as required by applicable law. The table below summarizes our typical data retention practices:
        </p>
        <table className="min-w-full border-collapse rounded-lg mt-6 mb-3">
          <caption className="sr-only">Data Retention</caption>
          <thead>
            <tr className="border border-[2px] border-gray-50">
              <th scope="col" className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px]">
                Type of Data
              </th>
              <th scope="col" className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px]">
                Retention Period
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Website usage data (cookies, IP addresses)
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Up to 24 months or anonymized thereafter.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Order and transaction records
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                As long as necessary for order fulfillment and legal obligations.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Customer support and inquiry communications
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Typically retained for up to 24 months.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Marketing communication records
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Until you opt-out or request deletion.
              </td>
            </tr>
          </tbody>
        </table>

        {/* Data Transfers & International Transfers */}
        <h3 className="text-[24px] mt-4 mb-2">Data Transfers & International Transfers</h3>
        <p className="text-lg">
          If we transfer your personal data outside the European Economic Area (EEA), we implement appropriate safeguards to ensure an adequate level of protection. These measures include:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Standard Contractual Clauses approved by the European Commission</li>
          <li>Binding Corporate Rules (BCRs) for intra-group transfers</li>
          <li>Ensuring the recipient is subject to comparable data protection laws</li>
        </ul>

        {/* Data Security & Breach Notification */}
        <h3 className="text-[24px] mt-4 mb-2">Data Security & Breach Notification</h3>
        <p className="text-lg">
          Protecting your data is our priority. We use robust technical and organizational measures to secure your personal data. In the unlikely event of a data breach, we will:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Notify the relevant supervisory authority within the prescribed time limit</li>
          <li>Inform affected individuals when there is a high risk to their rights and freedoms</li>
          <li>Take immediate action to mitigate any potential harm</li>
        </ul>

        {/* Your Rights Under GDPR */}
        <h3 className="text-[24px] mt-4 mb-2">Your Rights Under the GDPR</h3>
        <p className="text-lg">
          Under the GDPR, you have enhanced rights regarding the processing of your personal data. These rights include:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li><span className="font-semibold">Right of Access:</span> To obtain confirmation and access to your personal data.</li>
          <li><span className="font-semibold">Right to Rectification:</span> To have inaccurate or incomplete data corrected.</li>
          <li><span className="font-semibold">Right to Erasure:</span> Also known as the “right to be forgotten,” subject to legal limitations.</li>
          <li><span className="font-semibold">Right to Restriction:</span> To limit the processing of your data in certain circumstances.</li>
          <li><span className="font-semibold">Right to Data Portability:</span> To receive your data in a structured, machine-readable format.</li>
          <li><span className="font-semibold">Right to Object:</span> To object to the processing of your data on grounds relating to your particular situation, including direct marketing.</li>
          <li>
            <span className="font-semibold">Rights Related to Automated Decision-Making:</span> To not be subject to decisions based solely on automated processing.
          </li>
        </ul>
        <p className="text-lg">
          To exercise these rights, please <Link to="../contact" style={{ color: primaryColor, textDecoration: "underline" }}>contact us</Link> or email us at <span style={{ color: primaryColor, textDecoration: "underline" }}>privacy@yourdomain.com</span>.
        </p>

        {/* Data Protection Officer */}
        <h3 className="text-[24px] mt-4 mb-2">Data Protection Officer</h3>
        <p className="text-lg">
          We have designated a Data Protection Officer (DPO) responsible for overseeing data protection strategy and ensuring compliance with GDPR requirements. If you have any questions or concerns about our data processing practices, please feel free to reach out to our DPO.
        </p>
        <p className="text-lg">
          You can contact the DPO via email at <span style={{ color: primaryColor, textDecoration: "underline" }}>dpo@yourdomain.com</span>.
        </p>

        {/* Cookie Policy */}
        <h3 className="text-[24px] mt-4 mb-2">Cookie Policy</h3>
        <p className="text-lg">
          We use cookies and similar tracking technologies to enhance your experience, analyze site traffic, and serve personalized advertisements. For more information on the cookies we use and how to control them, please refer to our <Link to="../cookie-policy" style={{ color: primaryColor, textDecoration: "underline" }}>Cookie Policy</Link>.
        </p>

        {/* Additional Information */}
        <h3 className="text-[24px] mt-4 mb-2">Additional Information</h3>
        <p className="text-lg">
          For further details on your rights under the GDPR or our processing practices, please review the full documentation available on our website or consult legal guidance. We are committed to updating our practices as necessary to ensure compliance with any future changes in data protection laws.
        </p>
        <p className="text-lg">
          If you have any further questions or require additional information, please do not hesitate to <Link to="../contact" style={{ color: primaryColor, textDecoration: "underline" }}>contact us</Link>.
        </p>
      </div>
    </div>
  );
};

export default GDPRSection;
