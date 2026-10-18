"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  Percent, 
  Calendar, 
  Loader2 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Analytics from server
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics`);
      const result = await res.json();
      if (result.success) {
        setData(result.analytics);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { summary, overviewData, categoryData } = data || {};

  return (
    <div className="space-y-6 relative font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Analytics</h1>
          <p className="text-sm sm:text-base text-slate-500">Sales, revenue and profit analysis.</p>
        </div>

        {/* Date Filter Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-sm font-semibold text-slate-700 w-fit">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Oct 1, 2026 - Oct 18, 2026</span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-sm font-bold text-slate-500">Total Sales</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ৳ {Number(summary?.totalSales || 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" /> +10%
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-sm font-bold text-slate-500">Total Orders</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.totalOrders || 0}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" /> +12%
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-sm font-bold text-slate-500">Average Order Value</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            ৳ {Number(summary?.averageOrderValue || 0).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" /> +10%
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
          <span className="text-sm font-bold text-slate-500">Profit Margin</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {summary?.profitMargin || 0}%
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-lg">
            <TrendingUp className="w-3.5 h-3.5" /> +5%
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Sales & Revenue Overview Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Sales & Revenue Overview</h3>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Sales
              </span>
              <span className="flex items-center gap-1.5 text-purple-600">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Revenue
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(val) => `${val / 1000}K`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  formatter={(value) => [`৳ ${value.toLocaleString()}`, ""]}
                />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} />
                <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={3} dot={{ r: 4, fill: "#9333ea" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Sales by Category Donut Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Sales by Category</h3>
          </div>

          <div className="relative h-56 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Inner Center Label */}
            <div className="absolute text-center">
              <div className="text-lg font-black text-slate-900">
                ৳ {Number(summary?.totalSales || 0).toLocaleString()}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Total Sales
              </div>
            </div>
          </div>

          {/* Category Legends */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {categoryData?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-700">{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}