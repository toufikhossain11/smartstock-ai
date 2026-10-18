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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fixed 5 items per page
  
  // Modal & Toast states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Electronics",
    price: "",
    stock: "",
    image: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productId = editingProduct?._id;
      const url = productId 
        ? `http://localhost:5000/api/products/${productId}`
        : "http://localhost:5000/api/products";
      
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        fetchProducts();
        closeModal();
        showToast(productId ? "Product updated successfully!" : "Product added successfully!");
      } else {
        showToast(data.message || "Operation failed", "error");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      showToast("Server error occurred", "error");
    }
  };

  // Open Delete Modal
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Execute Delete
  const handleDelete = async () => {
    if (!productToDelete) return;
    const productId = productToDelete._id;
    
    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        showToast("Product deleted successfully!");
      } else {
        showToast("Failed to delete product", "error");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast("Server error occurred", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "Electronics", price: "", stock: "", image: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "Electronics",
      price: product.price || "",
      stock: product.stock || "",
      image: product.image || ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Filter logic
  const filteredProducts = products.filter((item) => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || item.category === selectedCategory;
    const status = item.stock < 5 ? "Low Stock" : "In Stock";
    const matchesStatus = selectedStatus === "All Status" || status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination Logic (5 items per page)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Products</h1>
          <p className="text-base text-slate-500">Manage your product inventory.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/20 transition"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 outline-none text-base transition text-slate-900 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 text-base font-semibold outline-none cursor-pointer"
          >
            <option>All Categories</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Accessories</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 text-base font-semibold outline-none cursor-pointer"
          >
            <option>All Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="w-9 h-9 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-base">
                {currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-slate-400 font-medium text-base">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((item) => {
                    const isLowStock = item.stock < 5;
                    return (
                      <tr key={item._id} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 px-6">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-slate-400 text-sm">{item.name?.charAt(0)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">{item.name}</td>
                        <td className="py-4 px-6 text-slate-600 font-semibold">{item.category}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">৳ {Number(item.price).toLocaleString()}</td>
                        <td className="py-4 px-6 font-bold text-slate-900">{item.stock}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1.5 text-sm font-bold rounded-lg border ${
                            isLowStock 
                              ? "bg-amber-50 text-amber-600 border-amber-200" 
                              : "bg-emerald-50 text-emerald-600 border-emerald-200"
                          }`}>
                            {isLowStock ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                            title="Edit"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => confirmDelete(item)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Dynamic Pagination Footer */}
        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-semibold text-slate-500">
          <span>
            Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
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
                  className={`px-4 py-2 rounded-xl font-bold transition ${
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
            <h3 className="text-xl font-bold text-slate-900">Delete Product?</h3>
            <p className="text-sm text-slate-500">
              Are you sure you want to delete <span className="font-bold text-slate-800">{productToDelete?.name}</span>? This action cannot be undone.
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wireless Mouse"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 bg-white text-slate-900 font-semibold"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Price (৳)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1200"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.png"
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
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}