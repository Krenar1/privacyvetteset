import React from 'react';

const PrivacyInformationSegment = () => {
  return (
    <div className="py-6">
      <p className="mb-4 text-lg">
        We collect the personal information you provide to us when you purchase our products or visit our website. The categories of information we may collect include:
      </p>
      <ul className="list-disc pl-6 mb-4 flex flex-col gap-2">
        <li>Personal Identifiers, including name, email address, postal address, telephone number, and online Identifiers</li>
        <li>Internet Activity</li>
        <li>Commercial Information, including purchases</li>
        <li>Financial Information, including credit or debit card number</li>
        <li>Location Information, including general location data</li>
      </ul>
      <h3 className="text-xl font-bold mb-2">
        Browser Cookies
      </h3>
      <p className="mb-4 text-lg">
        We use cookies to create a better experience for you on our site. For example, cookies prevent you from having to login repeatedly, and they help us remember items you've added to your cart. We also use third-party cookies, which are cookies placed by third parties for advertising and analytics purposes. You can control these cookies through your browser settings.
      </p>
      <h3 className="text-xl font-bold mb-2">
        How long we keep your data
      </h3>
      <p className="mb-2 text-lg">
        We do not retain data for any longer than is necessary for the purposes described in this Policy.
      </p>
      <p className="mb-4 text-lg">
        We generally retain data according to the guidelines below.
      </p>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse rounded-lg">
          <caption className="sr-only">Data Retention Periods</caption>
          <thead>
            <tr className="border border-[2px] border-gray-50">
              <th scope="col" className="font-[600] bg-gray-50 px-4 py-2 w-2/4 text-left md:text-[16px] text-[14px]">
                Type of Data
              </th>
              <th scope="col" className="font-[600] bg-gray-50 px-4 py-2 w-2/4 text-left md:text-[16px] text-[14px]">
                Retention Period
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Cookies and online data we collect while you use our website, including Online Identifiers, Internet Activity, General location data
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                We delete or anonymize data concerning your use of our website within 2 years of collecting it.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Data we collect in order to process and ship orders you place with us, including Name, Email address, Postal address, Telephone number, Purchases, Credit or debit card number
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                We retain records related to process and ship orders as long as necessary to maintain order history.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Data we collect when you contact us for customer support and other inquiries, including Name, Email address, Telephone number, Purchases
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                We keep customer feedback and correspondence with our customer service for up to 2 years to help us respond to any questions or complaints. We may keep data beyond this period in anonymized form.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Data we collect when you sign up for promotional and marketing communications, including Name, Email address, Postal address, Telephone number, Online Identifiers, Internet Activity, Purchases
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Where you have signed up to receive promotional and marketing communications from us, we will retain any data collected until you opt out or request its deletion. We may keep data beyond this period in anonymized form. We will further retain a record of any opt-outs in order to prevent sending you future communications.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Data we collect when you review our products, answer surveys, or send feedback, including Name, Email address, Purchases
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                We retain review, survey, and feedback data for up to 10 years following your last contact with us. We may keep data beyond this period in anonymized form to help improve our products and services.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Data we collect in connection with privacy requests, including Name, Email address, Online Identifiers
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                We retain records related to privacy requests as long as necessary to comply with our legal obligations.
              </td>
            </tr>
            <tr>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                Data we collect for security purposes, including Name, Email address, Online Identifiers
              </td>
              <td className="border border-[2px] border-gray-50 px-4 py-2 align-top md:text-[16px] text-[13px]">
                We retain security-related data as long as necessary to comply with our legal obligations and to maintain and improve our information security measures.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <h3 className="text-xl font-bold mb-2">
        Why we process your information
      </h3>
      <p className="mb-4 text-lg">
        We process personal information for the following business and commercial purposes:
      </p>
      <ul className="list-disc pl-6 flex flex-col gap-2">
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
    </div>
  );
};

export default PrivacyInformationSegment;
