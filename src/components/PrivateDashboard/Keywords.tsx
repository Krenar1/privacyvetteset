import React, { useState, useEffect } from "react";
import ApiLink from "../../../apiLink";
import Auth from "../../../auth";
import KeywordForm from "./KeywordForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type ScrapedData = {
  id: number;
  keyword: string;
  checked_google: boolean;
  checked_yelp: boolean;
  checked_google_date: Date;
  checked_yelp_date: Date;
  location: string;
  keyword_for_google: string;
  num_of_websites: number;
};

const Keywords: React.FC = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedQuery, setSearchedQuery] = useState<string>("");
  const [clickedColumn, setClickedColumn] = useState<string>("id");
  const [isDescending, setIsDescending] = useState<boolean>(false);
  const [addKeyword, setAddKeyword] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);
  const apiUrl: string = ApiLink.url;
  const username: string = Auth.user;
  const password: string = Auth.password;

  useEffect(() => {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    fetch(apiUrl + "keywords", {
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setScrapedData(data.results || []);
        setTotalPages(Math.ceil(data.count / 10));
        if (data.results.length === 0) {
          setFetchFailed(true);
        }
      })
      .catch((error) => {
        setFetchFailed(true);
        console.error("Error fetching sent Keywords:", error);
      });
  }, []);
  

  //

  const handleAdd = async (keywordData: { keyword: string; location: string }) => {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(apiUrl + "keywords/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify({
        keyword: keywordData.keyword,
        location: keywordData.location,
      }),
    });
    const newKeyword = await response.json();
  
    if (response.ok) {
      setScrapedData((prevData) => [...prevData, newKeyword]);
      setAddKeyword(false);
    }
  };
  

  const handleReset = async (column: ScrapedData) => {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(`${apiUrl}keywords/${column.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify({ ...column, checked_google: false }),
    });
  
    if (response.ok) {
      setScrapedData((prevData) =>
        prevData.map((item) =>
          item.id === column.id ? { ...item, checked_google: false } : item
        )
      );
    }
  };
  

  const handleDelete = async (column: ScrapedData) => {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(`${apiUrl}keywords/${column.id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    });
    if (response.ok) {
      setScrapedData((prevData) => prevData.filter((e) => e.id !== column.id));
    }
  };
  

  //

  const handleSearchClick = async () => {
    setActiveFilters([]);
    let url = apiUrl + "keywords/";
    if (searchQuery != "") {
      url = url + "?keyword=";
    }
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(`${url}${encodeURIComponent(searchQuery)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    });
    const data = await response.json();
    if (data.results.length == 0) {
      setFetchFailed(true);
    }
    setSearchedQuery(searchQuery);
    setCurrentPage(1);
    setScrapedData(data.results);
  };
  

  const handleFilterClick = async (filter: string) => {
    let updatedFilters = activeFilters.includes(filter)
      ? activeFilters.filter((f) => f !== filter)
      : [...activeFilters, filter];
  
    setActiveFilters(updatedFilters);
    let url = apiUrl + "keywords/";
    if (updatedFilters.length > 0) {
      url = url + "?checked_google=true";
    }
  
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    });
  
    const data = await response.json();
    if (data.results.length == 0) {
      setFetchFailed(true);
    }
    setSearchedQuery("");
    setCurrentPage(1);
    setScrapedData(data.results);
  };
  

  //

  const handleTableHeadClick = (columnName: string) => {
    setScrapedData((data) => {
      const sortData = (data: any, key: string, isDescending = false) => {
        return data.sort((a: any, b: any) => {
          const valueA = a[key];
          const valueB = b[key];

          if (key === "id") {
            return isDescending ? Number(valueB) - Number(valueA) : Number(valueA) - Number(valueB);
          }

          if (typeof valueA === "string" && typeof valueB === "string") {
            if (valueA < valueB) return isDescending ? 1 : -1;
            if (valueA > valueB) return isDescending ? -1 : 1;
            return 0;
          }

          if (typeof valueA === "number" && typeof valueB === "number") {
            return isDescending ? valueB - valueA : valueA - valueB;
          }

          if (typeof valueA === "boolean" && typeof valueB === "boolean") {
            return isDescending ? (valueB ? -1 : 1) : valueA ? -1 : 1;
          }

          return 0;
        });
      };

      const newIsDescending = clickedColumn === columnName ? !isDescending : false;

      const sortedData = sortData(data, columnName, newIsDescending);

      return sortedData;
    });

    setClickedColumn(columnName);
    setIsDescending(clickedColumn === columnName ? !isDescending : false);
    setCurrentPage(1);
  };

  //

  const handlePageClick = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    let url = `${apiUrl}keywords/?offset=${pageNumber - 1}0`;
  
    if (activeFilters.length > 0) {
      url = `${apiUrl}websites/?${activeFilters[0]}=true&offset=${pageNumber - 1}0`;
    }
  
    if (searchedQuery) {
      url = `${apiUrl}websites/?cleaned_url=${searchedQuery}&offset=${pageNumber - 1}0`;
    }
  
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
    });
  
    const data = await response.json();
    setScrapedData(data.results);
    setTotalPages(Math.ceil(data.count / 10));
  };
  

  return (
    <>
      <div className="bg-white rounded-lg p-6 py-4 shadow-md">
        <div className="flex justify-between mb-0 items-center">
          <h2 className="text-[24px] font-semibold text-gray-800">Keywords</h2>
          <button onClick={() => setAddKeyword(true)} className="px-4 py-2 text-white rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)]">
            Add Keyword
          </button>
        </div>

        <div className="flex justify-between items-center py-2.5 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearchClick();
              }}
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword/location"
                className="px-4 py-2 mr-4 text-[14px] min-w-[240px] rounded-md outline outline-[1px] outline-[#d9d9d9]"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchClick();
                }}
                className="px-4 py-2 text-white rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mb-4 flex items-end gap-4">
            <h2>Filters:</h2>
            <div className="flex items-center gap-4">
              {["Checked Google"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`text-sm cursor-pointer rounded-md px-5 py-1 ${
                    activeFilters.includes(filter) ? "font-semibold text-gray-900 bg-gray-100 filterChecked" : "text-gray-600 bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {scrapedData[0] ? (
            <table className="min-w-full border border-gray-200 ">
              <thead className="bg-gray-100 select-none">
                <tr>
                  {scrapedData[0]
                    ? Object.keys(scrapedData[0]).map((header) => (
                        <th
                          key={header}
                          className={`p-3 text-[12px] leading-[1.2] font-semibold min-w-[60px] text-gray-700 text-center cursor-pointer border-r border-gray-200 ${
                            clickedColumn === header ? (isDescending ? "bg-gray-200 clickedColumn down" : "bg-gray-200 clickedColumn up") : ""
                          }`}
                          onClick={() => handleTableHeadClick(header)}
                        >
                          {header === "id"
                            ? "ID"
                            : header === "keyword"
                            ? "Keyword"
                            : header === "location"
                            ? "Location"
                            : header === "checked_google"
                            ? "Checked Google"
                            : header === "checked_yelp"
                            ? "Checked Yelp"
                            : header === "checked_google_date"
                            ? "Checked Google Date"
                            : header === "checked_yelp_date"
                            ? "Checked Yelp Date"
                            : header === "keyword_for_google"
                            ? "Keyword for Google"
                            : header === "num_of_websites"
                            ? "Websites Fetched"
                            : header}
                        </th>
                      ))
                    : null}
                  <th className="p-3 text-sm font-semibold text-gray-700 text-center  border-r border-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scrapedData.map((item) => (
                  <tr key={item.id} className="border-t border-gray-200 h-[65px]">
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">{item.id || "Not Provided"}</td>
                    <td className="p-3 py-1 leading-none text-[13px] text-gray-700 text-center align-middle">{item.keyword || "Not Provided"}</td>
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">{item.checked_google ? "Yes" : "No"}</td>
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">{item.checked_yelp ? "Yes" : "No"}</td>
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">{new Date(item.checked_google_date).toLocaleDateString()}</td>
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">{new Date(item.checked_yelp_date).toLocaleDateString()}</td>
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">{item.location || "Not Provided"}</td>
                    <td className="p-3 py-1 leading-none text-[13px] text-gray-700 text-center align-middle">{item.keyword_for_google || "Not Provided"}</td>
                    <td className="p-3 py-1 leading-none text-[13px] text-gray-700 text-center align-middle">{item.num_of_websites}</td>
                    <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleReset(item)}
                          className={`px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-100 text-black ${!item.checked_google ? "opacity-50 select-none pointer-events-none" : ""}`}
                        >
                          Reset
                        </button>
                        <button onClick={() => handleDelete(item)} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-100 text-black">
                          Delete
                        </button>
                      </div>
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

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage !== 1 && handlePageClick(currentPage - 1)}
                className={`hover:bg-gray-200 active:bg-gray-100 hover:text-black cursor-pointer ${
                  currentPage === 1 || scrapedData.length == 0 ? "pointer-events-none opacity-50" : ""
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
                  currentPage === totalPages || scrapedData.length == 0 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {addKeyword && <KeywordForm setKeywordForm={setAddKeyword} handleAdd={handleAdd} />}
    </>
  );
};

export default Keywords;
