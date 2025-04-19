import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import WebsiteForm from "./WebsiteForm";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

type Subscription = {
  id: number;
  status: string;
  payment_type: string;
  amount: number;
  currency: string;
  product: number | null;
  product_details?: {
    name: string;
    description: string | null;
  };
  email_status: string;
  email_status_display: string;
  email_sent_at: string | null;
  email_resend_count: number;
  last_email_error: string | null;
  created_at: string;
};

type ScrapedData = {
  id: string;
  cleaned_url: string;
  category: string | null;
  contact_email: string;
  privacy_policy_url: string;
  crawled: boolean;
  error_message: string;
  last_email_sent: Date | null;
  paid: boolean;
  crawl_date: Date | null;
  follow_up_status: string | null;
  keyword: string;
  subscriptions?: Subscription[];

  // Payment and subscription fields
  subscription_status: 'none' | 'trial' | 'active' | 'expired' | 'canceled';
  subscription_status_display: string;
  subscription_type: 'none' | 'monthly' | 'yearly' | 'one_time';
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  last_payment_date: string | null;
  payment_verified: boolean;
  payment_verification_date: string | null;
  payment_amount: number | null;
  payment_currency: string;
  payment_method: string | null;
  payment_id: string | null;
  days_left: number;
};

const Websites: React.FC = () => {
  const [scrapedData, setScrapedData] = useState<ScrapedData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedQuery, setSearchedQuery] = useState<string>("");
  const [clickedColumn, setClickedColumn] = useState<string>("id");
  const [isDescending, setIsDescending] = useState<boolean>(false);
  const [addWebsite, setAddWebsite] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    const fetchWebsites = async () => {
      setIsLoading(true);
      try {
        const data = await api.getWebsites();
        const filteredData: ScrapedData[] = data.results.map((item: any) => ({
          id: item.id.toString(),
          cleaned_url: item.cleaned_url,
          category: item.category,
          contact_email: item.contact_email,
          privacy_policy_url: item.privacy_policy_url,
          crawled: item.crawled,
          error_message: Boolean(item.error_message),
          last_email_sent: item.last_email_sent ? new Date(item.last_email_sent) : null,
          paid: item.paid,
          crawl_date: item.crawl_date ? new Date(item.crawl_date) : null,
          follow_up_status: item.follow_up_status,
          keyword: String(item.keyword),
          subscriptions: item.subscribes || [],
        }));
        setScrapedData(filteredData);
        setTotalPages(Math.ceil(data.count / 10));
      } catch (error) {
        setFetchFailed(true);
        console.error("Error fetching websites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsites();
  }, []);


  //

  const handleAdd = async (websiteData: { url: string; email: string }) => {
    try {
      const basicAuth = "Basic " + btoa(`${username}:${password}`);
      const response = await fetch(`${apiUrl}websites/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
        body: JSON.stringify({
          cleaned_url: websiteData.url,
          contact_email: websiteData.email,
        }),
      });
      const newWebsite = await response.json();

      if (newWebsite.cleaned_url[0].includes("already exists")) {
        const putResponse = await fetch(
          `${apiUrl}websites/?cleaned_url=${encodeURIComponent(websiteData.url)}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: basicAuth,
            },
            body: JSON.stringify({
              contact_email: websiteData.email,
            }),
          }
        );
        const updatedWebsite = await putResponse.json();

        if (!putResponse.ok) {
          throw new Error(updatedWebsite.error || "Failed to update website email");
        }

        setScrapedData((prevData) => [
          ...prevData,
          {
            id: updatedWebsite.id,
            cleaned_url: updatedWebsite.cleaned_url,
            category: updatedWebsite.category,
            contact_email: updatedWebsite.contact_email,
            privacy_policy_url: updatedWebsite.privacy_policy_url,
            crawled: updatedWebsite.crawled,
            error_message: updatedWebsite.error_message,
            last_email_sent: updatedWebsite.last_email_sent,
            paid: updatedWebsite.paid,
            crawl_date: updatedWebsite.crawl_date,
            follow_up_status: updatedWebsite.follow_up_status,
            keyword: String(updatedWebsite.keyword),
          },
        ]);
      } else {
        setScrapedData((prevData) => [
          ...prevData,
          {
            id: newWebsite.id,
            cleaned_url: newWebsite.cleaned_url,
            category: newWebsite.category,
            contact_email: newWebsite.contact_email,
            privacy_policy_url: newWebsite.privacy_policy_url,
            crawled: newWebsite.crawled,
            error_message: newWebsite.error_message,
            last_email_sent: newWebsite.last_email_sent,
            paid: newWebsite.paid,
            crawl_date: newWebsite.crawl_date,
            follow_up_status: newWebsite.follow_up_status,
            keyword: String(newWebsite.keyword),
          },
        ]);
      }
    } catch (error) {
      console.error("Error adding website:", error);
    } finally {
      setAddWebsite(false);
    }
  };




  const handleCSVAdd = async (websiteData: { url: string, email: string }[]) => {
    try {
      const requestBody = { urls: websiteData };
      const basicAuth = "Basic " + btoa(`${username}:${password}`);
      const response = await fetch(`${apiUrl}websites/bulk_add/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Failed to add websites");

      const newWebsitesData = await response.json();
      console.log(newWebsitesData);
      for (let i = 0; i < newWebsitesData.created.length; i++) {
        setScrapedData((prevData) => [
          ...prevData,
          {
            id: newWebsitesData.created[i].id,
            cleaned_url: newWebsitesData.created[i].cleaned_url,
            category: newWebsitesData.created[i].category,
            contact_email: newWebsitesData.created[i].contact_email,
            privacy_policy_url: newWebsitesData.created[i].privacy_policy_url,
            crawled: newWebsitesData.created[i].crawled,
            email: newWebsitesData.created[i].email,
            error_message: newWebsitesData.created[i].error_message,
            last_email_sent: newWebsitesData.created[i].last_email_sent,
            paid: newWebsitesData.created[i].paid,
            crawl_date: newWebsitesData.created[i].crawl_date,
            follow_up_status: newWebsitesData.created[i].follow_up_status,
            keyword: String(newWebsitesData.created[i].keyword),
          },
        ]);
      }
      for (let i = 0; i < newWebsitesData.existing.length; i++) {
        if (newWebsitesData.existing[i].contact_email) {
          const putResponse = await fetch(
            `${apiUrl}websites/?id=${newWebsitesData.existing[i]}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: basicAuth,
              },
              body: JSON.stringify({
                contact_email: newWebsitesData.existing[i].contact_email,
              }),
            }
          );
          const updatedWebsite = await putResponse.json();
          setScrapedData((prevData) => [
            ...prevData,
            {
              id: updatedWebsite.id,
              cleaned_url: updatedWebsite.cleaned_url,
              category: updatedWebsite.category,
              contact_email: updatedWebsite.contact_email,
              privacy_policy_url: updatedWebsite.privacy_policy_url,
              crawled: updatedWebsite.crawled,
              error_message: updatedWebsite.error_message,
              last_email_sent: updatedWebsite.last_email_sent,
              paid: updatedWebsite.paid,
              crawl_date: updatedWebsite.crawl_date,
              follow_up_status: updatedWebsite.follow_up_status,
              keyword: String(updatedWebsite.keyword),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error adding website data:", error);
    } finally {
      setAddWebsite(false);
    }
  };



  const handleReset = async (column: ScrapedData) => {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(`${apiUrl}websites/${column.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify({
        crawled: false,
        cleaned_url: column.cleaned_url,
        keyword: column.keyword,
      }),
    });
    if (response.ok) {
      setScrapedData((prevData) =>
        prevData.map((item) =>
          item.id === column.id ? { ...item, crawled: false } : item
        )
      );
    }
  };


  // Recheck
  const handleTest = async (column: ScrapedData) => {
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    const response = await fetch(`${apiUrl}websites/${column.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify({
        crawled: false,
        cleaned_url: column.cleaned_url,
        keyword: column.keyword,
      }),
    });
    if (response.ok) {
      setScrapedData((prevData) =>
        prevData.map((item) =>
          item.id === column.id ? { ...item, crawled: false } : item
        )
      );
    }
  };


  const handleDelete = async (column: ScrapedData) => {
    setIsLoading(true);
    try {
      // Use the API service to delete the website
      await api.deleteWebsite(column.id);
      // Update the state to remove the deleted website
      setScrapedData((prevData) => prevData.filter((e) => e.id !== column.id));
    } catch (error) {
      console.error("Error deleting website:", error);
      alert("Failed to delete website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (subscriptionId: number) => {
    if (window.confirm("Are you sure you want to resend the purchase confirmation email?")) {
      // Show loading state
      setScrapedData(prevData => {
        return prevData.map(website => {
          if (website.subscriptions) {
            const updatedSubscriptions = website.subscriptions.map(sub => {
              if (sub.id === subscriptionId) {
                return { ...sub, email_status: 'sending', email_status_display: 'Sending...' };
              }
              return sub;
            });
            return { ...website, subscriptions: updatedSubscriptions };
          }
          return website;
        });
      });

      try {
        // Call the API to resend the email using API service
        const data = await api.resendEmail(subscriptionId);

        if (data.status === 'success') {
          // Update the subscription in the state
          setScrapedData(prevData => {
            return prevData.map(website => {
              if (website.subscriptions) {
                const updatedSubscriptions = website.subscriptions.map(sub => {
                  if (sub.id === subscriptionId) {
                    return {
                      ...sub,
                      email_status: 'resent',
                      email_status_display: 'Resent',
                      email_resend_count: data.resend_count || sub.email_resend_count + 1,
                      email_sent_at: new Date().toISOString(),
                      last_email_error: null
                    };
                  }
                  return sub;
                });
                return { ...website, subscriptions: updatedSubscriptions };
              }
              return website;
            });
          });

          alert("Email resent successfully!");
        } else {
          // Update the subscription with the error
          setScrapedData(prevData => {
            return prevData.map(website => {
              if (website.subscriptions) {
                const updatedSubscriptions = website.subscriptions.map(sub => {
                  if (sub.id === subscriptionId) {
                    return {
                      ...sub,
                      email_status: 'failed',
                      email_status_display: 'Failed',
                      last_email_error: data.message || 'Failed to resend email'
                    };
                  }
                  return sub;
                });
                return { ...website, subscriptions: updatedSubscriptions };
              }
              return website;
            });
          });

          alert(`Failed to resend email: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error("Error:", error);

        // Update the subscription with the error
        setScrapedData(prevData => {
          return prevData.map(website => {
            if (website.subscriptions) {
              const updatedSubscriptions = website.subscriptions.map(sub => {
                if (sub.id === subscriptionId) {
                  return {
                    ...sub,
                    email_status: 'failed',
                    email_status_display: 'Failed',
                    last_email_error: error instanceof Error ? error.message : 'Network error'
                  };
                }
                return sub;
              });
              return { ...website, subscriptions: updatedSubscriptions };
            }
            return website;
          });
        });

        alert(`Error: ${error instanceof Error ? error.message : 'Network error'}`);
      }
    }
  };


  //

  const handleSearchClick = async () => {
    setActiveFilters([]);
    setIsLoading(true);

    try {
      const data = await api.searchWebsites(searchQuery);

      const filteredData: ScrapedData[] = data.results.map((item: any) => ({
        id: item.id.toString(),
        cleaned_url: item.cleaned_url,
        category: item.category,
        contact_email: item.contact_email,
        privacy_policy_url: item.privacy_policy_url,
        crawled: item.crawled,
        error_message: Boolean(item.error_message),
        last_email_sent: item.last_email_sent ? new Date(item.last_email_sent) : null,
        paid: item.paid,
        crawl_date: item.crawl_date ? new Date(item.crawl_date) : null,
        follow_up_status: item.follow_up_status,
        keyword: String(item.keyword),
      }));

      if (data.results.length === 0) {
        setFetchFailed(true);
      }

      setSearchedQuery(searchQuery);
      setCurrentPage(1);
      setScrapedData(filteredData);
      setTotalPages(Math.ceil(data.count / 10));
    } catch (error) {
      console.error("Error searching websites:", error);
      setFetchFailed(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleFilterClick = async (filter: string) => {
    const updatedFilters = activeFilters.includes(filter) ? [] : [filter];
    setActiveFilters(updatedFilters);
    let url = `${apiUrl}websites/`;
    if (updatedFilters.length > 0) {
      url = `${apiUrl}websites/?${filter}=true`;
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
    const filteredData: ScrapedData[] = data.results.map((item: ScrapedData) => ({
      id: item.id.toString(),
      cleaned_url: item.cleaned_url,
      category: item.category,
      contact_email: item.contact_email,
      privacy_policy_url: item.privacy_policy_url,
      crawled: item.crawled,
      error_message: Boolean(item.error_message),
      last_email_sent: item.last_email_sent ? new Date(item.last_email_sent) : null,
      paid: item.paid,
      crawl_date: item.crawl_date ? new Date(item.crawl_date) : null,
      follow_up_status: item.follow_up_status,
      keyword: item.keyword?.toString() || "",
    }));
    if (data.results.length == 0) {
      setFetchFailed(true);
    }
    setSearchedQuery("");
    setCurrentPage(1);
    setScrapedData(filteredData);
    setTotalPages(Math.ceil(data.count / 10));
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
    let url = `${apiUrl}websites/?offset=${pageNumber - 1}0`;
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
    const filteredData: ScrapedData[] = data.results.map((item: ScrapedData) => ({
      id: item.id.toString(),
      cleaned_url: item.cleaned_url,
      category: item.category,
      contact_email: item.contact_email,
      privacy_policy_url: item.privacy_policy_url,
      crawled: item.crawled,
      error_message: Boolean(item.error_message),
      last_email_sent: item.last_email_sent ? new Date(item.last_email_sent) : null,
      paid: item.paid,
      crawl_date: item.crawl_date ? new Date(item.crawl_date) : null,
      follow_up_status: item.follow_up_status,
      keyword: item.keyword?.toString() || "",
    }));
    setScrapedData(filteredData);
    setTotalPages(Math.ceil(data.count / 10));
  };

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show error message if fetch failed
  if (fetchFailed) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Failed to fetch data. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg p-6 py-4 shadow-md">
        <div className="flex justify-between mb-0 items-center">
          <h2 className="text-[24px] font-semibold text-gray-800">Websites</h2>
          <button onClick={() => setAddWebsite(true)} className="px-4 py-2  text-white rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)]">
            Add Website
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
                placeholder="Search by URL"
                className="px-4 py-2 mr-4 text-[14px] min-w-[240px] rounded-md outline outline-[1px] outline-[#d9d9d9]"
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSearchClick();
                }}
                className="px-4 py-2  text-white rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mb-4 flex items-end gap-4">
            <h2>Filters:</h2>
            <div className="flex items-center gap-4">
              {["crawled", "paid", "privacy_policy_url"].map((filter) => (
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
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 select-none">
                <tr>
                  {scrapedData[0] &&
                    Object.keys(scrapedData[0]).map((header) => (
                      <th
                        key={header}
                        className={`p-3 text-[12px] leading-[1.2] font-semibold min-w-[60px] text-gray-700 text-center cursor-pointer border-r border-gray-200 ${
                          clickedColumn === header ? (isDescending ? "bg-gray-200 clickedColumn down" : "bg-gray-200 clickedColumn up") : ""
                        }`}
                        onClick={() => handleTableHeadClick(header)}
                      >
                        {header === "id"
                          ? "ID"
                          : header === "url"
                          ? "URL"
                          : header === "category"
                          ? "Category"
                          : header === "contact_email"
                          ? "Contact Email"
                          : header === "privacy_policy_url"
                          ? "Privacy Policy URL"
                          : header === "crawled"
                          ? "Crawled Status"
                          : header === "error_message"
                          ? "Error Message"
                          : header === "last_email_sent"
                          ? "Last Email Sent"
                          : header === "paid"
                          ? "Paid Status"
                          : header === "crawl_date"
                          ? "Crawl Date"
                          : header === "follow_up_status"
                          ? "Follow-up Status"
                          : header === "keyword"
                          ? "Keyword"
                          : header}
                      </th>
                    ))}
                  <th className="p-3 text-sm font-semibold text-gray-700 text-center border-r border-gray-200">Actions</th>
                </tr>
              </thead>

              <tbody>
                {scrapedData.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="border-t border-gray-200 h-[65px]">
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.id || "Not Provided"}</td>
                      <td className="p-3 py-1  max-w-[240px] text-gray-700 text-center align-middle">
                        {
                          <a href={item.cleaned_url} className="underline text-[11px]" target="_blank">
                            {item.cleaned_url}
                          </a>
                        }
                      </td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.category || "Not Provided"}</td>

                      <td
                        className="p-3 py-1 text-[11px] text-gray-700 text-center align-middle max-w-[200px] truncate select-none cursor-copy"
                        title={item.contact_email || "Not Provided"}
                        onClick={() => {
                          if (item.contact_email) {
                            navigator.clipboard.writeText(item.contact_email);
                          }
                        }}
                      >
                        {item.contact_email || "Not Provided"}
                      </td>

                      <td className="p-3 py-1  text-[13px] text-gray-700 text-center align-middle">
                        {
                          <a href={item.privacy_policy_url || "#"} className={`${item.privacy_policy_url ? "underline" : "pointer-events-none "} text-[11px]`} target="_blank" rel="noopener noreferrer">
                            {item.privacy_policy_url || "No url"}
                          </a>
                        }
                      </td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.crawled ? "Yes" : "No"}</td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.error_message ? "Has error message" : "No error message"}</td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.last_email_sent ? new Date(item.last_email_sent).toLocaleDateString() : "Not Provided"}</td>
                      <td className="p-3 py-1 text-sm text-center align-middle">
                        <div className="flex flex-col items-center space-y-2">
                          {/* Status Badge */}
                          {item.subscription_status === 'none' ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              No Subscription
                            </span>
                          ) : item.subscription_status === 'trial' ? (
                            <div className="flex flex-col items-center space-y-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.days_left > 0 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {item.subscription_status_display}
                              </span>
                              {item.days_left === 0 && (
                                <a
                                  href={`/checkout/e9197d4b?website=${encodeURIComponent(item.cleaned_url)}&email=${encodeURIComponent(item.contact_email || '')}`}
                                  className="text-xs text-blue-600 hover:underline"
                                >
                                  Upgrade
                                </a>
                              )}
                            </div>
                          ) : item.subscription_status === 'active' ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {item.subscription_status_display}
                            </span>
                          ) : item.subscription_status === 'expired' ? (
                            <div className="flex flex-col items-center space-y-1">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Expired
                              </span>
                              <a
                                href={`/checkout/e9197d4b?website=${encodeURIComponent(item.cleaned_url)}&email=${encodeURIComponent(item.contact_email || '')}`}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Renew
                              </a>
                            </div>
                          ) : item.subscription_status === 'canceled' ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Canceled
                            </span>
                          ) : item.paid ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Paid
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Paid
                            </span>
                          )}


                        </div>
                      </td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.crawl_date ? new Date(item.crawl_date).toLocaleDateString() : "Not Provided"}</td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.follow_up_status ? "Has follow up status" : "No follow up status"}</td>
                      <td className="p-3 py-1  text-sm text-gray-700 text-center align-middle">{item.keyword || "Not Provided"}</td>
                      <td className="p-3 py-1 leading-none text-sm text-gray-700 text-center align-middle">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleReset(item)}
                            className={`px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-100 text-black ${!item.crawled ? "opacity-50 select-none pointer-events-none" : ""}`}
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => {
                              // Only generate link if not already paid
                              if (item.paid) {
                                alert('This website has already paid. You cannot generate a new payment link.');
                                return;
                              }

                              // Create a payment link with the website and email pre-filled
                              const paymentLink = `/checkout/e9197d4b?website=${encodeURIComponent(item.cleaned_url)}&email=${encodeURIComponent(item.contact_email || '')}`;

                              // Copy to clipboard
                              navigator.clipboard.writeText(window.location.origin + paymentLink)
                                .then(() => {
                                  alert('Payment link copied to clipboard!');
                                })
                                .catch(err => {
                                  console.error('Could not copy link: ', err);
                                  alert('Payment link: ' + window.location.origin + paymentLink);
                                });
                            }}
                            className={`px-4 py-2 rounded-md ${item.paid ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'} text-white`}
                            title={item.paid ? 'This website has already paid' : 'Generate payment link'}
                          >
                            Generate Link
                          </button>
                          {item.paid && (
                            <button
                              onClick={async () => {
                                if (confirm('Are you sure you want to cancel the subscription for this website?')) {
                                  try {
                                    // Call API to cancel subscription
                                    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000/'}websites/${item.id}/cancel_subscription/`, {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Basic ${btoa(`${process.env.REACT_APP_API_USERNAME || ''}:${process.env.REACT_APP_API_PASSWORD || ''}`)}`
                                      }
                                    });

                                    if (response.ok) {
                                      alert('Subscription successfully cancelled.');
                                      // Refresh the data
                                      window.location.reload();
                                    } else {
                                      const errorData = await response.json();
                                      alert(`Error cancelling subscription: ${errorData.error || 'Unknown error'}`);
                                    }
                                  } catch (error) {
                                    console.error('Error cancelling subscription:', error);
                                    alert('An error occurred while cancelling the subscription. Please try again.');
                                  }
                                }
                              }}
                              className="px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 active:bg-red-100 text-red-800"
                            >
                              Cancel Subscription
                            </button>
                          )}
                          <button onClick={() => handleDelete(item)} className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-100 text-black">
                            Delete
                          </button>
                          {item.subscriptions && item.subscriptions.length > 0 && (
                            <button
                              onClick={() => toggleRowExpansion(item.id)}
                              className="px-4 py-2 bg-blue-100 rounded-md hover:bg-blue-200 active:bg-blue-100 text-blue-800"
                            >
                              {expandedRows[item.id] ? 'Hide' : 'Show'} Subscriptions
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable row for subscriptions */}
                    {expandedRows[item.id] && item.subscriptions && item.subscriptions.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan={13} className="p-4">
                          <div className="text-sm">
                            <h4 className="font-semibold mb-2">Subscriptions</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="p-2 text-xs font-semibold text-left">ID</th>
                                    <th className="p-2 text-xs font-semibold text-left">Type</th>
                                    <th className="p-2 text-xs font-semibold text-left">Product</th>
                                    <th className="p-2 text-xs font-semibold text-left">Amount</th>
                                    <th className="p-2 text-xs font-semibold text-left">Status</th>
                                    <th className="p-2 text-xs font-semibold text-left">Email Status</th>
                                    <th className="p-2 text-xs font-semibold text-left">Email Sent</th>
                                    <th className="p-2 text-xs font-semibold text-left">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.subscriptions.map((sub: Subscription) => (
                                    <tr key={sub.id} className="border-t border-gray-200">
                                      <td className="p-2 text-xs">{sub.id}</td>
                                      <td className="p-2 text-xs">{sub.payment_type}</td>
                                      <td className="p-2 text-xs">{sub.product_details?.name || 'N/A'}</td>
                                      <td className="p-2 text-xs">
                                        {sub.amount ? `$${sub.amount} ${sub.currency}` : 'N/A'}
                                      </td>
                                      <td className="p-2 text-xs">
                                        <span className={`px-2 py-1 rounded-full text-xs ${sub.status === 'completed' ? 'bg-green-100 text-green-800' : sub.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : sub.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                          {sub.status}
                                        </span>
                                      </td>
                                      <td className="p-2 text-xs">
                                        <span className={`px-2 py-1 rounded-full text-xs ${sub.email_status === 'sent' || sub.email_status === 'resent' ? 'bg-green-100 text-green-800' : sub.email_status === 'not_sent' ? 'bg-gray-100 text-gray-800' : sub.email_status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                          {sub.email_status_display || sub.email_status}
                                        </span>
                                      </td>
                                      <td className="p-2 text-xs">
                                        {sub.email_sent_at ? new Date(sub.email_sent_at).toLocaleString() : 'Never'}
                                        {sub.email_resend_count > 0 && (
                                          <span className="ml-1 text-xs text-gray-500">
                                            (Resent {sub.email_resend_count} times)
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-2 text-xs">
                                        {sub.status === 'completed' && (
                                          <button
                                            onClick={() => handleResendEmail(sub.id)}
                                            className="px-2 py-1 bg-blue-100 rounded-md hover:bg-blue-200 active:bg-blue-100 text-blue-800 text-xs"
                                            disabled={sub.email_status === 'sending'}
                                          >
                                            {sub.email_status === 'sending' ? 'Sending...' : 'Resend Email'}
                                          </button>
                                        )}
                                        {sub.last_email_error && (
                                          <div className="mt-1 text-xs text-red-600">
                                            Error: {sub.last_email_error}
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
                  currentPage === totalPages || scrapedData.length === 0 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      {addWebsite && <WebsiteForm setWebsiteForm={setAddWebsite} handleAdd={handleAdd} handleCSVAdd={handleCSVAdd} />}
    </>
  );
};

export default Websites;
