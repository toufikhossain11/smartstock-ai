"use client";

import { useEffect, useState } from "react";
import {
    PackagePlus,
    PackageMinus,
    History,
    Plus,
    Loader2,
    CheckCircle,
    Search
} from "lucide-react";

export default function InventoryPage() {
    const [activeTab, setActiveTab] = useState("Stock In");
    const [products, setProducts] = useState([]);
    const [inventoryHistory, setInventoryHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // History tab search and filter states
    const [historySearch, setHistorySearch] = useState("");
    const [historyFilterType, setHistoryFilterType] = useState("All");

    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    // Form State for Stock In & Stock Out
    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
        referenceNo: "",
        notes: ""
    });

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: "", type: "success" });
        }, 3000);
    };

    // Fetch Products & Inventory History from Database
    const fetchData = async () => {
        setLoading(true);
        try {
            const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
            const prodData = await prodRes.json();
            if (prodData.success) {
                setProducts(prodData.products);
            }

            const invRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`);
            const invData = await invRes.json();
            if (invData.success) {
                setInventoryHistory(invData.inventory);
            }
        } catch (err) {
            console.error("Error fetching inventory data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle Stock In / Stock Out Form Submit
    const handleStockSubmit = async (e) => {
        e.preventDefault();
        if (!formData.productId || !formData.quantity) {
            showToast("Please fill in required fields", "error");
            return;
        }

        try {
            const endpoint = activeTab === "Stock In" ? "stock-in" : "stock-out";
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: formData.productId,
                    quantity: Number(formData.quantity),
                    referenceNo: formData.referenceNo,
                    notes: formData.notes,
                    type: activeTab
                })
            });
            const data = await res.json();

            if (data.success) {
                fetchData();
                setFormData({ productId: "", quantity: "", referenceNo: "", notes: "" });
                showToast(`${activeTab} recorded successfully!`);
            } else {
                showToast(data.message || "Operation failed", "error");
            }
        } catch (err) {
            console.error("Error updating stock:", err);
            showToast("Server error occurred", "error");
        }
    };

    // Filtered lists for each specific view
    const stockInHistory = inventoryHistory.filter(item => item.type === "Stock In");
    const stockOutHistory = inventoryHistory.filter(item => item.type === "Stock Out");

    // All combined records with search and filter for Stock History tab
    const filteredAllHistory = inventoryHistory.filter((item) => {
        const matchesSearch = item.productName?.toLowerCase().includes(historySearch.toLowerCase()) ||
            item.referenceNo?.toLowerCase().includes(historySearch.toLowerCase());
        const matchesType = historyFilterType === "All" || item.type === historyFilterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6 relative font-sans">

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl border text-white font-bold text-base ${toast.type === "success" ? "bg-emerald-600 border-emerald-500" : "bg-red-600 border-red-500"
                        }`}>
                        <CheckCircle className="w-6 h-6" />
                        <span>{toast.message}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inventory</h1>
                <p className="text-base text-slate-500">Track stock movements and manage warehouse inventory.</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
                <button
                    onClick={() => setActiveTab("Stock In")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base transition ${activeTab === "Stock In"
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    <PackagePlus className="w-5 h-5" /> Stock In
                </button>
                <button
                    onClick={() => setActiveTab("Stock Out")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base transition ${activeTab === "Stock Out"
                            ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    <PackageMinus className="w-5 h-5" /> Stock Out
                </button>
                <button
                    onClick={() => setActiveTab("Stock History")}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-base transition ${activeTab === "Stock History"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                >
                    <History className="w-5 h-5" /> Stock History
                </button>
            </div>

            {/* VIEW 1: STOCK HISTORY (No Form - Full Width Table showing ALL Data) */}
            {activeTab === "Stock History" ? (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">All Stock Movements History</h3>
                            <p className="text-sm text-slate-500">Combined list of all Stock In and Stock Out records</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Search Bar */}
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={historySearch}
                                    onChange={(e) => setHistorySearch(e.target.value)}
                                    placeholder="Search product or reference..."
                                    className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-600 font-medium text-slate-900 bg-slate-50/50"
                                />
                            </div>

                            {/* Type Filter */}
                            <select
                                value={historyFilterType}
                                onChange={(e) => setHistoryFilterType(e.target.value)}
                                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-slate-50/50 outline-none cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                <option value="Stock In">Stock In Only</option>
                                <option value="Stock Out">Stock Out Only</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-20 flex justify-center items-center">
                            <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-4 px-5">Type</th>
                                        <th className="py-4 px-5">Product Name</th>
                                        <th className="py-4 px-5">Quantity</th>
                                        <th className="py-4 px-5">Reference No.</th>
                                        <th className="py-4 px-5">Notes</th>
                                        <th className="py-4 px-5 text-right">Date & Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-base font-medium">
                                    {filteredAllHistory.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-slate-400">
                                                No history records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAllHistory.map((item, idx) => {
                                            const isIn = item.type === "Stock In";
                                            return (
                                                <tr key={idx} className="hover:bg-slate-50/60 transition">
                                                    <td className="py-4 px-5">
                                                        <span className={`px-3 py-1.5 text-sm font-bold rounded-lg border ${isIn
                                                                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                                                : "bg-red-50 text-red-600 border-red-200"
                                                            }`}>
                                                            {item.type}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-5 font-bold text-slate-900">{item.productName || "Product"}</td>
                                                    <td className={`py-4 px-5 font-bold ${isIn ? "text-emerald-600" : "text-red-600"}`}>
                                                        {isIn ? `+${item.quantity}` : `-${item.quantity}`}
                                                    </td>
                                                    <td className="py-4 px-5 text-slate-600 font-semibold">{item.referenceNo || "N/A"}</td>
                                                    <td className="py-4 px-5 text-slate-500 text-sm">{item.notes || "No notes"}</td>
                                                    <td className="py-4 px-5 text-right text-slate-500 font-semibold text-sm">
                                                        {new Date(item.date || "2026-01-01").toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        })}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (

                /* VIEW 2 & 3: STOCK IN OR STOCK OUT (Form + Specific Table Only) */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Side: Form */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="border-b border-slate-100 pb-4">
                            <h3 className="text-xl font-bold text-slate-900">
                                {activeTab === "Stock In" ? "Stock In Product" : "Stock Out Product"}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {activeTab === "Stock In" ? "Add inventory quantity" : "Deduct inventory quantity"}
                            </p>
                        </div>

                        <form onSubmit={handleStockSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Select Product</label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 bg-white text-slate-900 font-semibold cursor-pointer"
                                >
                                    <option value="">Choose product...</option>
                                    {products.map((item) => (
                                        <option key={item._id} value={item._id}>
                                            {item.name} (Current Stock: {item.stock})
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
                                    placeholder="Enter quantity"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Reference No.</label>
                                <input
                                    type="text"
                                    value={formData.referenceNo}
                                    onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })}
                                    placeholder="e.g. REF-1092"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Notes (Optional)</label>
                                <textarea
                                    rows="3"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Add details..."
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3.5 text-white rounded-xl font-bold text-base shadow-lg transition flex items-center justify-center gap-2 ${activeTab === "Stock In"
                                        ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30"
                                        : "bg-red-600 hover:bg-red-700 shadow-red-600/30"
                                    }`}
                            >
                                <Plus className="w-5 h-5" /> {activeTab === "Stock In" ? "Add Stock" : "Remove Stock"}
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Specific Records Table */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-xl font-bold text-slate-900">
                                {activeTab === "Stock In" ? "Stock In Data Only" : "Stock Out Data Only"}
                            </h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-lg ${activeTab === "Stock In" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                                }`}>
                                {activeTab === "Stock In" ? stockInHistory.length : stockOutHistory.length} Entries
                            </span>
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
                                            <th className="py-4 px-4">Product</th>
                                            <th className="py-4 px-4">Quantity</th>
                                            <th className="py-4 px-4">Reference</th>
                                            <th className="py-4 px-4 text-right">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-base font-medium">
                                        {(activeTab === "Stock In" ? stockInHistory : stockOutHistory).length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-12 text-slate-400">
                                                    No {activeTab} data found.
                                                </td>
                                            </tr>
                                        ) : (
                                            (activeTab === "Stock In" ? stockInHistory : stockOutHistory).map((item, idx) => {
                                                const isIn = item.type === "Stock In";
                                                return (
                                                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                                                        <td className="py-4 px-4 font-bold text-slate-900">{item.productName || "Product"}</td>
                                                        <td className={`py-4 px-4 font-bold ${isIn ? "text-emerald-600" : "text-red-600"}`}>
                                                            {isIn ? `+${item.quantity}` : `-${item.quantity}`}
                                                        </td>
                                                        <td className="py-4 px-4 text-slate-600 text-sm">{item.referenceNo || "N/A"}</td>
                                                        <td className="py-4 px-4 text-right text-slate-500 font-semibold text-sm">
                                                            {new Date(item.date || Date.now()).toLocaleDateString("en-GB", {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric"
                                                            })}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                </div>
            )}

        </div>
    );
}