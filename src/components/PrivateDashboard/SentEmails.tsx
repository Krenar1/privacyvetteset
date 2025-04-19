import React, { useState, useEffect } from "react";
import ApiLink from "../../../apiLink";
import Auth from "../../../auth";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type SentEmailData = {
  id: string;
  website: string;
  URL: string;
  email: string;
  compliance_status: string;
  last_email_sent: Date; // value to display in the "Sent" column
};

const SentEmails: React.FC = () => {
  const [emailsData, setEmailsData] = useState<SentEmailData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typedQuery, setTypedQuery] = useState<string>("");
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);
  const apiUrl: string = ApiLink.url;
  const username: string = Auth.user;
  const password: string = Auth.password;

  // Fetch sent emails data from API based on searchQuery and currentPage.
  useEffect(() => {
    const offset = (currentPage - 1) * 10;
    const queryParam = searchQuery
      ? `?contact_email=${encodeURIComponent(searchQuery)}`
      : "?contact_email=true";
    const fetchUrl = `${apiUrl}websites/${queryParam}&offset=${offset}&last_email_sent=notnull`;
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    fetch(fetchUrl, {
      headers: {
        Authorization: basicAuth,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedData: SentEmailData[] = data.results.map((item: any) => ({
          id: item.id.toString(),
          website: item.cleaned_url,
          URL: item.cleaned_url,
          email: item.contact_email,
          compliance_status: item.compliance_status || "Unknown",
          last_email_sent: item.last_email_sent,
        }));
        setEmailsData(mappedData);
        setTotalPages(Math.ceil(data.count / 10));
        if (data.results.length == 0) {
          setFetchFailed(true);
        }
      })
      .catch((error) => {
        setFetchFailed(true);
        console.error("Error fetching sent emails:", error);
      });
  }, [apiUrl, currentPage, searchQuery]);
  
  // Handle page change for pagination.
  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle search form submission.
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(typedQuery);
  };

  return (
    <>
      <div className="bg-white rounded-lg p-6 py-4 shadow-md">
        {/* Header */}
        <div className="flex justify-between mb-0 items-center">
          <h2 className="text-[24px] font-semibold text-gray-800">Sent Emails</h2>
        </div>

        {/* Search Bar */}
        <div className="flex justify-between items-center py-2.5 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-0">
              <input
                type="text"
                value={typedQuery}
                onChange={(e) => setTypedQuery(e.target.value)}
                placeholder="Search by email..."
                className="px-4 py-2 mr-4 text-[14px] min-w-[240px] rounded-md outline outline-[1px] outline-[#d9d9d9]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-white rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)]"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {emailsData[0] ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 select-none">
                <tr>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    ID
                  </th>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Website
                  </th>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    URL
                  </th>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Email
                  </th>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Compliance
                  </th>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center">
                    Sent
                  </th>
                </tr>
              </thead>
              <tbody>
                {emailsData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 h-[65px]">
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle">
                      {item.id}
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle max-w-[240px] truncate">
                      {item.website}
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle max-w-[240px] truncate">
                      <a
                        href={item.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[11px]"
                      >
                        {item.URL}
                      </a>
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle max-w-[240px] truncate">
                      {item.email}
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle max-w-[240px] truncate">
                      {item.compliance_status}
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle">
  {new Date(item.last_email_sent).toLocaleString()}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            fetchFailed ? (<div className="text-center px-10 py-5 text-black">
              No records found. Try adjusting your search.
            </div>) : (<div className="flex justify-center items-center px-10 py-5">
  <svg
    className="animate-spin h-8 w-8 text-primary"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
</div>)
          )}
        </div>

        {/* Pagination Controls */}
       <Pagination className="mt-4">
         <PaginationContent>
           <PaginationItem>
             <PaginationPrevious
               onClick={() => currentPage !== 1 && handlePageClick(currentPage - 1)}
               className={`hover:bg-gray-200 active:bg-gray-100 hover:text-black cursor-pointer ${
                 currentPage === 1 || emailsData.length == 0 ? "pointer-events-none opacity-50" : ""
               }`}
             />
           </PaginationItem>
           {Array.from({ length: totalPages }, (_, i) => {
             const pageNumber = i + 1;
             if (
               pageNumber <= 3 ||
               pageNumber > totalPages - 3 ||
               (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
             ) {
               return (
                 <PaginationItem key={pageNumber}>
                   <PaginationLink
                     href="#"
                     onClick={(e) => {
                       e.preventDefault();
                       handlePageClick(pageNumber);
                     }}
                     isActive={currentPage === pageNumber}
                     className="hover:bg-gray-200 active:bg-gray-100 hover:text-black"
                   >
                     {pageNumber}
                   </PaginationLink>
                 </PaginationItem>
               );
             }
             if (pageNumber === 4 || pageNumber === totalPages - 3) {
               return (
                 <PaginationItem key={pageNumber}>
                   <PaginationEllipsis className="hover:bg-gray-200 active:bg-gray-100" />
                 </PaginationItem>
               );
             }
             return null;
           })}
           <PaginationItem>
             <PaginationNext
             
               onClick={() =>
                 currentPage !== totalPages && handlePageClick(currentPage + 1)
               }
               className={`hover:bg-gray-200 active:bg-gray-100 hover:text-black cursor-pointer ${
                 currentPage === totalPages || emailsData.length == 0 ? "pointer-events-none opacity-50" : ""
               }`}
             />
           </PaginationItem>
         </PaginationContent>
       </Pagination>
      </div>
    </>
  );
};

export default SentEmails;
