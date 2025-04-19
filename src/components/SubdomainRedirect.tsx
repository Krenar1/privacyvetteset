import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSubdomain } from "@/hooks/use-subdomain";

/**
 * This component is used to handle subdomain detection and redirection.
 * It's useful for local development where we can't use real subdomains.
 */
const SubdomainRedirect = () => {
  const navigate = useNavigate();
  const { isSubdomain, subdomainName, isLoading } = useSubdomain();
  const [message, setMessage] = useState("Detecting subdomain...");

  useEffect(() => {
    if (!isLoading) {
      if (isSubdomain && subdomainName) {
        setMessage(`Detected subdomain: ${subdomainName}. Redirecting...`);
        // Redirect to the subdomain view
        navigate(`/s/${subdomainName}`);
      } else {
        setMessage("No subdomain detected. Redirecting to home...");
        navigate("/");
      }
    }
  }, [isLoading, isSubdomain, subdomainName, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        {isLoading && <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />}
        <p className="text-lg text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default SubdomainRedirect;
