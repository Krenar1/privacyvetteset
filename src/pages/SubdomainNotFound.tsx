import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertTriangle } from "lucide-react";

interface SubdomainNotFoundProps {
  subdomain: string;
}

const SubdomainNotFound = ({ subdomain }: SubdomainNotFoundProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Subdomain Not Found</h1>
          
          <p className="text-gray-600 mb-6">
            The subdomain <span className="font-semibold text-amber-600">{subdomain}</span> does not exist or has not been set up yet.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Return to Home
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate("/dashboard/subdomains")}
              className="w-full"
            >
              Set Up a Subdomain
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SubdomainNotFound;
