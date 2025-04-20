import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CookieToolService, Domain, ConsentStats } from "@/services/cookieToolService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Download, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Analytics: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [stats, setStats] = useState<ConsentStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [downloading, setDownloading] = useState<boolean>(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    // Fetch available domains when component mounts
    const fetchDomains = async () => {
      try {
        setLoading(true);
        const domainList = await CookieToolService.getDomains();
        setDomains(domainList);
        
        // Default to the first domain if available
        if (domainList.length > 0) {
          setSelectedDomain(domainList[0].id);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch domains:", err);
        setError("Failed to load domains. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    // Fetch stats when selected domain changes
    fetchStats();
  }, [selectedDomain]);

  // Function to fetch stats for the selected domain
  const fetchStats = async () => {
    if (!selectedDomain) return;
    
    try {
      setLoading(true);
      const domainStats = await CookieToolService.getDomainStats(selectedDomain);
      setStats(domainStats);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError("Failed to load analytics data. Please try again later.");
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Transform the stats data for the charts
  const getChartData = () => {
    if (!stats) return [];
    
    switch (timeRange) {
      case "daily":
        return stats.daily_stats.map(day => ({
          name: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          impressions: day.total,
          accepts: day.accepts,
          declines: day.total - day.accepts,
          rate: day.rate
        }));
      case "weekly":
        return stats.weekly_stats.map(week => ({
          name: `Week ${week.week}`,
          impressions: week.total,
          accepts: week.accepts,
          declines: week.total - week.accepts,
          rate: week.rate
        }));
      case "monthly":
        return stats.monthly_stats.map(month => ({
          name: new Date(month.start_date).toLocaleDateString('en-US', { month: 'short' }),
          impressions: month.total,
          accepts: month.accepts,
          declines: month.total - month.accepts,
          rate: month.rate
        }));
      default:
        return [];
    }
  };

  // Function to handle exporting analytics data
  const handleExportData = async () => {
    if (!selectedDomain || !stats) return;
    
    try {
      setDownloading(true);
      // Get the selected domain name for the file name
      const domain = domains.find(d => d.id === selectedDomain);
      const domainName = domain ? domain.domain.replace(/\./g, '_') : 'cookie_analytics';
      
      // Create CSV content from the stats data
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add header row
      csvContent += "Period,Total Impressions,Accepts,Declines,Accept Rate(%)\n";
      
      // Add data rows based on selected time range
      const data = getChartData();
      data.forEach(row => {
        csvContent += `${row.name},${row.impressions},${row.accepts},${row.declines},${row.rate}\n`;
      });
      
      // Create a download link and trigger it
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `${domainName}_cookie_analytics_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export analytics data:", err);
      setError("Failed to export analytics data. Please try again later.");
    } finally {
      setDownloading(false);
    }
  };

  const categoryData = stats ? [
    { name: 'Necessary', value: stats.necessary, color: COLORS[0] },
    { name: 'Preferences', value: stats.preferences, color: COLORS[1] },
    { name: 'Analytics', value: stats.analytics, color: COLORS[2] },
    { name: 'Marketing', value: stats.marketing, color: COLORS[3] },
    { name: 'Third Party', value: stats.third_party, color: COLORS[4] }
  ] : [];

  // Create dummy event data (you can replace this with real data if available)
  const eventData = stats ? [
    { name: 'Banner Views', value: stats.total_consents, color: COLORS[0] },
    { name: 'Accept All', value: Math.round(stats.total_consents * stats.accept_rate / 100), color: COLORS[1] },
    { name: 'Customize', value: Math.round(stats.total_consents * 0.25), color: COLORS[2] },
    { name: 'Reject All', value: Math.round(stats.total_consents * (1 - stats.accept_rate/100) * 0.7), color: COLORS[3] },
    { name: 'Close', value: Math.round(stats.total_consents * (1 - stats.accept_rate/100) * 0.3), color: COLORS[4] }
  ] : [];

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-semibold">Cookie Consent Analytics</h2>
        
        <div className="flex items-center gap-2">
          <div className="w-full md:w-64">
            <Select 
              value={selectedDomain} 
              onValueChange={setSelectedDomain}
              disabled={loading || domains.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a domain" />
              </SelectTrigger>
              <SelectContent>
                {domains.map(domain => (
                  <SelectItem key={domain.id} value={domain.id}>
                    {domain.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchStats} 
            disabled={loading || !selectedDomain}
            title="Refresh data"
            className="flex-shrink-0"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleExportData}
            disabled={downloading || loading || !stats}
            className="flex items-center gap-2 flex-shrink-0"
            title="Export analytics data"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Export Data</span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.total_consents.toLocaleString() || '0'}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Accept Rate</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.accept_rate || '0'}%
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Analytics Enabled</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {stats ? (stats.analytics > 0 ? 'Yes' : 'No') : 'No'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as "daily" | "weekly" | "monthly")} className="space-y-6">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Banner Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : chartData.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                      <Bar dataKey="accepts" fill="#82ca9d" name="Accepts" />
                      <Bar dataKey="declines" fill="#ff8042" name="Declines" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Banner Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : chartData.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                      <Bar dataKey="accepts" fill="#82ca9d" name="Accepts" />
                      <Bar dataKey="declines" fill="#ff8042" name="Declines" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Banner Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : chartData.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                      <Bar dataKey="accepts" fill="#82ca9d" name="Accepts" />
                      <Bar dataKey="declines" fill="#ff8042" name="Declines" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  No data available for this period
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card dark:bg-card">
          <CardHeader>
            <CardTitle>Cookie Categories Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : categoryData.length > 0 && categoryData.some(item => item.value > 0) ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} consents`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-card dark:bg-card">
          <CardHeader>
            <CardTitle>User Interaction Events</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : eventData.length > 0 && eventData.some(item => item.value > 0) ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={eventData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {eventData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} events`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No event data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedDomain && stats?.total_consents > 0 && (
        <Card className="bg-card dark:bg-card">
          <CardHeader>
            <CardTitle>Recent Consent Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Necessary
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Preferences
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Analytics
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Marketing
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Country
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <>
                      <tr><td colSpan={6}><Skeleton className="h-8 w-full my-1" /></td></tr>
                      <tr><td colSpan={6}><Skeleton className="h-8 w-full my-1" /></td></tr>
                      <tr><td colSpan={6}><Skeleton className="h-8 w-full my-1" /></td></tr>
                    </>
                  ) : (
                    <tr>
                      <td className="px-6 py-4 text-muted-foreground" colSpan={6}>
                        View individual consents in the dashboard
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;