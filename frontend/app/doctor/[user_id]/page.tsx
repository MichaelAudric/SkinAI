"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Prediction = {
  id: number;
  lesion_name: string;
  image_path: string;
  created_at: string;
};

type LesionGroup = {
  lesion_name: string;
  count: number;
  latest_image: string;
};

export default function DoctorPatientPage() {
  const { user_id } = useParams();
  const router = useRouter();

  const [lesions, setLesions] = useState<LesionGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch(`/doctor/history/${user_id}`);

        const data: Prediction[] = res;

        // GROUP BY lesion_name (same logic as your patient history)
        const map: Record<string, LesionGroup> = {};

        data.forEach((p) => {
          if (!map[p.lesion_name]) {
            map[p.lesion_name] = {
              lesion_name: p.lesion_name,
              count: 0,
              latest_image: p.image_path,
            };
          }

          map[p.lesion_name].count += 1;
        });

        setLesions(Object.values(map));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user_id]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Patient Lesions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Grouped clinical records by lesion
        </p>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="bg-white/80 border border-gray-200 rounded-2xl p-6 text-gray-500">
          Loading...
        </div>
      ) : (
        <div className="grid gap-3">
          {lesions.map((l) => (
            <div
              key={l.lesion_name}
              onClick={() => router.push(`/doctor/${user_id}/${l.lesion_name}`)}
              className="flex justify-between items-center p-4 bg-white/90 border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition cursor-pointer"
            >
              {/* LEFT */}
              <div>
                <p className="font-medium text-gray-900">{l.lesion_name}</p>
                <p className="text-sm text-gray-500">{l.count} scans</p>
              </div>

              {/* RIGHT BADGE */}
              <div className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-md whitespace-nowrap">
                View timeline →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
