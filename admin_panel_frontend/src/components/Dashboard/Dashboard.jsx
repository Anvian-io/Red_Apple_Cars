"use client";
import { useState, useRef } from "react";
import {
  Car,
  Users,
  Shield,
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Activity,
  Download
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import html2canvas from "html2canvas";

export function Dashboard() {
  const [activeTimeRange, setActiveTimeRange] = useState("7d");
  const salesChartRef = useRef(null);
  const financialChartRef = useRef(null);

  // Function to get the last 6 months dynamically
  const getLastSixMonths = () => {
    const months = [];
    const date = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(date.getMonth() - i);
      months.push(d.toLocaleString("default", { month: "short" }));
    }

    return months;
  };

  const months = getLastSixMonths();

  // Dummy data for sales by month for Botswana and Zambia
  const salesData = [
    { month: months[0], botswana: 40000, zambia: 24000 },
    { month: months[1], botswana: 30000, zambia: 13980 },
    { month: months[2], botswana: 20000, zambia: 9800 },
    { month: months[3], botswana: 27800, zambia: 39080 },
    { month: months[4], botswana: 18900, zambia: 48000 },
    { month: months[5], botswana: 23900, zambia: 38000 }
  ];

  // Dummy data for expenses and profit by month
  const financialData = [
    {
      month: months[0],
      botswanaExpenses: 20000,
      zambiaExpenses: 15000,
      botswanaProfit: 20000,
      zambiaProfit: 9000
    },
    {
      month: months[1],
      botswanaExpenses: 18000,
      zambiaExpenses: 12000,
      botswanaProfit: 12000,
      zambiaProfit: 1980
    },
    {
      month: months[2],
      botswanaExpenses: 22000,
      zambiaExpenses: 10000,
      botswanaProfit: -2000,
      zambiaProfit: -200
    },
    {
      month: months[3],
      botswanaExpenses: 15000,
      zambiaExpenses: 20000,
      botswanaProfit: 12800,
      zambiaProfit: 19080
    },
    {
      month: months[4],
      botswanaExpenses: 10000,
      zambiaExpenses: 15000,
      botswanaProfit: 8900,
      zambiaProfit: 33000
    },
    {
      month: months[5],
      botswanaExpenses: 12000,
      zambiaExpenses: 10000,
      botswanaProfit: 11900,
      zambiaProfit: 28000
    }
  ];

  // Function to export chart as PNG
  const exportChartAsPNG = (chartRef, filename) => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${filename}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--card-bg)"
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>
                Dashboard Overview
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text)" }}>
                Welcome back! Here&apos;s what&apos;s happening at your dealership today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={activeTimeRange}
                onChange={(e) => setActiveTimeRange(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)"
                }}
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                className="px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "var(--button-bg)" }}
              >
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Sales and Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div
            className="p-6 rounded-xl border shadow-sm relative"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--heading)" }}>
                Sales Performance (Past 6 Months)
              </h3>
              <button
                onClick={() => exportChartAsPNG(salesChartRef, "sales-chart")}
                className="flex items-center gap-1 px-3 py-1 rounded text-sm hover:opacity-80 transition-all"
                style={{
                  backgroundColor: "var(--hover-bg)",
                  color: "var(--hover-text)"
                }}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
            <div className="h-80" ref={salesChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`P${value.toLocaleString()}`, ""]} />
                  <Legend />
                  <Bar dataKey="botswana" fill="#8884d8" name="Botswana Sales" />
                  <Bar dataKey="zambia" fill="#82ca9d" name="Zambia Sales" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses and Profit Chart */}
          <div
            className="p-6 rounded-xl border shadow-sm relative"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: "var(--heading)" }}>
                Expenses & Profit (Past 6 Months)
              </h3>
              <button
                onClick={() => exportChartAsPNG(financialChartRef, "financial-chart")}
                className="flex items-center gap-1 px-3 py-1 rounded text-sm hover:opacity-80 transition-all"
                style={{
                  backgroundColor: "var(--hover-bg)",
                  color: "var(--hover-text)"
                }}
              >
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
            <div className="h-80" ref={financialChartRef}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={financialData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`P${value.toLocaleString()}`, ""]} />
                  <Legend />
                  <Bar dataKey="botswanaExpenses" fill="#ff7300" name="Botswana Expenses" />
                  <Bar dataKey="zambiaExpenses" fill="#ffc300" name="Zambia Expenses" />
                  <Bar dataKey="botswanaProfit" fill="#4caf50" name="Botswana Profit" />
                  <Bar dataKey="zambiaProfit" fill="#8bc34a" name="Zambia Profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <QuickActionsCard />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <RecentActivityCard />
          </div>
        </div>

        {/* Management Modules */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" style={{ color: "var(--heading)" }}>
            Management Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ModuleCard
              icon={<Car className="h-8 w-8" />}
              title="Inventory Management"
              description="Manage car listings, specifications, and pricing"
              stats="156 active listings"
              actions={[
                { label: "View All", icon: <Eye className="h-4 w-4" /> },
                { label: "Add New", icon: <Plus className="h-4 w-4" /> }
              ]}
            />
            <ModuleCard
              icon={<Users className="h-8 w-8" />}
              title="Customer Management"
              description="Track customer interactions and sales history"
              stats="1,234 total customers"
              actions={[
                { label: "View All", icon: <Eye className="h-4 w-4" /> },
                { label: "Add New", icon: <Plus className="h-4 w-4" /> }
              ]}
            />
            <ModuleCard
              icon={<BarChart3 className="h-8 w-8" />}
              title="Sales Analytics"
              description="Monitor performance and generate reports"
              stats="42 sales this month"
              actions={[
                { label: "View Reports", icon: <Eye className="h-4 w-4" /> },
                {
                  label: "Export Data",
                  icon: <FileText className="h-4 w-4" />
                }
              ]}
            />
            <ModuleCard
              icon={<FileText className="h-8 w-8" />}
              title="Invoice Management"
              description="Create and manage invoices and contracts"
              stats="23 pending invoices"
              actions={[
                { label: "View All", icon: <Eye className="h-4 w-4" /> },
                { label: "Create New", icon: <Plus className="h-4 w-4" /> }
              ]}
            />
            <ModuleCard
              icon={<Shield className="h-8 w-8" />}
              title="User Management"
              description="Control access and manage user roles"
              stats="12 active users"
              actions={[
                { label: "Manage Users", icon: <Edit className="h-4 w-4" /> },
                { label: "Permissions", icon: <Shield className="h-4 w-4" /> }
              ]}
            />
            <ModuleCard
              icon={<Activity className="h-8 w-8" />}
              title="System Monitoring"
              description="Track system performance and uptime"
              stats="99.9% uptime"
              actions={[
                { label: "View Logs", icon: <Eye className="h-4 w-4" /> },
                { label: "Settings", icon: <Edit className="h-4 w-4" /> }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Other components (QuickActionsCard, RecentActivityCard, ModuleCard) remain the same
// ... (they are unchanged from your original code)

function QuickActionsCard() {
  const actions = [
    {
      label: "Add New Car",
      icon: <Car className="h-4 w-4" />,
      color: "var(--primary)"
    },
    {
      label: "New Customer",
      icon: <Users className="h-4 w-4" />,
      color: "var(--primary)"
    },
    {
      label: "Create Invoice",
      icon: <FileText className="h-4 w-4" />,
      color: "var(--primary)"
    },
    {
      label: "View Reports",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "var(--primary)"
    }
  ];

  return (
    <div
      className="p-6 rounded-xl border shadow-sm"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)"
      }}
    >
      <h3 className="text-lg font-semibold mb-4" style={{ color: "var(--heading)" }}>
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:opacity-80 transition-all text-left"
            style={{
              backgroundColor: "var(--hover-bg)",
              color: "var(--text)"
            }}
          >
            <div style={{ color: action.color }}>{action.icon}</div>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RecentActivityCard() {
  const activities = [
    {
      action: "New car added",
      details: "2024 Honda Civic - P25,000",
      time: "2 minutes ago",
      icon: <Car className="h-4 w-4" />,
      type: "success"
    },
    {
      action: "Sale completed",
      details: "Toyota Camry sold to John Smith",
      time: "1 hour ago",
      icon: <CheckCircle className="h-4 w-4" />,
      type: "success"
    },
    {
      action: "Low inventory alert",
      details: "BMW X5 - Only 2 units remaining",
      time: "3 hours ago",
      icon: <AlertTriangle className="h-4 w-4" />,
      type: "warning"
    },
    {
      action: "New customer registered",
      details: "Sarah Johnson - Premium customer",
      time: "5 hours ago",
      icon: <Users className="h-4 w-4" />,
      type: "info"
    }
  ];

  return (
    <div
      className="p-6 rounded-xl border shadow-sm"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)"
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: "var(--heading)" }}>
          Recent Activity
        </h3>
        <button
          className="text-sm hover:opacity-70 transition-opacity"
          style={{ color: "var(--primary)" }}
        >
          View All
        </button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${
                activity.type === "success"
                  ? "bg-green-100 text-green-600"
                  : activity.type === "warning"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
              }`}
            >
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium" style={{ color: "var(--heading)" }}>
                {activity.action}
              </p>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {activity.details}
              </p>
              <p className="text-xs opacity-70 flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" />
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModuleCard({ icon, title, description, stats, actions }) {
  return (
    <div
      className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all group"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)"
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-xl group-hover:scale-105 transition-transform"
          style={{ backgroundColor: "var(--secondary-bg)" }}
        >
          <div style={{ color: "var(--primary)" }}>{icon}</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--heading)" }}>
          {title}
        </h3>
        <p className="text-sm mb-3" style={{ color: "var(--text)" }}>
          {description}
        </p>
        <p className="text-xs font-medium" style={{ color: "var(--card-text)" }}>
          {stats}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-all"
            style={{
              backgroundColor: "var(--hover-bg)",
              color: "var(--hover-text)"
            }}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
