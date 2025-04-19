import React from 'react';

const PersonalInformationSharingSegment = () => {
  return (
    <div className="py-2">
      <p className="text-lg mb-4">
        We retain your data only as long as necessary to fulfill the purposes for which it was collected.
        This includes processing your orders, providing customer support, and meeting legal obligations.
      </p>
      <table className="min-w-full border-collapse rounded-lg">
        <caption className="sr-only">Personal Information Sharing Categories</caption>
        <thead>
          <tr className="border border-[2px] border-gray-50">
            <th
              scope="col"
              className="font-[600] bg-gray-50 px-4 py-2 text-left md:w-1/4 w-1/5 md:text-[16px] text-[13px] align-top"
            >
              Personal Information Category
            </th>
            <th
              scope="col"
              className="font-[600] bg-gray-50 px-4 py-2 text-left md:w-2/4 w-3/5 md:text-[16px] text-[13px] align-top"
            >
              Categories of Service Providers
            </th>
            <th
              scope="col"
              className="font-[600] bg-gray-50 px-4 py-2 text-left md:w-1/4 w-1/5 md:text-[16px] text-[13px] align-top"
            >
              Categories of Third Parties
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Personal Identifiers
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Business Operations Tool, Collaboration &amp; Productivity Tools, Commerce Software Tools, Contractors,
              Cybersecurity Providers, Data Analytics Providers, Governance, Risk &amp; Compliance Software, IT Infrastructure Services, Payment Processors,
              and Sales &amp; Marketing Tools
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Ad Networks and Data Analytics Providers
            </td>
          </tr>
          <tr>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Internet Activity
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Commerce Software Tools, Cybersecurity Providers, Data Analytics Providers, and Sales &amp; Marketing Tools
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Ad Networks and Data Analytics Providers
            </td>
          </tr>
          <tr>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Commercial Information
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Business Operations Tool, Collaboration &amp; Productivity Tools, Commerce Software Tools, Contractors,
              Data Analytics Providers, Payment Processors, and Sales &amp; Marketing Tools
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Ad Networks, Data Analytics Providers, and Payment Processors
            </td>
          </tr>
          <tr>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Financial Information
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Business Operations Tool, Collaboration &amp; Productivity Tools, Commerce Software Tools, Contractors,
              Data Analytics Providers, Payment Processors, and Sales &amp; Marketing Tools
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Data Analytics Providers and Payment Processors
            </td>
          </tr>
          <tr>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Location Information
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Business Operations Tool, Commerce Software Tools, and Data Analytics Providers
            </td>
            <td className="border border-[2px] border-gray-50 sm:px-4 px-2 py-2 align-top md:text-[16px] text-[12px]">
              Ad Networks and Data Analytics Providers
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PersonalInformationSharingSegment;
