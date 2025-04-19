import { useState } from "react";
import ApiLink from "../../../apiLink";
import { ImageDropzone } from "@/components/ImageDropzone";
import { ColorPicker } from "@/components/ColorPicker";
import { useToast } from "@/hooks/use-toast";

export function Setup() {
  const [subdomain, setSubdomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#00AEEF");
  const [accentColor, setAccentColor] = useState("#10B981");
  const [logo, setLogo] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("subdomain", subdomain.toLowerCase());
    formData.append("primary_color", primaryColor);
    formData.append("accent_color", accentColor);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      const response = await fetch(`${ApiLink.url}/setup`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Setup failed");
      }

      setSuccess(true);
      window.location.href = `https://${subdomain}.privacyvet.com`;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Setup failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pb-20">
      <div className="bg-gray-100 rounded-lg p-6 shadow-sm w-[480px] mx-auto">
        <h2 className="text-lg font-semibold mb-4">Setup Your Account</h2>
        {success ? (
          <div className="text-green-600 mb-4">
            Setup completed successfully! Redirecting...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subdomain
              </label>
              <input
                type="text"
                className="mt-1 p-2 w-full border rounded-lg text-gray-700 outline-none"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value)}
                required
                pattern="^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$"
                title="Subdomain can only contain letters, numbers, and hyphens. It must start and end with a letter or number."
                minLength={3}
                maxLength={63}
              />
              <p className="mt-1 text-sm text-gray-500">
                Your site will be available at: {subdomain}.privacyvet.com
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <ImageDropzone
                onImageUpload={(file) => setLogo(file)}
              />
            </div>

            <ColorPicker
              label="Primary Color"
              value={primaryColor}
              onChange={setPrimaryColor}
            />

            <ColorPicker
              label="Accent Color"
              value={accentColor}
              onChange={setAccentColor}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 bg-primary text-white rounded-lg relative ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
              }`}
            >
              {loading ? "Setting up..." : "Complete Setup"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
