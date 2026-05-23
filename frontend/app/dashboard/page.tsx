"use client";

import { apiFetch } from "@/lib/api";
import { useState } from "react";

type PredictionResult = {
  prediction: string;
  confidence: number;
  severity: string;
  id: number;
  lesion_name: string;
};

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [lesionName, setLesionName] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleUpload() {
    if (!file) return alert("Select an image");
    if (!lesionName) return alert("Enter lesion name");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lesion_name", lesionName);

    try {
      setLoading(true);

      const res = await apiFetch("/predict", {
        method: "POST",
        body: formData,
      });

      setResult(res);
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* TITLE */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Skin Disease Analysis
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload an image to get AI-based prediction
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT: UPLOAD */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-medium text-gray-800">Upload Image</h2>
          {/* REMINDER */}
          <p className="text-xs text-gray-500 italic mb-2">
            For best results, please upload dermoscopic images.
          </p>

          <div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 bg-blue-50 rounded-xl p-6 cursor-pointer hover:bg-blue-100 transition"
            >
              <p className="text-sm text-gray-600">
                {file ? "Change image" : "Click to upload image"}
              </p>
            </label>
          </div>

          {preview && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Lesion name (e.g. left arm mole)"
            className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lesionName}
            onChange={(e) => setLesionName(e.target.value)}
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* RIGHT: RESULT */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg flex flex-col justify-center">
          {!result ? (
            <div className="text-center text-gray-400 text-sm">
              Prediction results will appear here
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-500">Prediction</p>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {result.prediction}
                </h2>
              </div>

              <div>
                <p className="text-sm text-gray-500">Confidence</p>

                <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {(result.confidence * 100).toFixed(2)}%
                </p>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Severity</p>
                  <p className="text-sm font-medium text-gray-800">
                    {result.severity}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Lesion</p>
                  <p className="text-sm font-medium text-gray-800">
                    {result.lesion_name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* DISCLAIMER */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <p className="text-sm text-yellow-800">
          <span className="font-semibold">Disclaimer:</span> This AI prediction
          is provided for informational purposes only and does not replace
          professional medical advice, diagnosis, or treatment from a qualified
          doctor.
        </p>
      </div>
    </div>
  );
}
