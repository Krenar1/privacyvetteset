import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  // Sample data for demonstration
  const dailyData = [
    { name: 'Apr 13', impressions: 120, accepts: 92, declines: 28 },
    { name: 'Apr 14', impressions: 156, accepts: 110, declines: 46 },
    { name: 'Apr 15', impressions: 142, accepts: 98, declines: 44 },
    { name: 'Apr 16', impressions: 168, accepts: 128, declines: 40 },
    { name: 'Apr 17', impressions: 189, accepts: 145, declines: 44 },
    { name: 'Apr 18', impressions: 204, accepts: 156, declines: 48 },
    { name: 'Apr 19', impressions: 232, accepts: 176, declines: 56 },
  ];

  const weeklyData = [
    { name: 'Week 1', impressions: 845, accepts: 643, declines: 202 },
    { name: 'Week 2', impressions: 932, accepts: 701, declines: 231 },
    { name: 'Week 3', impressions: 1021, accepts: 786, declines: 235 },
    { name: 'Week 4', impressions: 1211, accepts: 905, declines: 306 },
  ];

  const monthlyData = [
    { name: 'Jan', impressions: 3256, accepts: 2398, declines: 858 },
    { name: 'Feb', impressions: 3845, accepts: 2912, declines: 933 },
    { name: 'Mar', impressions: 4012, accepts: 3089, declines: 923 },
    { name: 'Apr', impressions: 4210, accepts: 3201, declines: 1009 },
  ];

  const categoryData = [
    { name: 'Necessary', value: 100 },
    { name: 'Analytics', value: 72 },
    { name: 'Marketing', value: 45 },
    { name: 'Preferences', value: 61 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 35 },
    { name: 'Tablet', value: 7 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const totalImpressions = dailyData.reduce((sum, day) => sum + day.impressions, 0);
  const totalAccepts = dailyData.reduce((sum, day) => sum + day.accepts, 0);
  const acceptRate = Math.round((totalAccepts / totalImpressions) * 100);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">Analytics</h2>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Accept Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Active Domains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-6">
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
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyData}
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Banner Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Banner Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cookie Categories Accepted</CardTitle>
          </CardHeader>
          <CardContent>
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;