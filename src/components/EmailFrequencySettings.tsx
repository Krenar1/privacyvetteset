import { useState, useEffect } from "react";
import ApiLink from "../../apiLink";
import { useToast } from "@/hooks/use-toast";

interface EmailFrequencySettingsType {
  frequency: "daily" | "weekly" | "monthly" | "custom";
  custom_days?: number;
  emails_per_batch: number;
  time_between_batches: number;
  active: boolean;
  last_run?: string;
}

export function EmailFrequencySettings() {
  const [settings, setSettings] = useState<EmailFrequencySettingsType>({
    frequency: "daily",
    emails_per_batch: 50,
    time_between_batches: 60,
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${ApiLink.url}/email-frequency-settings/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }

      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load email frequency settings",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${ApiLink.url}/email-frequency-settings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update settings");
      }

      const data = await response.json();
      setSettings(data);
      toast({
        title: "Success",
        description: "Email frequency settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Email Frequency Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frequency
          </label>
          <select
            value={settings.frequency}
            onChange={(e) => setSettings({ ...settings, frequency: e.target.value as EmailFrequencySettingsType["frequency"] })}
            className="w-full p-2 border rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {settings.frequency === "custom" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Days
            </label>
            <input
              type="number"
              value={settings.custom_days || ""}
              onChange={(e) => setSettings({ ...settings, custom_days: parseInt(e.target.value) })}
              className="w-full p-2 border rounded-md"
              min="1"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emails Per Batch
          </label>
          <input
            type="number"
            value={settings.emails_per_batch}
            onChange={(e) => setSettings({ ...settings, emails_per_batch: parseInt(e.target.value) })}
            className="w-full p-2 border rounded-md"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Between Batches (minutes)
          </label>
          <input
            type="number"
            value={settings.time_between_batches}
            onChange={(e) => setSettings({ ...settings, time_between_batches: parseInt(e.target.value) })}
            className="w-full p-2 border rounded-md"
            min="1"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="active"
            checked={settings.active}
            onChange={(e) => setSettings({ ...settings, active: e.target.checked })}
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
            Active
          </label>
        </div>

        {settings.last_run && (
          <div className="text-sm text-gray-600">
            Last Run: {new Date(settings.last_run).toLocaleString()}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
} 