"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Package, 
  Boxes, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Settings, 
  ChevronDown, 
  Menu, 
  X, 
  Search, 
  Bell, 
  LogOut, 
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  Box
} from "lucide-react";
// Better Auth client import
import { useSession, signOut } from "@/lib/auth-client"; 

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Mobile drawer state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop collapse state
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState({ inventory: false, sales: false });
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();

  // Better Auth user session
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  };

  const toggleSubmenu = (menu) => {
    setOpenSubmenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Products", href: "/dashboard/products", icon: Package },
    { 
      name: "Inventory", 
      href: "/dashboard/inventory", 
      icon: Boxes, 
    },
    { 
      name: "Sales", 
      href: "/dashboard/sales", 
      icon: ShoppingBag, 
    },
    { name: "Customers", href: "/dashboard/customers", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "AI Insights", href: "/dashboard/ai-insights", icon: Sparkles },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900">
      
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Component */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#07132b] text-slate-200 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 ${
          isCollapsed ? "w-24" : "w-64"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header - Logo Always Visible */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 min-w-[40px] rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Box className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed ? (
              <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
                SmartStock <span className="text-blue-400">AI</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-blue-400 tracking-tight">
                AI
              </span>
            )}
          </Link>

          {/* Desktop Hide/Show Sidebar Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition ml-1"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isSubmenuOpen = openSubmenu[item.key];

            return (
              <div key={item.name}>
                {item.hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.key)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white font-semibold" 
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className="w-5 h-5 min-w-[20px]" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`} />
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30" 
                        : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 min-w-[20px]" />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                )}

                {/* Submenu Dropdown */}
                {item.hasSubmenu && isSubmenuOpen && !isCollapsed && (
                  <div className="pl-10 pr-2 py-1.5 space-y-1">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom User Profile Card with Logout Popover */}
        <div className="p-3 border-t border-slate-800/80 relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt={user.name || "User"} 
                  className="w-10 h-10 min-w-[40px] rounded-full object-cover border border-slate-700" 
                />
              ) : (
                <div className="w-10 h-10 min-w-[40px] rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-base">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              {!isCollapsed && (
                <div className="text-left overflow-hidden">
                  <h4 className="text-base font-semibold text-white truncate">
                    {isPending ? "Loading..." : user?.name || "Admin"}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {isPending ? "..." : user?.email || "admin@shop.com"}
                  </p>
                </div>
              )}
            </div>
            {!isCollapsed && <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Bottom Profile Logout Popover */}
          <AnimatePresence>
            {profileDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute bottom-20 ${isCollapsed ? "left-20" : "left-3 right-3"} bg-[#0b1b3d] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200`}
              >
                <div className="px-3 py-2 border-b border-slate-700/80 mb-1">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.email || "admin@shop.com"}
                  </p>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "lg:pl-24" : "lg:pl-64"}`}>
        
        {/* Top Header Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between gap-4 shadow-sm">
          
          {/* Search Bar & Mobile Toggle */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Open Sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, inventory..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-base transition text-slate-900"
              />
            </div>
          </div>

          {/* Right Header: Notification Icon + Simple Profile Info */}
          <div className="flex items-center gap-4">
            
            {/* Notification Icon */}
            <button className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200"></div>

            {/* Profile Image & Name Only (No dropdown, no email) */}
            <div className="flex items-center gap-3">
              {user?.image ? (
                <img 
                  src={user.image} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-sm" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              )}
              <span className="hidden sm:inline-block text-base font-bold text-slate-800">
                {isPending ? "Loading..." : user?.name || "Admin"}
              </span>
            </div>

          </div>
        </header>

        {/* Dynamic Page Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}