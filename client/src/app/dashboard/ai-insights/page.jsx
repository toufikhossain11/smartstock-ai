"use client";

import { useEffect, useState } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  PackageCheck, 
  ChevronRight, 
  Loader2, 
  RefreshCw 
} from "lucide-react";

export default function AIInsightsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("http://localhost:5000/api/insights/overview");
      const result = await res.json();
      if (result.success) {
        setData(result.insights);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <p className="text-slate-700 font-bold text-lg">Failed to load AI insights.</p>
        <button 
          onClick={fetchInsights}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-blue-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative font-sans">
      
      {/* Header Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">AI Insights</h1>
        <p className="text-sm sm:text-base text-slate-500">Get smart recommendations and insights powered by AI.</p>
      </div>

      {/* Main AI Sales Insights Card Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">AI Sales Insights</h3>
            <p className="text-xs sm:text-sm text-slate-500">Based on your sales data from the last 30 days</p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* 1. Top Performing Product */}
          <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <PackageCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Top Performing Product</span>
                <h4 className="text-lg font-black text-slate-900">{data.topPerformingProduct.name}</h4>
                <p className="text-xs font-bold text-slate-500">({data.topPerformingProduct.percentage})</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Potential Stock Shortage */}
          <div className="p-6 rounded-2xl border border-amber-100 bg-amber-50/30 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Potential Stock Shortage</span>
                <h4 className="text-lg font-black text-slate-900">{data.potentialStockShortage.name}</h4>
                <p className="text-xs font-bold text-slate-500">{data.potentialStockShortage.message}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 3. Sales Trend */}
          <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/30 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Sales Trend</span>
                <p className="text-sm font-bold text-slate-800 leading-snug">{data.salesTrend}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 4. Recommendation */}
          <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/30 flex items-center justify-between hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">Recommendation</span>
                <p className="text-sm font-bold text-slate-800 leading-snug">{data.recommendation}</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

        </div>

      </div>

      {/* Additional Insights Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Additional Insights</h3>
        <div className="space-y-3 pt-2">
          {data.additionalInsights.map((insight, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm sm:text-base font-semibold text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>{insight}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}