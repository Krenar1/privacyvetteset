import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { SectionHeading } from "./ui-components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Loader2, Shield } from "lucide-react";
import ApiLink from "../../apiLink";

const ScanWebsite: React.FC = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(
    "Make sure your privacy policy URL is entered correctly (e.g., https://yourdomain.com/policy)."
  );
  const apiLink = ApiLink.url;

  const isButtonDisabled = loading || !url || !url.includes(".");

  const handleScan = async () => {
    if (isButtonDisabled) {
      setError("Please enter a valid URL.");
      setTimeout(() => {
        setError("Make sure your privacy policy URL is entered correctly (e.g., https://yourdomain.com/policy).");
      }, 5000);
      setUrl("");
      return;
    }

    setError("Make sure your privacy policy URL is entered correctly (e.g., https://yourdomain.com/policy).");
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(apiLink + "scan-website/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data);
      console.log(result, result?.issues[0])
      setDialogOpen(true);
    } catch (error) {
      setError("Scan failed. Please try again.");
      setTimeout(() => {
        setError("Make sure your privacy policy URL is entered correctly (e.g., https://yourdomain.com/policy).");
      }, 2000);
    } finally {
      setLoading(false);
      setUrl("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Define the keywords to check for in the URL.
    const keywords = ["policy", "notice", "statement", "privacy", "policies"];
    // Check if the URL (in lowercase) includes any of the keywords.
    const containsKeyword = keywords.some((keyword) =>
      url.toLowerCase().includes(keyword)
    );

    if (!containsKeyword) {
      setConfirmDialogOpen(true);
      return;
    }

    // If it contains a keyword, proceed with the scan.
    handleScan();
  };

  return (
    <div
      className="md:max-w-[1220px] p-4 py-8 relative xl:mx-auto mx-[10px] rounded-lg bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(180, 180, 180, 0.3), rgba(32, 32, 32, 0.3)), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4gI4Nhb1pwGI-5HxDprIO9xqqNEBCUqPkIA&s')",
      }}
    >
      {window.innerWidth > 1300 ? (
        <>
          <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-primary/80 z-[11] animate-pulse-slow" />
          <div
            className="absolute bottom-[10%] right-[5%] w-20 h-20 rounded-full bg-primary/40 z-[11] animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
        </>
      ) : null}

<div>

      <SectionHeading
        type="secondary"
        subtitle="Scan your Website"
        title="Assess your website's compliance status."
        content="Don't risk costly fines or reputational damage—ensure your business is compliant today. Stay ahead of regulatory changes, protect your customers' trust, and secure your future by verifying your privacy policies and procedures now."
        centered
        className="mb-10 md:mx-40"
        />

        </div>
      <form
        onSubmit={handleSubmit}
        className="flex md:flex-row flex-col items-center md:mx-40 mt-12 gap-4 relative"
      >
        {error && (
          <p
            style={{
              color: (error || "").includes("Make sure") ? "black" : "red",
              fontSize:window.innerWidth < 350 ? "12px" : "14px",
              top:window.innerWidth < 930 && window.innerWidth > 767 ? "-55px" : "-34px"
            }}
            className="absolute text-[14px] md:mt-2 font-[400] bg-white/50 px-2 rounded-sm text-center"
          >
            {error}
          </p>
        )}
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="w-full md:max-w-[800px] md:flex-2 border md:mt-0 mt-4 border-gray-300 rounded-lg px-6 py-[9px] outline-none"
        />
        <Button
          variant="secondary"
          type="submit"
          className={`w-full md:max-w-[800px] md:flex-1 min-w-[240px] rounded-lg text-[16px] ${
            isButtonDisabled ? "text-gray-500" : ""
          } ${loading ? "select-none pointer-events-none" : ""}`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2 text-black" />
              <span className="text-black">Scanning for Compliance</span>
            </>
          ) : (
            "Scan"
          )}
        </Button>
      </form>

      {/* Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg p-10">
          <div className="hidden">
            <DialogTitle>Compliance Status</DialogTitle>
          </div>
          <DialogHeader>
            <DialogDescription className="text-lg md:text-xl">
              <div className="flex items-center space-x-3 mb-4">
                <Shield
                  className={`${
                    result?.compliancy === "Compliant"
                      ? "text-green-600"
                      : "text-red-600"
                  } h-8 w-8`}
                />
                <span
                  className={`font-bold ${
                    result?.compliancy === "Compliant"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {result?.compliancy == "Unknown" ? "Missing" : result?.compliancy}
                </span>
              </div>
              {result?.compliancy === "Compliant" ? (
                <p className="mb-4 text-left">
                  Your website complies with all necessary privacy regulations. You're all set!
                </p>
              ) : result?.compliancy === "Non-Compliant" ? (
                <p className="mb-2 text-left text-[19px]" style={{lineHeight:1.3}}>
                  It appears your website's privacy policy needs attention. Please review the following issue:{" "}<br/>
                  <span className="font-semibold">{result?.issues[0]}</span>.<br/>
                  <span className="text-red-600 font-semibold" style={{lineHeight:2}}>
                    {result?.issues.length > 1 && " There are more issues that need attention."}
                    </span>
                </p>
              ) : result?.compliancy === "Unknown" ? (
                <p className="mb-4 text-left text-[19px]">
                  {result?.issues[0].includes("The URL does not appear to have enough content to be a privacy policy") ? "This site does not appear to contain sufficient content to be a valid privacy policy." : "Your website is missing a privacy policy page. Please publish one to ensure compliance."}
                  
                </p>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            {(result?.compliancy === "Non-Compliant" || result?.compliancy === "Unknown") && (
              <Link
                to="/schedule"
                className="bg-primary text-white text-center py-2 px-6 rounded-md font-semibold hover:bg-primary/90 w-full sm:flex-1"
              >
                Schedule a Consultant
              </Link>
            )}
            <Button
              variant="secondary"
              onClick={() => setDialogOpen(false)}
              className="w-full sm:flex-1 font-semibold text-[16px]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for URL keywords */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-lg p-10">
          <DialogHeader>
            <DialogTitle>Confirm URL</DialogTitle>
            <DialogDescription>
              Are you sure that you typed the right privacy policy page for your site?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              variant="secondary"
              onClick={() => {
                setConfirmDialogOpen(false);
                setError("Please provide the correct privacy policy URL.");
                setTimeout(() => {
                  setError("Make sure your privacy policy URL is entered correctly (e.g., https://yourdomain.com/policy).");
                }, 3000);
              }}
              className="w-full sm:flex-1"
            >
              No, Cancel
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setConfirmDialogOpen(false);
                handleScan();
              }}
              className="w-full sm:flex-1"
            >
              Yes, Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScanWebsite;
