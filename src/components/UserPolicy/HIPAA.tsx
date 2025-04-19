import React from "react";
import { Link } from "react-router-dom";

interface HIPAASectionProps {
  primaryColor: string;
  accentColor: string;
}

const HIPAASection: React.FC<HIPAASectionProps> = ({ primaryColor, accentColor }) => {
  return (
    <div className="content content--with-max-width state-content p-6">
      <div>
        {/* Main Heading styled with accent color */}
        <h2 className="md:text-2xl text-xl mb-4 w-fit py-1 font-bold rounded-lg" >
          HIPAA – Health Insurance Portability and Accountability Act
        </h2>

        {/* Introduction */}
        <p className="text-lg">
          This section provides comprehensive information about HIPAA for covered entities and patients.
          HIPAA establishes national standards for the protection of individually identifiable health information, known as Protected Health Information (PHI).
          These standards include rules for privacy, security, and breach notification.
        </p>
        <p className="text-lg">
          We are committed to complying with HIPAA by implementing robust policies and technical safeguards that secure PHI and ensure that your data is handled with the utmost care.
        </p>

        {/* Overview of HIPAA */}
        <h3 className="text-[24px] mt-4 mb-2" >
          Overview of HIPAA
        </h3>
        <p className="text-lg">
          HIPAA applies primarily to covered entities—healthcare providers, health plans, and healthcare clearinghouses—and their business associates.
          It is comprised of several key rules:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>
            <span className="font-semibold">Privacy Rule:</span> Protects the privacy of PHI and regulates its use and disclosure.
          </li>
          <li>
            <span className="font-semibold">Security Rule:</span> Requires appropriate administrative, technical, and physical safeguards to ensure the confidentiality, integrity, and availability of electronic PHI (e-PHI).
          </li>
          <li>
            <span className="font-semibold">Breach Notification Rule:</span> Mandates timely notification to affected individuals, HHS, and in some cases the media, in the event of a data breach.
          </li>
        </ul>

        {/* Information Covered Under HIPAA */}
        <h3 className="text-[24px] mt-4 mb-2" >
          Information Covered Under HIPAA
        </h3>
        <p className="text-lg">
          HIPAA protects Protected Health Information (PHI), which includes any information that can be used to identify an individual and relates to their health status,
          provision of healthcare, or payment for healthcare. This information may exist in any form: electronic, paper, or oral.
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Patient names, addresses, dates of birth, and Social Security numbers</li>
          <li>Medical records and treatment information</li>
          <li>Billing and insurance details</li>
          <li>Information about diagnoses, treatments, and prescriptions</li>
        </ul>

        {/* Allowed Uses and Disclosures */}
        <h3 className="text-[24px] mt-4 mb-2" >
          Allowed Uses and Disclosures
        </h3>
        <p className="text-lg">
          Covered entities may use and disclose PHI without individual authorization for:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li>Treatment of the patient</li>
          <li>Payment processes related to healthcare services</li>
          <li>Healthcare operations such as quality assessment and improvement, accreditation, and administrative activities</li>
          <li>Public health activities and reporting requirements</li>
        </ul>
        <p className="text-lg">
          In situations not covered by the above exceptions, explicit patient consent is required before PHI can be used or disclosed.
        </p>

        {/* HIPAA Enforcement and Penalties */}
        <h3 className="text-[24px] mt-4 mb-2" >
          HIPAA Enforcement and Penalties
        </h3>
        <p className="text-lg">
          The U.S. Department of Health and Human Services’ Office for Civil Rights (OCR) enforces HIPAA.
          Penalties for non-compliance vary based on the level of negligence and can range from hundreds to millions of dollars.
        </p>
        <table className="min-w-full border-collapse rounded-lg mt-6 mb-3">
          <caption className="sr-only">HIPAA Penalty Levels</caption>
          <thead>
            <tr className="border border-[2px] border-gray-50">
              <th scope="col" className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px]">
                Violation Level
              </th>
              <th scope="col" className="font-[600] bg-gray-50 px-4 py-2 text-left w-[50%] md:text-[16px] text-[14px]">
                Penalty Range (per violation)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Reasonable Cause, Not Willful Neglect
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                $100 - $25,000 (up to $1.5M annually)
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                Willful Neglect (Corrected)
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[14px]">
                $1,000 - $50,000 (up to $1.5M annually)
              </td>
            </tr>
          </tbody>
        </table>

        {/* Patient Rights Under HIPAA */}
        <h3 className="text-[24px] mt-4 mb-2" >
          Patient Rights Under HIPAA
        </h3>
        <p className="text-lg">
          Patients have several rights regarding their PHI, including:
        </p>
        <ul className="list-disc pl-6 p-4 flex flex-col gap-2 text-[18px]">
          <li><span className="font-semibold">Right to Access:</span> Patients may request copies of their PHI.</li>
          <li><span className="font-semibold">Right to Amendment:</span> Patients may request corrections to their PHI if inaccuracies are found.</li>
          <li><span className="font-semibold">Right to an Accounting of Disclosures:</span> Covered entities must provide a record of certain disclosures of PHI.</li>
          <li><span className="font-semibold">Right to Request Restrictions:</span> Patients can request restrictions on certain uses and disclosures, subject to feasibility.</li>
        </ul>

        {/* Breach Notification */}
        <h3 className="text-[24px] mt-4 mb-2" >
          Breach Notification
        </h3>
        <p className="text-lg">
          In the event of a breach of PHI, covered entities must notify affected patients, the HHS, and in some cases, the media.
          Notification should include details about the breach, what PHI was involved, and steps for individuals to protect themselves.
        </p>

        {/* Additional Information */}
        <h3 className="text-[24px] mt-4 mb-2" >
          Additional Information
        </h3>
        <p className="text-lg">
          For more detailed information about HIPAA rules and regulations, including the Privacy, Security, and Breach Notification Rules,
          please visit the <Link to="https://www.hhs.gov/hipaa/for-professionals/privacy/laws-regulations/index.html" style={{ color: primaryColor, textDecoration: "underline" }}>HHS HIPAA Regulations</Link> page.
        </p>
      </div>
    </div>
  );
};

export default HIPAASection;
