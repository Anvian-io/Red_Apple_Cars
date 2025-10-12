"use client";
import { useState, useRef, useEffect } from "react";
import { Download, TrendingUp, DollarSign, Car, Calendar } from "lucide-react";
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
import { getDashboardData } from "@/services/dashboard/dashboardServices";

export function Dashboard() {
  const [activeTimeRange, setActiveTimeRange] = useState("6m");
  const [selectedCountry, setSelectedCountry] = useState("botswana");
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const salesChartRef = useRef(null);
  const financialChartRef = useRef(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // const response = await fetch(
        //   `http://localhost:8000/api/dashboard/data?country=${selectedCountry}&timeRange=${activeTimeRange}`
        // );
        // const data = await response.json();
        // if (data.success) {
        //   setDashboardData(data.data);
        // }
        const payload = {
          country: selectedCountry,
          timeRange: activeTimeRange
        };
        const response = await getDashboardData(payload)
        setDashboardData(response.data.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedCountry, activeTimeRange]);

  // Function to export chart as PNG
  const exportChartAsPNG = (chartRef, filename) => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${filename}-${selectedCountry}-${
          new Date().toISOString().split("T")[0]
        }.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  // Format currency based on country
  const formatCurrency = (value) => {
    if (!value) return "P0";
    const formatted = new Intl.NumberFormat("en-US").format(value);
    return selectedCountry === "botswana" ? `P${formatted}` : `K${formatted}`;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--background)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4" style={{ color: "var(--text)" }}>
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  const { salesData = [], financialData = [], statistics = {} } = dashboardData || {};

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
                Dashboard Overview - {selectedCountry === "botswana" ? "Botswana" : "Zambia"}
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--text)" }}>
                Welcome back! Here&apos;s what&apos;s happening at your dealership today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--border)",
                  color: "var(--text)"
                }}
              >
                <option value="botswana">Botswana</option>
                <option value="zambia">Zambia</option>
              </select>
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
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="6m">Last 6 Months</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue Card */}
          <div
            className="p-6 rounded-xl border shadow-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: "var(--heading)" }}>
                  {formatCurrency(statistics.monthlyRevenue)}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {statistics.monthlyCarsSold} cars sold
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "var(--hover-bg)" }}>
                <DollarSign className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
            </div>
          </div>

          {/* Profit Card */}
          <div
            className="p-6 rounded-xl border shadow-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Monthly Profit
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: "var(--heading)" }}>
                  {formatCurrency(statistics.monthlyProfit)}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Net profit
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "var(--hover-bg)" }}>
                <TrendingUp className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
            </div>
          </div>

          {/* Total Sold Cars */}
          <div
            className="p-6 rounded-xl border shadow-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Total Sold Cars
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: "var(--heading)" }}>
                  {statistics.totalSoldCars}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  All time
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "var(--hover-bg)" }}>
                <Car className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
            </div>
          </div>

          {/* Available Cars */}
          <div
            className="p-6 rounded-xl border shadow-sm"
            style={{
              backgroundColor: "var(--card-bg)",
              borderColor: "var(--border)"
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                  Available Cars
                </p>
                <p className="text-2xl font-bold mt-2" style={{ color: "var(--heading)" }}>
                  {statistics.availableCars}
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Ready for sale
                </p>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: "var(--hover-bg)" }}>
                <Calendar className="h-6 w-6" style={{ color: "var(--accent)" }} />
              </div>
            </div>
          </div>
        </div>

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
                Sales Performance ({selectedCountry === "botswana" ? "Botswana" : "Zambia"})
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
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Sales"]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  {selectedCountry === "botswana" ? (
                    <Bar
                      dataKey="botswana"
                      fill="#8884d8"
                      name={`Botswana Sales (${statistics.currency})`}
                    />
                  ) : (
                    <Bar
                      dataKey="zambia"
                      fill="#82ca9d"
                      name={`Zambia Sales (${statistics.currency})`}
                    />
                  )}
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
                Expenses & Profit ({selectedCountry === "botswana" ? "Botswana" : "Zambia"})
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
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), ""]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  {selectedCountry === "botswana" ? (
                    <>
                      <Bar dataKey="botswanaExpenses" fill="#ff7300" name="Botswana Expenses" />
                      <Bar dataKey="botswanaProfit" fill="#4caf50" name="Botswana Profit" />
                    </>
                  ) : (
                    <>
                      <Bar dataKey="zambiaExpenses" fill="#ffc300" name="Zambia Expenses" />
                      <Bar dataKey="zambiaProfit" fill="#8bc34a" name="Zambia Profit" />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
