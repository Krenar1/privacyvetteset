import React from "react";
import { Link } from "react-router-dom";

interface GeneralNoticesProps {
  primaryColor: string;
  accentColor: string;
}

/**
 * GeneralNotices.tsx - U.S.-Wide Privacy Notice component.
 * Provides a comprehensive privacy notice for all U.S. users in a legal/compliance tone.
 * This version is adapted to follow the styling of the CA.tsx component.
 * Props:
 *  - primaryColor: Tailwind CSS text color class for links and important highlights (e.g., "text-blue-600").
 *  - accentColor: Tailwind CSS text color class for section headers (e.g., "text-gray-800").
 */
const GeneralNotices: React.FC<GeneralNoticesProps> = ({ primaryColor, accentColor }) => {
  return (
    <div className="content content--with-max-width state-content sm:px-2">
      <div>
        {/* Introduction and Applicability */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Introduction and Applicability</h3>
        <p className="text-lg mb-4">
          This U.S. Privacy Notice ("Notice") describes how we collect, use, disclose, 
          and protect your personal data (or "Personal Information") when you use our website, mobile app, 
          and other online services (collectively, the "Services"). It applies to all individuals residing in the 
          United States who interact with our Services. By using our Services, you agree to the data practices 
          described in this Notice. This Notice is intended to reflect U.S. federal and state privacy requirements 
          and best practices, and to provide transparency about our handling of Personal Information.
        </p>
        
        {/* Categories of Data Collected */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Categories of Data Collected</h3>
        <p className="text-lg mb-4">
          We collect various categories of Personal Information from and about you for the purposes described in this Notice. 
          These categories may include:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px] mb-4">
          <li>
            <span className="font-semibold" >Identifiers and Contact Information:</span> For example, name, email address, mailing address, phone number, 
            account username, and login credentials. We collect this information when you provide it directly, such as when creating an account or placing an order.
          </li>
          <li>
            <span className="font-semibold" >Financial and Payment Information:</span> Payment card details or financial account information necessary to process your purchases. 
            We do not store full credit card numbers—payments are handled by our payment processor—but we may retain records of transactions (e.g., billing history and payment confirmations).
          </li>
          <li>
            <span className="font-semibold" >Commercial Information:</span> Details about your orders, purchases, or returns (e.g., products purchased, dates and amounts). We keep records of your purchase history on our platform.
          </li>
          <li>
            <span className="font-semibold" >Device and Online Activity Information:</span> Technical information when you use our Services, such as IP address, browser type, device identifiers, 
            pages or products viewed, clicks and browsing patterns, and referring URLs. We collect some of this information using cookies and similar tracking technologies.
          </li>
          <li>
            <span className="font-semibold" >Geolocation Data:</span> General location information inferred from your IP address or provided by your device (e.g., city or state), if you have location services enabled.
          </li>
          <li>
            <span className="font-semibold" >Communications:</span> The content of your communications with us, such as emails, chat logs, or phone call recordings with customer service. 
            We maintain these records when you contact us for support or feedback.
          </li>
          <li>
            <span className="font-semibold" >Inferences:</span> Inferences drawn from the above data about your preferences and interests. For example, we may infer your product preferences or purchasing trends to personalize your experience.
          </li>
        </ul>
        
        {/* How Personal Data is Used */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>How Personal Data is Used</h3>
        <p className="text-lg mb-4">
          We use your Personal Information for the following business and commercial purposes (consistent with the context in which it was collected and as otherwise disclosed to you):
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px] mb-4">
          <li>
            <span className="font-semibold" >Providing and Improving Services:</span> To process your orders, provide the products or services you request, and to manage your account. 
            This includes shipping your products, handling returns or exchanges, and ensuring our Services function correctly.
          </li>
          <li>
            <span className="font-semibold" >Customer Service and Communications:</span> To communicate with you about your account or transactions, send important notices, such as order confirmations, 
            updates, security alerts, and administrative messages, and to respond to your inquiries and customer service requests.
          </li>
          <li>
            <span className="font-semibold" >Personalization:</span> To personalize your experience on our site, such as by remembering your cart items, preferences, and purchase history, 
            and to provide content and product recommendations tailored to your interests.
          </li>
          <li>
            <span className="font-semibold" >Marketing and Promotional Activities:</span> To send you marketing communications about our products, services, special offers, or events that may be of interest to you. 
            You can opt out of or unsubscribe from these communications at any time.
          </li>
          <li>
            <span className="font-semibold" >Analytics and Product Development:</span> To analyze usage of our Services and improve our website, products, and services. 
            For example, we may use analytics tools to understand how users navigate our site, so we can enhance user experience and site functionality.
          </li>
          <li>
            <span className="font-semibold" >Security and Fraud Prevention:</span> To protect our customers, our business, and our Services. This includes using your information to detect, investigate, 
            and prevent fraudulent transactions or other illegal activities, to debug and repair errors, and to enforce our policies.
          </li>
          <li>
            <span className="font-semibold" >Legal Compliance:</span> To comply with applicable legal obligations, such as financial and tax regulations, consumer protection laws, and other requirements.
          </li>
        </ul>
        
        {/* Data Sharing Practices */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Data Sharing Practices</h3>
        <p className="text-lg mb-4">
          We may share your Personal Information with third parties in certain circumstances, in accordance with applicable law, as described below:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px] mb-4">
          <li>
            <span className="font-semibold" >Service Providers:</span> We share Personal Information with trusted third-party service providers who perform services on our behalf and under our instructions. 
            These include providers for payment processing, order fulfillment, web hosting, data analytics, marketing (e.g., email campaign management), and IT support.
          </li>
          <li>
            <span className="font-semibold" >Affiliates and Business Partners:</span> We may share information with our corporate affiliates or subsidiaries under common ownership, and with business partners when necessary to provide you with requested products or services.
          </li>
          <li>
            <span className="font-semibold" >Advertising and Analytics Partners:</span> To understand usage of our Services and deliver relevant advertisements, 
            we may share limited data (e.g., device identifiers, browsing data) with analytics or advertising partners who use cookies or similar technologies.
          </li>
          <li>
            <span className="font-semibold" >Legal and Compliance Reasons:</span> We may disclose Personal Information if required by law, legal process, or to protect our rights and comply with legal obligations.
          </li>
          <li>
            <span className="font-semibold" >Business Transfers:</span> In the event of a business transaction (merger, acquisition, reorganization, or sale of assets) or bankruptcy, your Personal Information may be transferred to the successor entity.
          </li>
          <li>
            <span className="font-semibold" >With Your Consent:</span> We may share your Personal Information for other purposes if you provide explicit consent.
          </li>
        </ul>
        
        {/* Cookies and Tracking Technologies */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Cookies and Tracking Technologies</h3>
        <p className="text-lg mb-4">
          Like many online services, we use cookies and similar tracking technologies (such as web beacons, pixels, and device identifiers) to automatically collect information about your device and how you interact with our Services. 
          Cookies help us remember your preferences, enable site functionality (e.g., keeping you logged in), analyze site traffic, and serve targeted advertisements.
        </p>
        <p className="text-lg mb-4">
          You can manage or disable cookies through your web browser's settings; however, disabling cookies may affect the functionality of our Services.
        </p>
        
        {/* Data Security Measures */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Data Security Measures</h3>
        <p className="text-lg mb-4">
          We implement appropriate administrative, technical, and physical security measures to protect your Personal Information from unauthorized access, disclosure, alteration, and destruction. 
          These measures include secure servers, encryption (e.g., TLS for transmitting sensitive data), and strict internal access controls. 
          While we work to safeguard your data, no method of transmission over the Internet or storage is 100% secure.
        </p>
        <p className="text-lg mb-4">
          In the event of a data breach compromising your Personal Information, we will notify you in accordance with applicable law and take steps to mitigate any potential harm.
        </p>
        
        {/* Data Retention Policy */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Data Retention Policy</h3>
        <p className="text-lg mb-4">
          We retain your Personal Information only for as long as necessary to fulfill the purposes for which it was collected or as required by law. The following table outlines our general data retention practices:
        </p>
        <table className="min-w-full border-collapse rounded-lg mt-6 mb-3">
          <caption className="sr-only">Data Retention</caption>
          <thead>
            <tr className="border border-[2px] border-gray-50">
              <th
                scope="col"
                className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px]"
              >
                Category of Data
              </th>
              <th
                scope="col"
                className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px]"
              >
                Retention Period
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Account Information (e.g., name, contact details, account credentials)
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Maintained for as long as your account is active; if deactivated, retained briefly for potential reactivation and legal compliance.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Transaction Records (e.g., orders, payment and billing information)
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Retained for the transaction duration and at least 7 years thereafter for tax and compliance purposes.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Customer Service Communications
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Generally kept for up to 2 years after resolution, unless extended by legal requirements.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Website Usage Data (analytics and cookies)
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] sm:text-[14px] text-[12px]">
                Retained for 1-2 years for analysis and security monitoring.
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-lg mb-4">
          After the applicable retention period or when data is no longer required, we will delete, anonymize, or securely dispose of the Personal Information.
        </p>
        
        {/* Children's Privacy */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Children's Privacy</h3>
        <p className="text-lg mb-4">
          Our Services are not directed to children under the age of 13, and we do not knowingly collect Personal Information from children under 13 years old. 
          If you are under 13, please do not use our Services or provide any information about yourself. In accordance with COPPA, if we discover that we have collected personal information from a child under 13 without verified parental consent, we will promptly delete that information.
        </p>
        <p className="text-lg mb-4">
          If you are a parent or guardian and believe that a child under your care has provided us with Personal Information without your consent, please contact us using the information below.
        </p>
        
        {/* Your Rights Under U.S. Law */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Your Rights Under U.S. Law</h3>
        <p className="text-lg mb-4">
          Depending on your state of residence and applicable laws, you may have certain rights regarding your Personal Information, including:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px] mb-4">
          <li>
            <span className="font-semibold" >Right to Access and Know:</span> Request details about the Personal Information we have collected and how it is used.
          </li>
          <li>
            <span className="font-semibold" >Right to Data Portability:</span> Obtain a copy of your personal data in a portable format.
          </li>
          <li>
            <span className="font-semibold" >Right to Correction:</span> Request updates or corrections to your Personal Information.
          </li>
          <li>
            <span className="font-semibold" >Right to Deletion:</span> Request deletion of your Personal Information, subject to legal exceptions.
          </li>
          <li>
            <span className="font-semibold" >Right to Opt-Out of Sale or Sharing:</span> If applicable, opt out of the sale or sharing of your Personal Information.
          </li>
          <li>
            <span className="font-semibold" >Right to Non-Discrimination:</span> Exercise your rights without suffering adverse effects, such as different pricing or levels of service.
          </li>
          <li>
            <span className="font-semibold" >Other Rights:</span> Additional rights may apply based on state laws.
          </li>
        </ul>
        <p className="text-lg mb-4">
          Please note that the availability and specifics of these rights may vary depending on your jurisdiction. We will respond to your requests in accordance with applicable law.
        </p>
        
        {/* Making a Data Rights Request */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Making a Data Rights Request</h3>
        <p className="text-lg mb-4">
          To exercise any of the rights described above, please submit a request to us by contacting us through one of the methods listed in the "Contact Information" section below.
          In your request, please clearly specify which right you wish to exercise and provide sufficient information to verify your identity.
        </p>
        <p className="text-lg mb-4">
          Once we verify your request, we will respond within the legally required timeframe (typically within 45 days, with a possible extension of an additional 45 days if necessary). If we cannot fully honor your request due to legal constraints, we will explain the reasons.
        </p>
        <p className="text-lg mb-4">
          For certain requests, you may designate an authorized agent to act on your behalf. In such cases, we may require additional verification that the agent is acting with your consent.
        </p>
        
        {/* Contact Information */}
        <h3 className={`text-[24px] mt-4 mb-2 ${accentColor}`}>Contact Information</h3>
        <p className="text-lg mb-4">
          If you have any questions or comments about this Privacy Notice, or if you would like to exercise your rights or obtain more information about our privacy practices, please contact us:
        </p>
        <p className="text-lg mb-4">
          <span className="font-semibold" >Email:</span> <a href="mailto:privacy@ecommerce.example" className={`${primaryColor} underline hover:opacity-80`}>privacy@ecommerce.example</a><br/>
          <span className="font-semibold" >Address:</span> Privacy Officer, Example E-Commerce Inc., 123 Commerce Street, Suite 100, Anytown, USA<br/>
          <span className="font-semibold" >Phone:</span> <a href="tel:+1-800-123-4567" className={`${primaryColor} underline hover:opacity-80`}>1-800-123-4567</a> (toll-free)
        </p>
        <p className="text-lg mb-4">
          We are committed to working with you to resolve any privacy concerns. If you believe your privacy rights have not been adequately addressed, you may also contact your state Attorney General’s office or the Federal Trade Commission (e.g., visit <a href="https://reportfraud.ftc.gov" target="_blank" rel="noopener noreferrer" className={`${primaryColor} underline hover:opacity-80`}>reportfraud.ftc.gov</a> for more information) to file a complaint.
        </p>
      </div>
    </div>
  );
};

export default GeneralNotices;
