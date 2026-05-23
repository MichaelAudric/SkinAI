"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Doctor = {
  id: number;
  username: string;
  email: string;
};

type Qualification = {
  document_path: string;
};

export default function DoctorDetailPage() {
  const { doctor_id } = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDoctor() {
    try {
      const res = await apiFetch("/admin/doctors/pending", {
        method: "GET",
      });

      const found = res.find((d: Doctor) => d.id === Number(doctor_id));

      setDoctor(found || null);
    } catch {
      alert("Failed to load doctor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctor();
  }, []);

  async function viewQualification() {
    try {
      const res: Qualification = await apiFetch(
        `/admin/doctors/${doctor_id}/qualification`,
        { method: "GET" },
      );

      console.log(res.document_path);

      window.open(res.document_path, "_blank");
    } catch {
      alert("Failed to load document");
    }
  }

  async function approveDoctor() {
    try {
      await apiFetch(`/admin/doctors/${doctor_id}/approve`, {
        method: "POST",
      });

      router.push("/admin");
    } catch {
      alert("Failed to approve doctor");
    }
  }

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!doctor) {
    return <div className="p-6 text-gray-500">Doctor not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
      {/* BACK */}
      <button
        onClick={() => router.push("/admin")}
        className="text-sm text-gray-500 hover:text-gray-900 transition cursor-pointer"
      >
        ← Back
      </button>

      {/* CARD */}
      <div className="bg-white/90 border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
        {/* INFO */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {doctor.username}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{doctor.email}</p>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-100" />

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={viewQualification}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition cursor-pointer"
          >
            View Qualification
          </button>

          <button
            onClick={approveDoctor}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm cursor-pointer"
          >
            Approve Doctor
          </button>
        </div>
      </div>
    </div>
  );
}
