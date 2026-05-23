"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Doctor = {
  id: number;
  username: string;
  email: string;
};

export default function AdminPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDoctors() {
    try {
      const res = await apiFetch("/admin/doctors/pending", {
        method: "GET",
      });

      setDoctors(res);
    } catch {
      alert("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-500">Loading doctors...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">Pending doctor approvals</p>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {doctors.length === 0 ? (
          <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 text-gray-500 shadow-sm">
            No pending doctors
          </div>
        ) : (
          doctors.map((d) => (
            <div
              key={d.id}
              onClick={() => router.push(`/admin/${d.id}`)}
              className="flex justify-between items-center p-4 bg-white/90 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium text-gray-900">{d.username}</p>
                <p className="text-sm text-gray-500">{d.email}</p>
              </div>

              {/* RIGHT */}
              <div className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-md">
                Review →
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
