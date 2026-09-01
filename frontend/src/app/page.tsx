"use client";

import React, { useState } from "react";
import { Upload, Film, MapPin, DollarSign, Search, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";

interface Candidate {
  name: string;
  address_area: string;
  price_per_day: string;
  permit_status: string;
  match_score: number;
  source_url: string;
  notes: string;
}

interface LocationSearchResult {
  query_used: string;
  visual_description: string;
  candidates: Candidate[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [city, setCity] = useState("Lagos");
  const [budget, setBudget] = useState("₦200,000 per day");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LocationSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSearch = async () => {
    if (!file) {
      setError("Please select a scene reference photo first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("city", city);
    formData.append("budget", budget);

    try {
      const response = await fetch("http://127.0.0.1:8000/scout", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: LocationSearchResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to search for locations. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="border-b border-slate-800 pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3 text-indigo-400">
              <Film className="w-8 h-8" /> Agentic Location Scout
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              AI-driven visual aesthetic match & web scout for film production locations
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full text-xs font-mono">
            Phase 3 Ready
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-slate-200">1. Scene Reference & Parameters</h2>

            {/* Image Input */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Reference Photo
              </label>
              <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-4 text-center cursor-pointer transition relative bg-slate-950">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {preview ? (
                  <img src={preview} alt="Reference Preview" className="max-h-48 mx-auto rounded object-cover" />
                ) : (
                  <div className="space-y-2 py-4">
                    <Upload className="w-8 h-8 mx-auto text-slate-500" />
                    <p className="text-xs text-slate-400">Click or drag & drop location reference photo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Target Area */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-100"
                />
              </div>
            </div>

            {/* Target Budget */}
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Daily Budget Target
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-slate-100"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Scouting Web...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Start AI Location Scout
                </>
              )}
            </button>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/50 border border-red-800 p-3 rounded">
                {error}
              </p>
            )}
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 space-y-6">
            {!result && !loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-500">
                <Film className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Upload a reference photo and click search to view AI-scouted production locations.</p>
              </div>
            )}

            {loading && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-4">
                <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-400" />
                <p className="text-sm">Gemini is analyzing visual style & Parallel AI is querying web listings...</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                
                {/* Visual Analysis Breakdown */}
                <div className="bg-slate-900 border border-indigo-900/50 rounded-xl p-5 space-y-2">
                  <span className="text-xs font-mono text-indigo-400 uppercase tracking-wide">
                    Gemini 3.6 Flash Visual Analysis
                  </span>
                  <p className="text-sm text-slate-300 italic">{result.visual_description}</p>
                </div>

                {/* Candidate Listings */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-200">
                    Scouted Candidates ({result.candidates.length})
                  </h2>

                  {result.candidates.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-bold text-slate-100">{item.name}</h3>
                          <p className="text-xs text-indigo-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" /> {item.address_area}
                          </p>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full text-xs font-semibold">
                          {item.match_score}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-400">{item.notes}</p>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        <span className="font-mono text-slate-300">{item.price_per_day}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> {item.permit_status}
                          </span>
                          {item.source_url && item.source_url.startsWith("http") && (
                            <a
                              href={item.source_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-400 hover:underline flex items-center gap-1"
                            >
                              Source <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
