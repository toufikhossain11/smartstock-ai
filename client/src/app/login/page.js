"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Box,
  ArrowRight
} from "lucide-react";
// Tomar better-auth client import path adjust kore nio
import { signIn } from "@/lib/auth-client"; 

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("demo@smartstock.ai");
  const [password, setPassword] = useState("demouser123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard"
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1128] flex items-center justify-center p-4 lg:p-8 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl bg-[#070d21] border border-slate-800">
        
        {/* Left Side: Background Design, Text & Illustrations from Image 1 */}
        <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-b from-[#0a1128] to-[#040814]">
          {/* Glowing background effects */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10"
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Box className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                SmartStock <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-sm font-medium text-blue-300 tracking-wide uppercase">
              Smarter Inventory • Better Business
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="z-10 space-y-6 my-auto py-8"
          >
            <h2 className="text-3xl font-bold text-white leading-snug">
              Manage your inventory, track sales <br />
              and grow your business with AI insights.
            </h2>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-emerald-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Track Inventory</h4>
                  <p className="text-slate-400 text-xs">Keep your stock in check</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Manage Sales</h4>
                  <p className="text-slate-400 text-xs">Record and analyze your sales</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">AI Insights</h4>
                  <p className="text-slate-400 text-xs">Get smart recommendations</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-purple-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Secure & Reliable</h4>
                  <p className="text-slate-400 text-xs">Your data, always protected</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Graphic Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="z-10 relative mt-4"
          >
            <div className="flex items-end gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
              <div className="w-12 h-12 rounded-lg bg-blue-600/30 flex items-center justify-center border border-blue-500/40 shadow-inner">
                <Box className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="h-2.5 bg-blue-500/40 rounded-full w-3/4"></div>
                <div className="h-2 bg-slate-700 rounded-full w-1/2"></div>
              </div>
              <div className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                +24.5% <TrendingUp className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 lg:p-12 flex flex-col justify-center text-slate-900"
        >
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back!
              </h2>
              <p className="text-sm text-slate-500">
                Sign in to your account to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-sm font-medium bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition text-sm font-medium bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  <span className="text-slate-600 font-medium">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition duration-200 flex items-center justify-center gap-2 group"
              >
                {loading ? "Signing in..." : "Login"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase tracking-widest font-semibold">OR</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition font-medium text-sm text-slate-700 flex items-center justify-center gap-3 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.2v3.15C3.21 21.34 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.2C.43 8.15 0 9.89 0 12s.43 3.85 1.2 5.39l4.07-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.21 2.66 1.2 6.61l4.07 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Continue with Google
            </button>

            <p className="text-center text-xs text-slate-500 pt-2">
              Donot have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}