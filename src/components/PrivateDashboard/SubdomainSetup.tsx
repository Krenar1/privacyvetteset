import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import SubdomainList from "./SubdomainList";

const SubdomainSetup = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [subdomainUrl, setSubdomainUrl] = useState<string | null>(null);

  const handleSubdomainCreated = (url: string) => {
    setSuccess(true);
    setSubdomainUrl(url);
  };

  return (
    <div className="space-y-6">
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-600 flex items-center">
              <CheckCircle2 className="mr-2 h-6 w-6" />
              Subdomain Created Successfully!
            </CardTitle>
            <CardDescription>
              Your branded PrivacyVet instance is now available at the URL below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 rounded-md border border-green-200">
              <p className="font-medium">Your subdomain URL:</p>
              <a
                href={subdomainUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {subdomainUrl}
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                It may take a few minutes for your subdomain to become fully active.
                If you encounter any issues, please contact our support team.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
              }}
            >
              Back to Subdomain List
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <SubdomainList onSubdomainCreated={handleSubdomainCreated} />
      )}
    </div>
  );
};

export default SubdomainSetup;
