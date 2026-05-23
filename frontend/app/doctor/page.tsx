"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Patient = {
  id: number;
  username: string;
  email: string;
};

export default function DoctorPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await apiFetch("/doctor/patients", { method: "GET" });
        setPatients(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div className="p-6">Loading patients...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Doctor Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Patient overview and records
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 text-gray-500">
          Loading patients...
        </div>
      ) : (
        <div className="grid gap-3">
          {patients.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/doctor/${p.id}`)}
              className="flex justify-between items-center p-4 bg-white/90 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
            >
              {/* LEFT INFO */}
              <div>
                <p className="font-medium text-gray-900">{p.username}</p>
                <p className="text-sm text-gray-500">{p.email}</p>
              </div>

              {/* RIGHT BADGE */}
              <div className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-md">
                View records →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
