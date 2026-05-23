"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-6xl mx-auto px-6 py-2 space-y-24">
      {/* HERO */}
      <div className="relative overflow-hidden rounded-[36px] border border-blue-100 bg-gradient-to-br from-white via-blue-50/40 to-white px-8 py-16 md:px-14 md:py-20">
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 h-72 w-72 bg-blue-200/30 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 h-72 w-72 bg-sky-100/40 blur-3xl rounded-full" />

        <div className="relative grid md:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-7"
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200 w-fit">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Ensemble AI Skin Disease Classification
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 leading-[1.05] tracking-tight max-w-2xl">
                AI-Powered Skin
                <span className="text-blue-600"> Disease Analysis </span>
                for Clinical Workflows
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed max-w-xl">
                Deep learning ensemble models for skin lesion classification,
                severity prediction, and doctor-assisted clinical validation.
              </p>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 pt-2">
              {[
                {
                  label: "Disease Classes",
                  value: "7",
                },
                {
                  label: "AI Models",
                  value: "3",
                },
                {
                  label: "Inference",
                  value: "Ensemble",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl px-6 py-4 min-w-[120px] shadow-sm"
                >
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">
              {!user ? (
                <>
                  <Link
                    href="/register"
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                  >
                    Get Started
                  </Link>

                  <Link
                    href="/login"
                    className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm hover:bg-gray-50 transition"
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link
                  href={
                    user.role === "doctor"
                      ? "/doctor"
                      : user.role === "admin"
                        ? "/admin"
                        : "/dashboard"
                  }
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                >
                  Continue
                </Link>
              )}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* MAIN AI PANEL */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative overflow-hidden bg-white/90 backdrop-blur border border-white/50 rounded-[28px] shadow-2xl p-6 space-y-6"
            >
              {/* SCAN AREA */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 flex items-center justify-center">
                {/* GRID */}
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:28px_28px]" />

                {/* SCAN LINE */}
                <motion.div
                  animate={{ top: ["0%", "100%"] }}
                  transition={{
                    duration: 2.6,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="absolute left-0 w-full h-[3px] bg-blue-400/40 shadow-[0_0_18px_rgba(59,130,246,0.45)]"
                />

                {/* CENTER */}
                <div className="relative z-10 text-center space-y-3">
                  <div className="w-20 h-20 rounded-full border-4 border-blue-400/40 border-t-blue-500 animate-spin mx-auto" />

                  <div>
                    <p className="text-blue-700 text-sm font-semibold tracking-wide">
                      LOADING...
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Ensemble model processing dermoscopic image
                    </p>
                  </div>
                </div>
              </div>

              {/* PREDICTIONS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Top Prediction</p>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Melanocytic Nevus
                    </h2>
                  </div>

                  <div className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
                    92% Confidence
                  </div>
                </div>

                {/* PROBABILITIES */}
                <div className="space-y-3">
                  {[
                    { name: "Melanocytic Nevus", value: "92%" },
                    { name: "Benign Keratosis", value: "6%" },
                    { name: "Melanoma", value: "2%" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{item.name}</span>
                        <span>{item.value}</span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: item.value }}
                          transition={{ duration: 1, delay: i * 0.15 }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* FLOATING MODEL CARD */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-5 shadow-xl w-56"
            >
              <p className="text-xs text-gray-500">AI Architecture</p>

              <div className="mt-3 space-y-2">
                {["EfficientNetB3", "DenseNet121", "Soft Voting Ensemble"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      {item}
                    </div>
                  ),
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* AI WORKFLOW */}
      <div className="space-y-10">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-medium border border-blue-200">
            Clinical AI Workflow
          </div>

          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            From Image Upload to Clinical Review
          </h2>

          <p className="text-gray-600 leading-relaxed">
            The system transforms dermoscopic images into clinical predictions
            using preprocessing, ensemble deep learning, and doctor validation.
          </p>
        </div>

        {/* STEPS */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              title: "Upload",
              desc: "Patient uploads dermoscopic image.",
              icon: "01",
            },
            {
              title: "Preprocess",
              desc: "Hair removal + CLAHE + normalization.",
              icon: "02",
            },
            {
              title: "AI Inference",
              desc: "Ensemble models generate prediction.",
              icon: "03",
            },
            {
              title: "Clinical Review",
              desc: "Doctors validate and track results.",
              icon: "04",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="bg-white/90 border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-semibold shadow-md">
                {step.icon}
              </div>

              <h3 className="mt-5 font-semibold text-gray-900">{step.title}</h3>

              <p className="text-sm text-gray-500 mt-2">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Ensemble AI Diagnosis",
            desc: "Combines EfficientNetB3 and DenseNet121 using soft voting to improve classification reliability.",
          },
          {
            title: "Image Preprocessing Pipeline",
            desc: "Automated hair removal, CLAHE contrast enhancement, and standardized normalization for medical imaging.",
          },
          {
            title: "Clinical Feedback System",
            desc: "Doctor validation loop that supports continuous improvement and real-world clinical alignment.",
          },
        ].map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: "easeOut",
            }}
            className="relative bg-white/90 border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* subtle glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100/40 blur-3xl rounded-full" />

            <h3 className="font-semibold text-gray-900">{f.title}</h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* TECH STACK */}
      <div className="space-y-8">
        {/* HEADER */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Built With Modern AI & Web Technologies
          </h2>

          <p className="text-gray-500 text-sm max-w-2xl mx-auto">
            A full-stack medical AI system integrating deep learning, backend
            engineering, and clinical workflow design.
          </p>
        </div>

        {/* STACK GRID */}
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Next.js",
            "FastAPI",
            "TensorFlow",
            "Keras",
            "PostgreSQL",
            "Framer Motion",
            "TailwindCSS",
            "JWT Auth",
            "Ensemble Learning",
            "Medical Imaging Pipeline",
          ].map((tech, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="px-4 py-2 bg-white/80 border border-gray-200 rounded-full text-sm text-gray-700 shadow-sm hover:shadow-md transition"
            >
              {tech}
            </motion.div>
          ))}
        </div>

        {/* SMALL SYSTEM LINE */}
        <div className="text-center text-xs text-gray-400 pt-4">
          End-to-end system: Image Upload → AI Inference → Clinical Review →
          Patient Tracking
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative mt-10 border-t border-gray-200 pt-10">
        {/* subtle background glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-100/20 blur-3xl rounded-full" />

        <div className="relative text-center space-y-4">
          <div className="text-lg font-semibold text-gray-900">
            SkinAI Medical Intelligence System
          </div>

          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            A full-stack AI platform for skin disease classification, severity
            prediction, and clinical decision support using deep learning
            ensemble models.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 pt-2">
            <span>EfficientNetB3</span>
            <span>•</span>
            <span>DenseNet121</span>
            <span>•</span>
            <span>Ensemble AI</span>
            <span>•</span>
            <span>ISIC Dataset</span>
            <span>•</span>
            <span>Clinical Workflow System</span>
          </div>

          <div className="text-xs text-gray-400 pt-4">
            © {new Date().getFullYear()} SkinAI. Built for academic research &
            clinical AI exploration.
          </div>
        </div>
      </div>
    </div>
  );
}
