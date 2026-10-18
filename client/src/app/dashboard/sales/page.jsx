"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Loader2, 
  CheckCircle, 
  ShoppingCart,
  Receipt
} from "lucide-react";

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Form State
  const [formData, setFormData] = useState({
    customer: "Walk-in Customer",
    productId: "",
    quantity: "1",
    discount: "0"
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Fetch Products and Sales History
  const fetchData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      const prodData = await prodRes.json();
      if (prodData.success) {
        setProducts(prodData.products);
      }

      const salesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales`);
      const salesData = await salesRes.json();
      if (salesData.success) {
        setSales(salesData.sales);
      }
    } catch (err) {
      console.error("Error fetching sales data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Find selected product details for price calculation
  const selectedProduct = products.find(p => p._id === formData.productId);
  const unitPrice = selectedProduct ? Number(selectedProduct.price) : 0;
  const qty = Number(formData.quantity) || 0;
  const disc = Number(formData.discount) || 0;
  const totalAmount = Math.max(0, (unitPrice * qty) - disc);

  // Handle Create Sale
  const handleCreateSale = async (e) => {
    e.preventDefault();
    if (!formData.productId || qty <= 0) {
      showToast("Please select a product and valid quantity", "error");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData.customer,
          productId: formData.productId,
          productName: selectedProduct.name,
          quantity: qty,
          discount: disc,
          total: totalAmount,
          status: "Completed",
          date: new Date().toISOString()
        })
      });
      const data = await res.json();

      if (data.success) {
        fetchData();
        setFormData({ customer: "Walk-in Customer", productId: "", quantity: "1", discount: "0" });
        showToast("Sale created successfully!");
      } else {
        showToast(data.message || "Failed to create sale", "error");
      }
    } catch (err) {
      console.error("Error creating sale:", err);
      showToast("Server error occurred", "error");
    }
  };

  return (
    <div className="space-y-6 relative font-sans">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-50 animate-bounce">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-white font-bold text-base ${
            toast.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-red-600 border-red-500"
          }`}>
            <CheckCircle className="w-6 h-6" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sales</h1>
          <p className="text-base text-slate-500">Create a new sale and track your sales history.</p>
        </div>
      </div>

      {/* Main Grid: Form & Recent Sales Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: New Sale Form */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">New Sale</h3>
            <p className="text-sm text-slate-500">Enter transaction details</p>
          </div>

          <form onSubmit={handleCreateSale} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Customer</label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Walk-in Customer"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium bg-slate-50/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Product</label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 bg-white text-slate-900 font-semibold cursor-pointer"
              >
                <option value="">Select product</option>
                {products.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name} (৳ {Number(item.price).toLocaleString()}) - Stock: {item.stock}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Quantity</label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="1"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Discount (Optional)</label>
              <input
                type="number"
                min="0"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Amount</span>
              <div className="text-2xl font-black text-slate-900">
                ৳ {totalAmount.toLocaleString()}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> Create Sale
            </button>
          </form>
        </div>

        {/* Right Side: Recent Sales Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-xl font-bold text-slate-900">Recent Sales</h3>
            <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
          </div>

          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Total</th>
                    <th className="py-4 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-base font-medium">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-12 text-slate-400">
                        No recent sales recorded yet.
                      </td>
                    </tr>
                  ) : (
                    sales.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-4 text-slate-500 font-semibold text-sm">
                          {new Date(item.date || "2026-01-01").toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="py-4 px-4 font-bold text-slate-900">{item.customer || "Walk-in"}</td>
                        <td className="py-4 px-4 font-bold text-slate-900">৳ {Number(item.total).toLocaleString()}</td>
                        <td className="py-4 px-4 text-right">
                          <span className="px-3 py-1.5 text-sm font-bold rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-200">
                            {item.status || "Completed"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}