import React, { useState, useEffect } from "react";
import ApiLink from "../../../apiLink";
import Auth from "../../../auth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type EmailData = {
  id: string;
  website: string;
  URL: string;
  email: string;
  compliance_status: string;
  emailed: boolean;
};

type EmailTemplate = {
  type: string;
  content: string;
};

const Emails: React.FC = () => {
  const [emailsData, setEmailsData] = useState<EmailData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetchFailed, setFetchFailed] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typedQuery, setTypedQuery] = useState<string>("");
  const apiUrl: string = ApiLink.url;
  const username: string = Auth.user;
  const password: string = Auth.password;

  const [emailsPerHour, setEmailsPerHour] = useState<number>(1);
  const [isEmailsPerHourEnabled, setIsEmailsPerHourEnabled] = useState<boolean>(false);

  const [includeEmail, setIncludeEmail] = useState<string>("");
  const [includeEmailError, setIncludeEmailError] = useState<string>("");

  const [isEditEmail, setIsEditEmail] = useState<boolean>(false);
  const [isBulkEditDialogOpen, setIsBulkEditDialogOpen] = useState<boolean>(false);
  const [editedEmail, setEditedEmail] = useState<string>("");

  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [isRowEditDialogOpen, setIsRowEditDialogOpen] = useState<boolean>(false);
  const [rowEditedEmail, setRowEditedEmail] = useState<string>("");
  const [rowEditedCompliance, setRowEditedCompliance] = useState<string>("");

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);

  const [selectedEmailIds, setSelectedEmailIds] = useState<string[]>([]);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const offset = (currentPage - 1) * 10;
    const queryParam = searchQuery
      ? `?contact_email=${encodeURIComponent(searchQuery)}`
      : "?contact_email=true";
    const fetchUrl = `${apiUrl}websites/${queryParam}&offset=${offset}&last_email_sent=null`;
  
    // Replace these with your actual username and password.
    const basicAuth = 'Basic ' + btoa(`${username}:${password}`);
  
    fetch(fetchUrl, {
      headers: {
        Authorization: basicAuth
      }
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedData: EmailData[] = data.results.map((item: any) => ({
          id: item.id.toString(),
          website: item.cleaned_url,
          URL: item.cleaned_url,
          email: item.contact_email,
          compliance_status: item.compliance_status || "Unknown",
          emailed: false,
        }));
        setEmailsData(mappedData);
        setTotalPages(Math.ceil(data.count / 10));
        if (data.results.length === 0) {
          setFetchFailed(true);
        }
      })
      .catch((error) => {
        setFetchFailed(true);
        console.error("Error fetching emails:", error);
      });
  }, [apiUrl, currentPage, searchQuery]);
  


  useEffect(() => {
    if (isBulkEditDialogOpen) {
      const basicAuth = "Basic " + btoa(`${username}:${password}`);
      fetch(`${apiUrl}email-templates`, {
        headers: {
          Authorization: basicAuth,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Email templates data:", data);
          setEmailTemplates(data);
        })
        .catch((error) =>
          console.error("Error fetching email templates:", error)
        );
    }
  }, [isBulkEditDialogOpen, apiUrl]);
  

  useEffect(() => {
    if (isBulkEditDialogOpen && emailTemplates.length > 0) {
      const selectedEmails = emailsData.filter((item) =>
        selectedEmailIds.includes(item.id)
      );
      const hasMissingCompliance = selectedEmails.some(
        (item) => item.compliance_status === "Missing"
      );
      const hasNonCompliant = selectedEmails.some(
        (item) => item.compliance_status === "Non-Compliant"
      );
      const missingTemplate = emailTemplates.find(
        (template) => template.type === "missing_compliance"
      );
      const nonCompliantTemplate = emailTemplates.find(
        (template) => template.type === "non_compliant"
      );
      if (hasMissingCompliance && missingTemplate) {
        setEditedEmail(missingTemplate.content);
      } else if (hasNonCompliant && nonCompliantTemplate) {
        setEditedEmail(nonCompliantTemplate.content);
      } else if (missingTemplate) {
        setEditedEmail(missingTemplate.content);
      }
    }
  }, [isBulkEditDialogOpen, emailTemplates, emailsData, selectedEmailIds]);

  // Toggle the selection state for an individual email (if not already emailed)
  const handleCheckboxClick = (id: string) => {
    // Prevent toggling if the email has been sent
    const emailItem = emailsData.find((item) => item.id === id);
    if (emailItem && emailItem.emailed) return;

    setSelectedEmailIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
    console.log(`Toggled selection for ID: ${id}`);
  };

  // Select or deselect all non-emailed emails on the current page
  const handleSelectAllEmails = () => {
    const nonEmailedEmails = emailsData.filter((item) => !item.emailed);
    const areAllSelected = nonEmailedEmails.every((item) =>
      selectedEmailIds.includes(item.id)
    );
    if (areAllSelected) {
      // Deselect all on the current page
      setSelectedEmailIds((prev) =>
        prev.filter((id) => !nonEmailedEmails.some((item) => item.id === id))
      );
    } else {
      // Add all non-emailed email IDs from the current page
      setSelectedEmailIds((prev) => [
        ...new Set([...prev, ...nonEmailedEmails.map((item) => item.id)]),
      ]);
    }
  };

  const handleSendEmailsForSelected = () => {
    if (includeEmail && !isValidEmail(includeEmail)) {
      setIncludeEmailError("Invalid Include Email address provided.");
      return;
    } else {
      setIncludeEmailError("");
    }
    if (isEditEmail && !isBulkEditDialogOpen) {
      setIsBulkEditDialogOpen(true);
      return;
    }
    if (selectedEmailIds.length === 0) return;
  
    const payload = {
      web_ids: selectedEmailIds,
      additionalEmail: includeEmail,
      edited_email: editedEmail || "",
      frequency: isEmailsPerHourEnabled ? emailsPerHour : ""
    };
  
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
  
    fetch(`${apiUrl}send-bulk-missing-compliance/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send bulk emails");
        }
        return response.json();
      })
      .then((data) => {
        setEmailsData((prevData) =>
          prevData.map((item) =>
            selectedEmailIds.includes(item.id)
              ? { ...item, emailed: true }
              : item
          )
        );
        setSelectedEmailIds([]);
        if (isBulkEditDialogOpen) {
          setIsBulkEditDialogOpen(false);
          setIsEditEmail(false);
        }
      })
      .catch((error) => {
        console.error("Error sending bulk emails:", error);
      });
  };
  

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(typedQuery);
  };

  const handleEdit = (id: string, currentEmail: string, currentCompliance: string) => {
    setEditingRowId(id);
    setRowEditedEmail(currentEmail);
    setRowEditedCompliance(currentCompliance);
    setIsRowEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const deleteUrl = `${apiUrl}websites/${id}/`;
    const basicAuth = "Basic " + btoa(`${username}:${password}`);
    try {
      const response = await fetch(deleteUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: basicAuth,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete resource");
      }
      setEmailsData((prevData) => prevData.filter((item) => item.id !== id));
      console.log(`Deleted record with id: ${id}`);
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  

  const handleRowDialogSend = async () => {
    if (editingRowId) {
      const updateUrl = `${apiUrl}websites/${editingRowId}/`;
      const payload = {
        contact_email: rowEditedEmail,
        compliance_status: rowEditedCompliance,
      };
      const basicAuth = "Basic " + btoa(`${username}:${password}`);
      try {
        const response = await fetch(updateUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: basicAuth,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error("Failed to update record");
        }
        setEmailsData((prevData) =>
          prevData.map((item) =>
            item.id === editingRowId
              ? { ...item, email: rowEditedEmail, compliance_status: rowEditedCompliance }
              : item
          )
        );
        console.log(`Updated record ${editingRowId} with email: ${rowEditedEmail} and compliance: ${rowEditedCompliance}`);
      } catch (error) {
        console.error("Error updating record:", error);
      }
      setEditingRowId(null);
      setRowEditedEmail("");
      setRowEditedCompliance("");
      setIsRowEditDialogOpen(false);
    }
  };
  

  return (
    <>
      <div className="bg-white rounded-lg p-6 py-4 shadow-md">
        <div className="flex justify-between mb-0 items-center">
          <h2 className="text-[24px] font-semibold text-gray-800">Emails</h2>
        </div>
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
          <div className="flex flex-row gap-4 mb-4 items-center relative">
            <div className="relative">
              <input
                id="emailsPerHour"
                type="number"
                value={emailsPerHour}
                onChange={(e) => setEmailsPerHour(Number(e.target.value))}
                className="peer w-[150px] px-4 py-2 pr-15 rounded-[50px] no-spinner outline outline-[1px] outline-[#d9d9d9]"
              />
              <Label
                htmlFor="emailsPerHour"
                className="pointer-events-none absolute text-s text-gray-600"
                style={{ top: "-20px", left: "0px" }}
              >
                Frequency
              </Label>
              <div
                className="flex items-center space-x-2 absolute"
                style={{ top: "50%", right: "10px", transform: "translateY(-50%)" }}
              >
                <Switch
                  id="frequency"
                  checked={isEmailsPerHourEnabled}
                  onCheckedChange={(checked) => setIsEmailsPerHourEnabled(checked)}
                />
              </div>
            </div>
            <div className="relative">
              <input
                id="includeEmail"
                type="email"
                value={includeEmail}
                placeholder="ex. Joe@asaasin.ai"
                onChange={(e) => setIncludeEmail(e.target.value)}
                className="peer w-[250px] px-4 pr-15 py-2 rounded-[50px] no-spinner outline outline-[1px] outline-[#d9d9d9]"
              />
              <Label
                htmlFor="includeEmail"
                className="pointer-events-none absolute text-s text-gray-600"
                style={{ top: "-20px", left: "0px" }}
              >
                Include Email
              </Label>
              {includeEmailError && (
                <p className="mt-1 text-xs text-red-500">{includeEmailError}</p>
              )}
            </div>
            <button
              onClick={handleSelectAllEmails}
              className="px-4 py-2 text-white cursor-pointer rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)]"
            >
              {!emailsData.filter((item) => !item.emailed).every((item) =>
                selectedEmailIds.includes(item.id)
              )
                ? "Select All"
                : "Deselect All"}
            </button>
            <button
              onClick={handleSendEmailsForSelected}
              className="px-4 py-2 text-white cursor-pointer rounded-md bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)] disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={
                selectedEmailIds.length === 0 ||
                (includeEmail && !isValidEmail(includeEmail))
              }
            >
              Send Email to Selected
            </button>
            <div className="absolute top-[-35px] right-0 flex items-center gap-4">
              <Label htmlFor="editEmailSwitch" className="text-s text-gray-600">
                Edit Email Content
              </Label>
              <Switch
                id="editEmailSwitch"
                checked={isEditEmail}
                onCheckedChange={(checked) => setIsEditEmail(checked)}
              />
            </div>
          </div>
        </div>
        <Dialog
          open={isBulkEditDialogOpen}
          onOpenChange={(open) => {
            setIsBulkEditDialogOpen(open);
            if (!open) setEditedEmail("");
          }}
        >
          <DialogContent className="min-w-[50%]">
            <DialogHeader>
              <DialogTitle>Edit Bulk Email Content</DialogTitle>
              <DialogDescription>
                Please edit the content of your email and click Send.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <textarea
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="px-4 py-2 outline outline-[1px] outline-[#d9d9d9] rounded-md w-full min-h-[410px]"
                placeholder="Enter email content"
                rows={6}
              />
            </div>
            <DialogFooter>
              <button
                onClick={handleSendEmailsForSelected}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Send
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isRowEditDialogOpen} onOpenChange={setIsRowEditDialogOpen}>
          <DialogContent className="min-w-[50%]">
            <DialogHeader>
              <DialogTitle>Edit Email</DialogTitle>
              <DialogDescription>
                Update the email and compliance for the selected row.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <input
                type="email"
                value={rowEditedEmail}
                onChange={(e) => setRowEditedEmail(e.target.value)}
                className="px-4 py-2 outline outline-[1px] outline-[#d9d9d9] rounded-md w-full mb-4"
                placeholder="Enter new email"
              />
              <select
                value={rowEditedCompliance}
                onChange={(e) => setRowEditedCompliance(e.target.value)}
                className="px-4 py-2 outline outline-[1px] outline-[#d9d9d9] rounded-md w-full"
              >
                <option value="Missing">Missing</option>
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>
            <DialogFooter>
              <button
                onClick={handleRowDialogSend}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Save
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="overflow-x-auto">
          {emailsData[0] ? (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100 select-none">
                <tr>
                  <th className="p-3 text-[13px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    ID
                  </th>
                  <th className="p-3 text-[13px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Website
                  </th>
                  <th className="p-3 text-[12px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Email
                  </th>
                  <th className="p-3 text-[13px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Compliance
                  </th>
                  <th className="p-3 text-[13px] font-semibold text-gray-700 text-center border-r border-gray-200">
                    Selected
                  </th>
                  <th className="p-3 text-[13px] font-semibold text-gray-700 text-center">
                    Actions
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
                      <a
                        href={item.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[12px]"
                      >
                        {item.URL}
                      </a>
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle max-w-[240px] truncate">
                      {item.email || "No email provided"}
                    </td>
                    <td className="p-3 py-1 text-sm text-gray-700 text-center align-middle max-w-[240px] truncate">
                      {item.compliance_status}
                    </td>
                    <td className="py-1 text-sm text-gray-700 text-center align-middle">
                      {item.emailed ? (
                        <span>Sent</span>
                      ) : (
                        <label className="inline-flex items-center p-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 cursor-pointer"
                            checked={selectedEmailIds.includes(item.id)}
                            onChange={() => handleCheckboxClick(item.id)}
                          />
                        </label>
                      )}
                    </td>
                    <td className="p-3 text-center align-middle">
                      <button
                        onClick={() =>
                          handleEdit(item.id, item.email, item.compliance_status)
                        }
                        className="px-4 py-1 mr-2 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-100 text-black text-[15px]"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-1 bg-gray-100 rounded-md hover:bg-gray-200 active:bg-gray-100 text-black text-[15px]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : fetchFailed ? (
            <div className="text-center px-10 py-5 text-black">
              No records found. Try adjusting your search.
            </div>
          ) : (
            <div className="flex justify-center items-center px-10 py-5">
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
            </div>
          )}
        </div>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => currentPage !== 1 && handlePageClick(currentPage - 1)}
                className={`hover:bg-gray-200 active:bg-gray-100 hover:text-black cursor-pointer ${
                  currentPage === 1 || emailsData.length === 0 ? "pointer-events-none opacity-50" : ""
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
                  currentPage === totalPages || emailsData.length === 0 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
};

export default Emails;
