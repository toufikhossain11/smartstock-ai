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
  AreaChart, 
  Area, 
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

  useEffect(() => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = new Date().toLocaleDateString("en-GB", options);
    setCurrentDate(formattedDate);
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/dashboard");
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
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 font-sans">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-bold text-base">Loading dashboard metrics from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <p className="text-slate-800 font-bold text-lg">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-base font-bold hover:bg-blue-700 transition shadow-md"
        >
          <RefreshCw className="w-5 h-5" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-base text-slate-500">Heres what happening with your business today.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-slate-200 text-slate-700 text-sm font-bold shadow-sm w-fit">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span>{currentDate || "Loading date..."}</span>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Products</p>
            <h3 className="text-3xl font-black text-slate-900">{data?.stats?.totalProducts || 0}</h3>
            <p className="text-sm text-emerald-600 font-bold">{data?.stats?.productsChange}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Package className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Sales</p>
            <h3 className="text-3xl font-black text-slate-900">{data?.stats?.totalSales?.toLocaleString() || 0}</h3>
            <p className="text-sm text-emerald-600 font-bold">{data?.stats?.salesChange}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-3xl font-black text-slate-900">৳ {data?.stats?.totalRevenue?.toLocaleString() || 0}</h3>
            <p className="text-sm text-emerald-600 font-bold">{data?.stats?.revenueChange}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Banknote className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Profit</p>
            <h3 className="text-3xl font-black text-slate-900">৳ {data?.stats?.totalProfit?.toLocaleString() || 0}</h3>
            <p className="text-sm text-emerald-600 font-bold">{data?.stats?.profitChange}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>

      </div>

      {/* Main Grid: Enhanced Area Chart & Low Stock with Images */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enhanced Area Chart for Better Visibility */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Sales Overview</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Performance Trend</span>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "16px", border: "none", color: "#fff", fontSize: "14px", padding: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.2)" }}
                  formatter={(val) => [`৳ ${val.toLocaleString()}`]}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: "13px", paddingBottom: "15px", fontWeight: "bold" }} />
                <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock Alerts with Real Product Images */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Low Stock Alerts</h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-red-50 text-red-600">
              {data?.lowStockAlerts?.length || 0} Items
            </span>
          </div>

          <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[320px]">
            {data?.lowStockAlerts?.length === 0 ? (
              <p className="text-base text-slate-400 text-center py-12 font-medium">All products are well stocked.</p>
            ) : (
              data?.lowStockAlerts?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3.5">
                    {/* Product Image with Fallback */}
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shrink-0">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{item.name}</h4>
                      <p className="text-sm font-semibold text-slate-500">
                        Stock: <span className="font-bold text-amber-600">{item.stock}</span> (&lt; {item.minStock})
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-xl uppercase tracking-wider">
                    Low
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}