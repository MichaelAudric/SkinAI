"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type HistoryItem = {
  id: number;
  prediction: string;
  confidence: number;
  severity: string;
  image_path: string;
  created_at: string;
  lesion_name: string;
};

type Feedback = {
  id: number;
  doctor_name: string;
  doctor_email: string;
  comment: string;
  created_at: string;
};

export default function LesionDetailPage() {
  const { lesion_name } = useParams();
  const router = useRouter();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const res = await apiFetch("/history", { method: "GET" });

      const filtered = res
        .filter((item: HistoryItem) => item.lesion_name === lesion_name)
        .sort(
          (a: HistoryItem, b: HistoryItem) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );

      setItems(filtered);

      const fbRes = await apiFetch(`/feedback/${lesion_name}`, {
        method: "GET",
      });

      setFeedback(fbRes);
    } catch {
      alert("Failed to load lesion data");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 text-gray-500">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-6 text-gray-500">
        No data found for this lesion.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <button
          onClick={() => router.push("/history")}
          className="text-sm text-gray-500 hover:text-gray-900 transition cursor-pointer"
        >
          ← Back to Records
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">
          Lesion Timeline
        </h1>

        <p className="text-sm text-gray-500">{lesion_name}</p>
      </div>

      {/* TIMELINE */}
      <div className="relative border-l border-gray-200 ml-3 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="relative pl-8">
            {/* DOT */}
            <div className="absolute left-[-6px] top-5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />

            {/* CARD */}
            <div className="bg-white/90 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition p-5">
              {/* HEADER ROW */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400">
                    {new Date(item.created_at).toLocaleString()}
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900 mt-1">
                    {item.prediction}
                  </h2>
                </div>

                <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-md whitespace-nowrap">
                  {item.severity}
                </span>
              </div>

              {/* CONTENT */}
              <div className="mt-4 flex gap-4">
                <img
                  src={item.image_path}
                  className="w-28 h-28 object-cover rounded-xl border border-gray-200"
                />

                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Confidence</p>

                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${item.confidence * 100}%` }}
                      />
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {(item.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FEEDBACK SECTION */}
      <div className="pt-6 border-t border-gray-200 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Specialist Feedback
        </h2>
        <p className="text-xs text-gray-500">
          Patients may contact specialists through the provided email addresses
          for further consultation.
        </p>
        {feedback.length === 0 ? (
          <p className="text-sm text-gray-500">No feedback yet.</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((f) => (
              <div
                key={f.id}
                className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Dr. {f.doctor_name}
                    </p>

                    {f.doctor_email && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {f.doctor_email}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(f.created_at).toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-gray-600 mt-4">{f.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
