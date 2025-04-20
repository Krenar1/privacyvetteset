import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CookieToolService, ConsentStats, Domain } from '@/services/cookieToolService';
import { Loader2 } from 'lucide-react';

interface ConsentAnalyticsProps {
  domainId: string;
}

export function ConsentAnalytics({ domainId }: ConsentAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ConsentStats | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>(domainId || '');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A85CF9'];

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      loadStats(selectedDomain);
    }
  }, [selectedDomain]);

  const loadDomains = async () => {
    try {
      const domains = await CookieToolService.getDomains();
      setDomains(domains);
      
      // If domainId wasn't provided, use the first domain
      if (!domainId && domains.length > 0) {
        setSelectedDomain(domains[0].id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load domains',
        variant: 'destructive'
      });
      console.error('Failed to load domains:', error);
    }
  };

  const loadStats = async (domainId: string) => {
    setLoading(true);
    try {
      const stats = await CookieToolService.getDomainStats(domainId);
      setStats(stats);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load consent statistics',
        variant: 'destructive'
      });
      console.error('Failed to load consent statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRangeData = () => {
    if (!stats) return [];
    
    switch (timeRange) {
      case 'daily':
        return stats.daily_stats.slice(-14); // Last 14 days
      case 'weekly':
        return stats.weekly_stats;
      case 'monthly':
        return stats.monthly_stats;
      default:
        return stats.daily_stats.slice(-14);
    }
  };

  const getCategoryData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Necessary', value: stats.necessary, color: '#0088FE' },
      { name: 'Preferences', value: stats.preferences, color: '#00C49F' },
      { name: 'Analytics', value: stats.analytics, color: '#FFBB28' },
      { name: 'Marketing', value: stats.marketing, color: '#FF8042' },
      { name: 'Third Party', value: stats.third_party, color: '#A85CF9' }
    ];
  };

  const formatAcceptRate = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm">{`Total: ${payload[0].payload.total}`}</p>
          <p className="text-sm">{`Accepts: ${payload[0].payload.accepts}`}</p>
          <p className="text-sm text-blue-500">{`Accept Rate: ${payload[0].payload.rate.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Consent Analytics</CardTitle>
            <CardDescription>
              Track how users interact with your cookie consent banners
            </CardDescription>
          </div>
          <div className="w-64">
            {domains.length > 0 && (
              <Select
                value={selectedDomain}
                onValueChange={setSelectedDomain}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!stats || stats.total_consents === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No consent data available for this domain yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Once users start interacting with your cookie banner, analytics will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium">Total Consents</h3>
                <p className="text-3xl font-bold mt-2">{stats.total_consents}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium">Accept Rate</h3>
                <p className="text-3xl font-bold mt-2 text-blue-500">
                  {formatAcceptRate(stats.accept_rate)}
                </p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium">Analytics Consents</h3>
                <p className="text-3xl font-bold mt-2 text-yellow-500">
                  {stats.analytics}
                </p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium">Marketing Consents</h3>
                <p className="text-3xl font-bold mt-2 text-orange-500">
                  {stats.marketing}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Consent Over Time</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="timeRange">Time Range:</Label>
                  <Select
                    value={timeRange}
                    onValueChange={(value) => setTimeRange(value as any)}
                  >
                    <SelectTrigger id="timeRange" className="w-[150px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (Last 14 Days)</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTimeRangeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey={timeRange === 'weekly' ? 'week' : timeRange === 'monthly' ? 'month' : 'date'} 
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={formatAcceptRate} 
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#2563eb"
                      activeDot={{ r: 8 }}
                      name="Accept Rate"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Tabs defaultValue="pie">
              <TabsList>
                <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="pie" className="pt-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCategoryData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="bar" className="pt-4">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getCategoryData()}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Consents" radius={[0, 4, 4, 0]}>
                        {getCategoryData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}