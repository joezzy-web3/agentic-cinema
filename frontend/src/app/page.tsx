"use client";

import React, { useState } from "react";

export default function Home() {
  const [city, setCity] = useState("Abuja");
  const [budget, setBudget] = useState("200000");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleScout = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("https://agentic-cinema.onrender.com/scout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: city,
          budget: budget,
          image_name: image ? image.name : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to scout location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 flex flex-col items-center">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-indigo-400">
          AGENTIC CINEMA
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          AI-Powered Film Location Scouting Assistant
        </p>
      </header>

      <main className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Input Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              City / Region
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. Abuja"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Daily Budget Target (₦)
            </label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 200000"
            />
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Reference Photo (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
          />
          {image && (
            <p className="text-xs text-indigo-300 mt-2">Selected: {image.name}</p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleScout}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold py-4 rounded-xl transition duration-200 shadow-lg text-base"
        >
          {loading ? "Scouting Locations with Gemini 3.6 Flash..." : "Start AI Location Scout"}
        </button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-950/50 border border-red-800 text-red-300 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Recommendations Output */}
        {result && (
          <div className="bg-slate-950 border border-indigo-900/40 p-6 rounded-xl space-y-4 mt-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-indigo-400 font-bold text-lg">
                Location Brief: {result.city?.toUpperCase()}
              </h3>
              <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded-full font-mono">
                Budget: ₦{result.budget}
              </span>
            </div>

            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
              {result.recommendations}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
