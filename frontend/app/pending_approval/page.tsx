"use client";

import { useRouter } from "next/navigation";

export default function PendingApprovalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-6">
      {/* CARD */}
      <div className="w-full max-w-md relative">
        {/* GLOW BACKDROP */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-white to-blue-50 rounded-2xl blur-2xl" />

        {/* MAIN CARD */}
        <div className="relative bg-white border border-gray-100 rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* ICON */}
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-xl font-semibold text-gray-900">
            Account Under Review
          </h1>

          {/* DESCRIPTION */}
          <p className="text-sm text-gray-500 leading-relaxed">
            Your doctor account has been successfully submitted and is now
            waiting for admin approval. You will gain access once your
            credentials are verified.
          </p>

          {/* STATUS BAR */}
          <div className="space-y-2">
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-blue-500 w-1/2 animate-pulse" />
            </div>
            <p className="text-xs text-gray-400">Verification in progress</p>
          </div>

          {/* ACTION */}
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
}
