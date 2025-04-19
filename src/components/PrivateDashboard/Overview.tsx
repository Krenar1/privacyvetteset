import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import API_CONFIG from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

// Register required Chart.js components including ArcElement and DataLabels plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

// Define the type for statistics data from the API
type Statistics = {
  num_of_websites: number;
  num_of_websites_with_contact_email: number;
  websites_email_sent: number;
  num_of_non_compliant_websites: number;
  num_of_missing_compliance_websites: number;
  num_of_compliant_websites: number;
  num_of_subscribers: number;
  num_of_free_subscribers: number;
  num_of_one_time_subscribers: number;
  num_of_monthly_subscribers: number;
  num_of_keywords: number;
  num_of_keywords_checked_google: number;
};

const Overview = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  // No need for auth or API_URL as we're using the API service

  // Fetch statistics from the API and store them in state
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Use the API service to fetch statistics
        const data = await api.getStatistics();
        console.log('Statistics data:', data); // Debug log
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        // Set default values to avoid NaN
        setStats({
          num_of_websites: 0,
          num_of_websites_with_contact_email: 0,
          websites_email_sent: 0,
          num_of_non_compliant_websites: 0,
          num_of_missing_compliance_websites: 0,
          num_of_compliant_websites: 0,
          num_of_subscribers: 0,
          num_of_free_subscribers: 0,
          num_of_one_time_subscribers: 0,
          num_of_monthly_subscribers: 0,
          num_of_keywords: 0,
          num_of_keywords_checked_google: 0,
        });
      }
    };

    fetchStatistics();
  }, []);


  // While waiting for the API response, display a loading indicator
  if (!stats) {
    return <div className="flex justify-center items-center px-10 py-5">
  <svg
    className="animate-spin h-8 w-8 text-primary"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
</div>;
  }

  // Calculate total subscribers from free, one time, and monthly breakdown
  const totalSubscribers = stats ? (
    (stats.num_of_free_subscribers || 0) +
    (stats.num_of_one_time_subscribers || 0) +
    (stats.num_of_monthly_subscribers || 0)
  ) : 0;

  // Define your color palette
  const primaryBlueFill = "rgba(0,174,239,0.6)";
  const primaryBlueBorder = "rgba(0,174,239,1)";
  const lightGreyFill = "rgba(245,245,245,0.6)";
  const lightGreyBorder = "rgba(230,230,230,1)";

  // Data for the Subscription Plan Distribution Pie chart
  const subscriptionChartData = {
    labels: ['Free', 'One Time', 'Monthly'],
    datasets: [
      {
        label: 'Subscribers',
        data: [
          stats?.num_of_free_subscribers || 0,
          stats?.num_of_one_time_subscribers || 0,
          stats?.num_of_monthly_subscribers || 0,
        ],
        backgroundColor: [primaryBlueFill, lightGreyFill, "rgba(34,139,34,0.6)"],
        borderColor: [primaryBlueBorder, lightGreyBorder, "rgba(34,139,34,1)"],
        borderWidth: 1,
      },
    ],
  };

  // Options for the Pie chart with datalabels to display percentages
  const subscriptionChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Subscriber Distribution' },
      datalabels: {
        formatter: (value, context) => {
          const dataArr = context.chart.data.datasets[0].data as number[];
          const sum = dataArr.reduce((a, b) => a + b, 0);
          // Prevent division by zero
          if (sum === 0) return '0%';
          const percentage = ((value / sum) * 100).toFixed(1) + '%';
          return percentage;
        },
        color: 'rgb(55, 65, 81)',
        font: { weight: 'bold' },
      },
    },
  };

  // Data for the Bar chart with website statistics
  const barChartLabels = [
    'Total Websites',
    'Websites w/ Contact Email',
    'Websites Email Sent',
    'Non Compliant',
    'Missing Compliance',
    'Compliant',
  ];
  const barChartData = {
    labels: barChartLabels,
    datasets: [
      {
        label: 'Metrics',
        data: [
          stats?.num_of_websites || 0,
          stats?.num_of_websites_with_contact_email || 0,
          stats?.websites_email_sent || 0,
          stats?.num_of_non_compliant_websites || 0,
          stats?.num_of_missing_compliance_websites || 0,
          stats?.num_of_compliant_websites || 0,
        ],
        backgroundColor: [
          primaryBlueFill,
          lightGreyFill,
          "rgba(255,165,0,0.6)",
          "rgba(220,20,60,0.6)",
          "rgba(255,99,132,0.6)",
          "rgba(34,139,34,0.6)",
        ],
        borderColor: [
          primaryBlueBorder,
          lightGreyBorder,
          "rgba(255,165,0,1)",
          "rgba(220,20,60,1)",
          "rgba(255,99,132,1)",
          "rgba(34,139,34,1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Options for the Bar chart with grid lines removed and DataLabels disabled
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Website Statistics' },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            // Display the y-axis value for this bar
            const value = context.parsed.y;
            return isNaN(value) ? '0' : `${value}`;
          },
        },
      },
      datalabels: {
        display: true,
        anchor: 'end',
        align: 'end',
        offset: -5,
        formatter: (value) => {
          // Handle NaN or undefined values
          if (value === undefined || isNaN(value)) {
            return '0';
          }

          if (value >= 1e9) {
            return (value / 1e9).toFixed(1).replace('.', ',') + 'B';
          } else if (value >= 1e6) {
            return (value / 1e6).toFixed(1).replace('.', ',') + 'M';
          } else if (value >= 1e4) {
            return (value / 1e4).toFixed(1).replace('.', ',') + 'k';
          }
          return value;
        },
      }

    },
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700">Total Websites</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.num_of_websites || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700">Websites with Contact Email</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.num_of_websites_with_contact_email || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700">Websites Email Sent</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.websites_email_sent || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700">Total Subscribers</p>
          <p className="text-2xl font-bold text-gray-900">{totalSubscribers}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Bar Chart */}
        <div className="mt-6">
          <div className="w-80 h-64 mx-auto">
            {/* Only render chart if we have valid data */}
            {stats && Object.keys(stats).length > 0 ? (
              <Bar data={barChartData} options={barChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No data available</p>
              </div>
            )}
          </div>
        </div>
        {/* Pie Chart */}
        <div className="mt-6">
          <div className="w-80 h-64 mx-auto">
            {/* Only render chart if we have valid subscriber data */}
            {stats && totalSubscribers > 0 ? (
              <Pie data={subscriptionChartData} options={subscriptionChartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No subscriber data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
