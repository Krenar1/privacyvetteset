import { useState } from "react";
import Papa from "papaparse";

type WebsiteProps = {
  setWebsiteForm: (value: boolean) => void;
  handleAdd: (websiteData: { url: string; email: string }) => void;
  handleCSVAdd: (websiteData: any) => void;
};

function WebsiteForm({ setWebsiteForm, handleAdd, handleCSVAdd }: WebsiteProps) {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [csvData, setCsvData] = useState<{ url: string; email: string }[]>([]);

  const addWebsite = () => {
    if (csvData.length > 0) {
      handleCSVAdd(csvData);
    } else if (url) {
      // Include email in the websiteData (defaults to "" if not provided)
      const websiteData = { url, email };
      handleAdd(websiteData);
    }
    // Reset the form fields
    setCsvData([]);
    setUrl("");
    setEmail("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const parsedData = result.data.map((row: any) => ({
            url: row.urls || "Not provided",
            email: row.emails || ""
          }));
          setCsvData(parsedData);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <>
      <div className="absolute w-screen top-0 bottom-0 left-0 min-h-full z-50 flex items-center justify-center bg-black/50">
        <div className="flex items-center gap-4 text-black shadow-[0_0_1px_black] bg-gray-100 min-w-[500px] min-h-[300px] py-[30px] px-[60px] flex flex-col items-center justify-center text-white rounded-[10px] font-medium gap-[20px]">
          <form onSubmit={(event) => event.preventDefault()} className="w-full space-y-4 text-black">
            <div>
              <label htmlFor="url" className="block text-sm font-semibold mb-2">
                Website URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full p-2 text-gray-900 rounded-lg outline outline-[1px] outline-[#d9d9d9]"
                placeholder="Enter the website URL"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2">
                Email (optional)
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-gray-900 rounded-lg outline outline-[1px] outline-[#d9d9d9]"
                placeholder="Enter the email"
              />
            </div>

            {/* File upload for CSV */}
            <div>
              <label htmlFor="csv-upload" className="block text-sm font-semibold mb-2 leading-6">
                Upload CSV *
                <br />
                <span className="text-[11px] text-red-600 bg-red-100 border border-red-200 px-2 py-1 rounded">
                  Please ensure the file contains a column labeled "urls". Column "emails" is optional
                </span>
              </label>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="w-full p-2 text-gray-900 rounded-lg outline outline-[1px] outline-[#d9d9d9]"
              />
            </div>
          </form>

          <div className="flex gap-[20px] text-gray-900 mt-4 w-full justify-between">
            <button onClick={addWebsite} className="p-2 px-4 text-white bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)] rounded-lg">
              Add Website
            </button>
            <button onClick={() => setWebsiteForm(false)} className="p-2 px-4 text-white bg-primary hover:bg-[rgb(22,156,207)] active:bg-[rgb(20,127,167)] rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WebsiteForm;
