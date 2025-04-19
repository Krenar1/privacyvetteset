import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ApiLink from "../../apiLink";

interface PaymentLinkType {
  id: string;
  type: "free_audit" | "one_time" | "monthly";
  email: string;
  created_at: string;
  expires_at: string;
  used: boolean;
}

export function PaymentLinks() {
  const [links, setLinks] = useState<PaymentLinkType[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedType, setSelectedType] = useState<"free_audit" | "one_time" | "monthly">("one_time");
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const generateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${ApiLink.url}/generate-payment-link/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          type: selectedType
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate payment link");
      }

      const data = await response.json();
      setLinks(prev => [data, ...prev]);
      setEmail("");
      
      toast({
        title: "Success",
        description: "Payment link generated and email sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate payment link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Generate Payment Links</h2>
      
      <form onSubmit={generateLink} className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Client Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="client@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as PaymentLinkType["type"])}
            className="w-full p-2 border rounded-md"
          >
            <option value="free_audit">Free Audit</option>
            <option value="one_time">One-time Update ($99)</option>
            <option value="monthly">Monthly Subscription ($29/mo)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Generating..." : "Generate Payment Link"}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Recent Payment Links</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {links.map((link) => (
                <tr key={link.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {link.type === "free_audit" ? "Free Audit" : 
                     link.type === "one_time" ? "One-time Update" : 
                     "Monthly Subscription"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(link.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(link.expires_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      link.used ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {link.used ? "Used" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 