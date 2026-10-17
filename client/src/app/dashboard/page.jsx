"use client";

import { useEffect, useState } from "react";
import { 
  Package, 
  ShoppingBag, 
  Banknote, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState("");

  // Dynamic Current Date generator (e.g., 18 Oct 2026)
  useEffect(() => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date().toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  // Fetch Dashboard Data from Backend API (MongoDB connected)
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`);
      if (!res.ok) {
        throw new Error("Failed to load dashboard metrics.");
      }
      const result = await res.json();
      setData(result);
    } catch (err) {
      setError("Failed to connect with database or fetch metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-medium text-sm">Loading dashboard metrics from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-slate-700 font-semibold">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header Section with Dynamic Date */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">Heres what happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold shadow-sm w-fit">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{currentDate || "Loading date..."}</span>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Products</p>
            <h3 className="text-2xl font-bold text-slate-900">{data?.stats?.totalProducts || 0}</h3>
            <p className="text-xs text-emerald-600 font-semibold">{data?.stats?.productsChange}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Sales</p>
            <h3 className="text-2xl font-bold text-slate-900">৳ {data?.stats?.totalSales?.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-semibold">{data?.stats?.salesChange}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900">৳ {data?.stats?.totalRevenue?.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-semibold">{data?.stats?.revenueChange}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Banknote className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Profit</p>
            <h3 className="text-2xl font-bold text-slate-900">৳ {data?.stats?.totalProfit?.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-semibold">{data?.stats?.profitChange}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Chart & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Sales Overview</h3>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }}
                  formatter={(val) => [`৳ ${val.toLocaleString()}`]}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }} />
                <Line type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Revenue" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Low Stock Alerts</h3>
            <button className="text-xs font-semibold text-blue-600 hover:underline">View All</button>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto">
            {data?.lowStockAlerts?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500">
                      Stock: <span className="font-bold text-amber-600">{item.stock}</span> (&lt; {item.minStock})
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg uppercase tracking-wider">
                  Low
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}