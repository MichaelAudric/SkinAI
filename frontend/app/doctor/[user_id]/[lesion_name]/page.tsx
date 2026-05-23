"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Prediction = {
  id: number;
  image_path: string;
  prediction: string;
  confidence: number;
  severity: string;
  created_at: string;
};

type Feedback = {
  id: number;
  doctor_id: number;
  doctor_name: string; // ✅ added
  comment: string;
  created_at: string;
};

export default function LesionDetailPage() {
  const { user_id, lesion_name } = useParams();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await apiFetch(
        `/doctor/patient/${user_id}/lesion/${lesion_name}`,
      );

      setPredictions(res.predictions);
      setFeedback(res.feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!comment.trim()) return;

    try {
      await apiFetch("/doctor/feedback", {
        method: "POST",
        body: JSON.stringify({ user_id, lesion_name, comment }),
      });

      setComment("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Lesion: {lesion_name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Clinical timeline with doctor annotations
        </p>
      </div>

      {/* TIMELINE */}
      <div className="space-y-4">
        {predictions.map((p) => (
          <div
            key={p.id}
            className="bg-white/90 border border-gray-200 rounded-2xl shadow-sm p-5"
          >
            <div className="flex gap-4">
              <a href={p.image_path} target="_blank" rel="noopener noreferrer">
                <img
                  src={p.image_path}
                  className="w-36 h-36 object-cover rounded-xl border border-gray-200 cursor-pointer hover:opacity-90 transition"
                />
              </a>

              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(p.created_at).toLocaleString()}
                    </p>

                    <h2 className="text-lg font-semibold text-gray-900">
                      {p.prediction}
                    </h2>
                  </div>

                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-md">
                    {p.severity}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Confidence</p>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${p.confidence * 100}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {(p.confidence * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FEEDBACK */}
      <div className="pt-6 border-t border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Doctor Feedback</h2>

        <div className="space-y-3">
          {feedback.map((f) => (
            <div
              key={f.id}
              className="bg-white/90 border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex justify-between">
                <p className="font-medium text-gray-900">Dr. {f.doctor_name}</p>

                <p className="text-xs text-gray-400">
                  {new Date(f.created_at).toLocaleString()}
                </p>
              </div>

              <p className="text-sm text-gray-600 mt-2">{f.comment}</p>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write feedback..."
            className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition shadow-sm cursor-pointer"
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
