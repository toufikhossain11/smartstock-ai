"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Loader2,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination State (5 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal & Toast states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    totalPurchase: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers`);
      const data = await res.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle Add or Update Customer
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const customerId = editingCustomer?._id;
      const url = customerId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/customers/${customerId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/customers`;
      
      const method = customerId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        fetchCustomers();
        closeModal();
        showToast(customerId ? "Customer updated successfully!" : "Customer added successfully!");
      } else {
        showToast(data.message || "Operation failed", "error");
      }
    } catch (err) {
      console.error("Error saving customer:", err);
      showToast("Server error occurred", "error");
    }
  };

  // Open Delete Modal
  const confirmDelete = (customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  // Execute Delete
  const handleDelete = async () => {
    if (!customerToDelete) return;
    const customerId = customerToDelete._id;
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers/${customerId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchCustomers();
        showToast("Customer deleted successfully!");
      } else {
        showToast("Failed to delete customer", "error");
      }
    } catch (err) {
      console.error("Error deleting customer:", err);
      showToast("Server error occurred", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: "", email: "", phone: "", totalPurchase: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      totalPurchase: customer.totalPurchase || ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  // Filter customers by search query
  const filteredCustomers = customers.filter((item) => {
    const matchesName = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmail = item.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhone = item.phone?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesName || matchesEmail || matchesPhone;
  });

  // Dynamic Pagination Logic (5 items per page)
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

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
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm sm:text-base text-slate-500">Manage your customer information.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/20 transition w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search customers..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none text-base transition text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-4 sm:px-6">Name</th>
                  <th className="py-4 px-4 sm:px-6">Email</th>
                  <th className="py-4 px-4 sm:px-6">Phone</th>
                  <th className="py-4 px-4 sm:px-6">Total Purchase</th>
                  <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm sm:text-base">
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400 font-medium">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">{item.name}</td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">{item.email}</td>
                      <td className="py-4 px-4 sm:px-6 text-slate-600 font-medium whitespace-nowrap">{item.phone}</td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                        ৳ {Number(item.totalPurchase || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 sm:p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => confirmDelete(item)}
                          className="p-2 sm:p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Responsive Dynamic Pagination */}
        <div className="p-4 sm:p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-semibold text-slate-500">
          <span>
            Showing {filteredCustomers.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredCustomers.length)} of {filteredCustomers.length} customers
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold transition ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "border border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Delete Customer?</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete <span className="font-bold text-slate-800">{customerToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahim Ahmed"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahim@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="01712345678"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">Total Purchase (৳)</label>
                <input
                  type="number"
                  value={formData.totalPurchase}
                  onChange={(e) => setFormData({ ...formData, totalPurchase: e.target.value })}
                  placeholder="12450"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-base font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-lg shadow-blue-600/30 transition"
                >
                  {editingCustomer ? "Update Customer" : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}