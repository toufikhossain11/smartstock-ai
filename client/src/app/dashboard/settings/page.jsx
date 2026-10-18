"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client"; // Better Auth client helper
import { 
  User, 
  Lock, 
  Bell, 
  CheckCircle, 
  Save, 
  Loader2 
} from "lucide-react";

export default function SettingsPage() {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const [activeTab, setActiveTab] = useState("Profile");
  
  // Real Logged-in User Profile State from Better Auth Session
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    image: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    lowStockAlerts: true,
    salesSummary: false
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  // Populate state when session loads or updates
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: session.user.phone || "",
        image: session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
      });
    }
  }, [session]);

  // Update User Profile via Better Auth / Express API
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      // Option A: Using Better Auth Client update user
      const { data, error } = await authClient.updateUser({
        name: profileData.name,
        image: profileData.image,
      });

      if (error) {
        showToast(error.message || "Failed to update profile", "error");
        return;
      }

      // Option B: If updating extra custom fields (like phone) on MongoDB
      if (session?.user?.id) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            photo: profileData.image
          })
        });
      }

      await refetch(); // Reload Better Auth Session
      showToast("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      showToast("Server error occurred", "error");
    }
  };

  // Change Password using Better Auth Client
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match!", "error");
      return;
    }

    try {
      const { data, error } = await authClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        showToast(error.message || "Password update failed", "error");
      } else {
        showToast("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      console.error("Password change error:", err);
      showToast("Server error occurred", "error");
    }
  };

  if (isPending) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
        <p className="text-slate-600 font-bold text-lg">No active user session found. Please log in.</p>
      </div>
    );
  }

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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-slate-500">Manage your authenticated account profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-2 lg:col-span-1 h-fit">
          <button
            onClick={() => setActiveTab("Profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition ${
              activeTab === "Profile" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          
          <button
            onClick={() => setActiveTab("Change Password")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition ${
              activeTab === "Change Password" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Lock className="w-5 h-5" /> Change Password
          </button>

          <button
            onClick={() => setActiveTab("Notifications")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-base transition ${
              activeTab === "Notifications" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bell className="w-5 h-5" /> Notifications
          </button>
        </div>

        {/* Dynamic Right Content Area */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm lg:col-span-3">
          
          {/* TAB 1: PROFILE INFO */}
          {activeTab === "Profile" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                <p className="text-sm text-slate-500">Authenticated user details from Better Auth Session.</p>
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                  <img src={profileData.image} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{session.user.name}</h4>
                  <p className="text-sm text-slate-500">{session.user.email}</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={profileData.email}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Phone Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="e.g. 01712345678"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Photo URL</label>
                    <input
                      type="text"
                      value={profileData.image}
                      onChange={(e) => setProfileData({ ...profileData, image: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === "Change Password" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Change Password</h3>
                <p className="text-sm text-slate-500">Update your Better Auth session password safely.</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base outline-none focus:border-blue-600 text-slate-900 font-medium"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" /> Update Password
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "Notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
                <p className="text-sm text-slate-500">Manage system notification preferences.</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 cursor-pointer hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-bold text-slate-900">Email Alerts</h4>
                    <p className="text-sm text-slate-500">Receive system activity emails.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.emailAlerts}
                    onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/60 cursor-pointer hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-bold text-slate-900">Low Stock Alerts</h4>
                    <p className="text-sm text-slate-500">Get notified when stock is low.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({ ...notifications, lowStockAlerts: e.target.checked })}
                    className="w-5 h-5 accent-blue-600 cursor-pointer"
                  />
                </label>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => showToast("Notification settings saved!")}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-600/30 transition flex items-center gap-2"
                >
                  <Save className="w-5 h-5" /> Save Preferences
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}