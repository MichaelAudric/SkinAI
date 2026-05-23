"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HistoryItem = {
  id: number;
  prediction: string;
  confidence: number;
  severity: string;
  image_path: string;
  created_at: string;
  lesion_name: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await apiFetch("/history", { method: "GET" });
      setHistory(res);
    } catch {
      alert("Could not load history");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6 text-gray-500">
        Loading history...
      </div>
    );
  }

  const grouped = history.reduce((acc: any, item) => {
    const key = item.lesion_name;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Patient Records
        </h1>
        <p className="text-sm text-gray-500 mt-1">Grouped by lesion</p>
      </div>

      {/* EMPTY STATE */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-white/80 border border-gray-200 rounded-2xl p-10 text-center text-gray-500 shadow-sm">
          No records found
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(grouped).map(([lesionName, items]: any) => {
            const sorted = [...items].sort(
              (a: HistoryItem, b: HistoryItem) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            );

            const latest = sorted[0];

            return (
              <div
                key={lesionName}
                onClick={() => router.push(`/history/${lesionName}`)}
                className="bg-white/90 border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer space-y-5"
              >
                {/* TOP ROW */}
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <h2 className="text-gray-900 font-medium truncate">
                      {lesionName}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      Last scan:{" "}
                      {new Date(latest.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md whitespace-nowrap border border-blue-100">
                    {items.length} scans
                  </span>
                </div>

                {/* IMAGE STRIP */}
                <div className="flex gap-2 mt-4">
                  {sorted.slice(0, 3).map((item: HistoryItem) => (
                    <img
                      key={item.id}
                      src={item.image_path}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                </div>

                {/* LATEST RESULT */}
                <div className="mt-4 space-y-1">
                  <p className="text-xs text-gray-500">Latest prediction</p>

                  <p className="text-sm font-medium text-gray-800">
                    {latest.prediction}
                  </p>

                  {/* CONFIDENCE BAR */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${latest.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
