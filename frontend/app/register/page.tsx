"use client";

import { useState } from "react";
import { register } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!form.username || !form.email || !form.password) {
      alert("Fill all fields");
      return;
    }

    if (form.role === "doctor" && !file) {
      alert("Please upload qualification PDF");
      return;
    }

    try {
      setLoading(true);

      // 1. register user
      await register(form);

      const user = await apiFetch("/me", { method: "GET" });
      setUser(user);

      // 2. IF DOCTOR → upload qualification
      if (user.role === "doctor" && file) {
        const formData = new FormData();
        formData.append("file", file);

        await apiFetch("/doctor/qualification", {
          method: "POST",
          body: formData,
        });
      }

      // 3. redirect
      if (user.role === "doctor") {
        router.push("/doctor");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      alert(err.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* BACKGROUND BASE */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/40 to-white" />

      {/* GLOW ORBS */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-200/40 blur-3xl rounded-full" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-sky-200/30 blur-3xl rounded-full" />

      {/* GRID */}
      <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* REGISTER CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="p-8 space-y-6 rounded-2xl bg-white/85 backdrop-blur-xl border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          {/* HEADER */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-medium border border-blue-200 mb-3">
              Create Account
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">
              Join SkinAI
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Start your clinical AI journey in seconds
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-3">
            <input
              placeholder="Username"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />

            <input
              placeholder="Email"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            {/* ROLE */}
            <select
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {/* DOCTOR UPLOAD */}
          {form.role === "doctor" && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                Upload qualification (PDF)
              </p>

              <label className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer text-sm hover:bg-gray-50 transition">
                Upload PDF
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                />
              </label>

              {file && (
                <p className="text-xs text-gray-500">Selected: {file.name}</p>
              )}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white text-sm font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            }`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
