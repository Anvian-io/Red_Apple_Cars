"use client";
import { useState } from "react";
import {
  Car,
  Users,
  Shield,
  BarChart3,
  FileText,
  ArrowRight,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Eye,
  Edit,
  Activity,
} from "lucide-react";

export function Dashboard() {
  const [activeTimeRange, setActiveTimeRange] = useState("7d");

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
          backgroundColor: "var(--card-bg)",
        }}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--heading)" }}
              >
                Dashboard Overview
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text)" }}>
                Welcome back! Here&apos;s what&apos;s happening at your
                dealership today.
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
                  color: "var(--text)",
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
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value="P247,500"
            change="+12.5%"
            isPositive={true}
            icon={<p className="h-6 w-6 text-center font-bold">P</p>}
            description="vs last month"
          />
          <MetricCard
            title="Cars Sold"
            value="42"
            change="+8.3%"
            isPositive={true}
            icon={<Car className="h-6 w-6" />}
            description="vs last month"
          />
          <MetricCard
            title="Active Customers"
            value="1,234"
            change="+5.2%"
            isPositive={true}
            icon={<Users className="h-6 w-6" />}
            description="vs last month"
          />
          <MetricCard
            title="Inventory Level"
            value="156"
            change="-2.1%"
            isPositive={false}
            icon={<Activity className="h-6 w-6" />}
            description="cars available"
          />
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
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--heading)" }}
          >
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
                { label: "Add New", icon: <Plus className="h-4 w-4" /> },
              ]}
            />
            <ModuleCard
              icon={<Users className="h-8 w-8" />}
              title="Customer Management"
              description="Track customer interactions and sales history"
              stats="1,234 total customers"
              actions={[
                { label: "View All", icon: <Eye className="h-4 w-4" /> },
                { label: "Add New", icon: <Plus className="h-4 w-4" /> },
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
                  icon: <FileText className="h-4 w-4" />,
                },
              ]}
            />
            <ModuleCard
              icon={<FileText className="h-8 w-8" />}
              title="Invoice Management"
              description="Create and manage invoices and contracts"
              stats="23 pending invoices"
              actions={[
                { label: "View All", icon: <Eye className="h-4 w-4" /> },
                { label: "Create New", icon: <Plus className="h-4 w-4" /> },
              ]}
            />
            <ModuleCard
              icon={<Shield className="h-8 w-8" />}
              title="User Management"
              description="Control access and manage user roles"
              stats="12 active users"
              actions={[
                { label: "Manage Users", icon: <Edit className="h-4 w-4" /> },
                { label: "Permissions", icon: <Shield className="h-4 w-4" /> },
              ]}
            />
            <ModuleCard
              icon={<Activity className="h-8 w-8" />}
              title="System Monitoring"
              description="Track system performance and uptime"
              stats="99.9% uptime"
              actions={[
                { label: "View Logs", icon: <Eye className="h-4 w-4" /> },
                { label: "Settings", icon: <Edit className="h-4 w-4" /> },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, isPositive, icon, description }) {
  return (
    <div
      className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: "var(--secondary-bg)" }}
        >
          <div style={{ color: "var(--primary)" }}>{icon}</div>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {change}
        </div>
      </div>
      <div>
        <p
          className="text-2xl font-bold mb-1"
          style={{ color: "var(--heading)" }}
        >
          {value}
        </p>
        <p className="text-sm" style={{ color: "var(--text)" }}>
          {title}
        </p>
        <p className="text-xs mt-1 opacity-70">{description}</p>
      </div>
    </div>
  );
}

function QuickActionsCard() {
  const actions = [
    {
      label: "Add New Car",
      icon: <Car className="h-4 w-4" />,
      color: "var(--primary)",
    },
    {
      label: "New Customer",
      icon: <Users className="h-4 w-4" />,
      color: "var(--primary)",
    },
    {
      label: "Create Invoice",
      icon: <FileText className="h-4 w-4" />,
      color: "var(--primary)",
    },
    {
      label: "View Reports",
      icon: <BarChart3 className="h-4 w-4" />,
      color: "var(--primary)",
    },
  ];

  return (
    <div
      className="p-6 rounded-xl border shadow-sm"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)",
      }}
    >
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: "var(--heading)" }}
      >
        Quick Actions
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:opacity-80 transition-all text-left"
            style={{
              backgroundColor: "var(--hover-bg)",
              color: "var(--text)",
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
      type: "success",
    },
    {
      action: "Sale completed",
      details: "Toyota Camry sold to John Smith",
      time: "1 hour ago",
      icon: <CheckCircle className="h-4 w-4" />,
      type: "success",
    },
    {
      action: "Low inventory alert",
      details: "BMW X5 - Only 2 units remaining",
      time: "3 hours ago",
      icon: <AlertTriangle className="h-4 w-4" />,
      type: "warning",
    },
    {
      action: "New customer registered",
      details: "Sarah Johnson - Premium customer",
      time: "5 hours ago",
      icon: <Users className="h-4 w-4" />,
      type: "info",
    },
  ];

  return (
    <div
      className="p-6 rounded-xl border shadow-sm"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-lg font-semibold"
          style={{ color: "var(--heading)" }}
        >
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
        borderColor: "var(--border)",
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
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--heading)" }}
        >
          {title}
        </h3>
        <p className="text-sm mb-3" style={{ color: "var(--text)" }}>
          {description}
        </p>
        <p
          className="text-xs font-medium"
          style={{ color: "var(--card-text)" }}
        >
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
              color: "var(--hover-text)",
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
