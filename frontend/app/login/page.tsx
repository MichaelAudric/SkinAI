"use client";

import { useState } from "react";
import { login } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await login({ email, password });

      const user = await apiFetch("/me", { method: "GET" });

      setUser(user);

      if (user.role === "doctor") {
        router.push("/doctor");
      } else if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* BACKGROUND BASE */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/40 to-white" />

      {/* GLOW ORBS (stronger + layered like homepage) */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-200/40 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-200/30 blur-3xl rounded-full" />

      {/* TECH GRID OVERLAY */}
      <div className="absolute inset-0 opacity-[0.15] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* FLOATING LIGHT BEAM */}
      <motion.div
        animate={{ y: ["-20%", "120%"] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute left-1/2 top-0 w-[2px] h-full bg-blue-400/20 blur-sm"
      />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-sm"
      >
        <div className="p-8 space-y-6 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-medium border border-blue-200 mb-3">
              Secure Access
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Sign in to your clinical AI dashboard
            </p>
          </motion.div>

          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-3"
          >
            <input
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>

          {/* BUTTON */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white text-sm font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
