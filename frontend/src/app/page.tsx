"use client";

import React, { useState } from "react";

interface ScoutResult {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  dailyRate: string;
  tags: string[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scout" | "pipeline">("scout");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScouting, setIsScouting] = useState<boolean>(false);
  const [scoutComplete, setScoutComplete] = useState<boolean>(false);
  const [results, setResults] = useState<ScoutResult[]>([]);
  const [locationQuery, setLocationQuery] = useState<string>("Tokyo");
  const [budgetQuery, setBudgetQuery] = useState<string>("200000");
  const [currency, setCurrency] = useState<string>("JPY");

  const generateDynamicResults = (fileName: string, location: string, currencySymbol: string): ScoutResult[] => {
    const nameLower = fileName ? fileName.toLowerCase() : "";

    if (nameLower.includes("water") || nameLower.includes("pool") || nameLower.includes("beach") || nameLower.includes("aqua")) {
      return [
        {
          id: "loc-1",
          name: `${location} Aquatic Studio & Resort`,
          location: `Coastal Zone, ${location}`,
          matchScore: 98,
          dailyRate: `${currencySymbol} 180,000 / day`,
          tags: ["Water Facilities", "High Capacity", "Underwater Rigs", "Permit Fast-Track"],
        },
        {
          id: "loc-2",
          name: `${location} Oceanfront Bay Complex`,
          location: `Bay District, ${location}`,
          matchScore: 92,
          dailyRate: `${currencySymbol} 195,000 / day`,
          tags: ["Natural Horizon", "Controlled Waves", "Crew Staging"],
        },
        {
          id: "loc-3",
          name: `${location} Indoor Water Stage`,
          location: `Studio District, ${location}`,
          matchScore: 87,
          dailyRate: `${currencySymbol} 150,000 / day`,
          tags: ["Heated Tank", "Lighting Control", "Soundproof"],
        },
      ];
    }

    if (nameLower.includes("cyber") || nameLower.includes("night") || nameLower.includes("neon") || nameLower.includes("city") || nameLower.includes("street")) {
      return [
        {
          id: "loc-1",
          name: `${location} Neon Alleyway & Skybridge`,
          location: `Downtown Central, ${location}`,
          matchScore: 99,
          dailyRate: `${currencySymbol} 160,000 / day`,
          tags: ["Cyberpunk Vibe", "Practical Neon", "Night Filming Permit"],
        },
        {
          id: "loc-2",
          name: `${location} Rooftop & Skyline Platform`,
          location: `Commercial District, ${location}`,
          matchScore: 94,
          dailyRate: `${currencySymbol} 210,000 / day`,
          tags: ["360 Degree View", "High Elevation", "Helipad Access"],
        },
        {
          id: "loc-3",
          name: `${location} Underground Transit Tunnel`,
          location: `Metro Area, ${location}`,
          matchScore: 88,
          dailyRate: `${currencySymbol} 175,000 / day`,
          tags: ["Moody Lighting", "Industrial Texture", "Private Access"],
        },
      ];
    }

    // Default Fallback — Guarantees results for ANY file upload or trigger
    return [
      {
        id: "loc-1",
        name: `${location} Primary Production Soundstage A`,
        location: `Central Film District, ${location}`,
        matchScore: 96,
        dailyRate: `${currencySymbol} 175,000 / day`,
        tags: ["Controlled Lighting", "Modular Sets", "Full Grip & Electric"],
      },
      {
        id: "loc-2",
        name: `${location} Metropolitan Exterior Lot B`,
        location: `Outskirts District, ${location}`,
        matchScore: 91,
        dailyRate: `${currencySymbol} 140,000 / day`,
        tags: ["Generous Parking", "DIT Support", "Large Vehicle Access"],
      },
      {
        id: "loc-3",
        name: `${location} Architectural Heritage Complex`,
        location: `Old Town Sector, ${location}`,
        matchScore: 85,
        dailyRate: `${currencySymbol} 190,000 / day`,
        tags: ["Historic Visuals", "Scenic Backdrops", "Private Security"],
      },
    ];
  };

  const startScouting = (file: File | null) => {
    setIsScouting(true);
    setScoutComplete(false);

    const fileName = file ? file.name : "reference_asset.jpg";
    const currSymbol = currency === "JPY" ? "¥" : currency === "USD" ? "$" : "€";

    setTimeout(() => {
      const generatedResults = generateDynamicResults(fileName, locationQuery, currSymbol);
      setResults(generatedResults);
      setIsScouting(false);
      setScoutComplete(true);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      startScouting(file);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d11] text-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header & Navigation */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <p className="text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
              EXT. WORLDWIDE — CONTINUOUS
            </p>
            <h1 className="text-5xl font-black tracking-tight">Agentic Cinema</h1>
          </div>

          <div className="flex bg-[#16161e] p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setActiveTab("scout")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition ${
                activeTab === "scout"
                  ? "bg-amber-600 text-black shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>🎬</span> Scout Engine
            </button>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold transition ${
                activeTab === "pipeline"
                  ? "bg-amber-600 text-black shadow-md"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>🌿</span> Pipeline Architecture
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "scout" && (
          <div className="space-y-6">
            <div className="bg-[#14141b] rounded-xl border border-gray-800 p-6 space-y-6 shadow-xl">
              <div className="flex items-center gap-2 text-amber-500 font-semibold text-lg">
                <span>✦</span>
                <h2>Scout Parameters</h2>
              </div>

              <div className="space-y-4">
                {/* Location Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    City, region or country
                  </label>
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-amber-500 outline-none text-white font-medium"
                  />
                </div>

                {/* Currency & Budget */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Currency
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-amber-500 outline-none text-white font-medium"
                    >
                      <option value="JPY" className="bg-[#14141b]">JPY</option>
                      <option value="USD" className="bg-[#14141b]">USD</option>
                      <option value="EUR" className="bg-[#14141b]">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Daily permit budget
                    </label>
                    <input
                      type="number"
                      value={budgetQuery}
                      onChange={(e) => setBudgetQuery(e.target.value)}
                      className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-amber-500 outline-none text-right text-white font-medium"
                    />
                  </div>
                </div>

                {/* Upload Input Field */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Reference Image / Location Asset
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-[#1a1a23] hover:border-amber-500 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className={`w-8 h-8 mb-2 ${isScouting ? "animate-spin text-amber-400" : "text-amber-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-xs text-gray-300">
                        {isScouting ? (
                          <span className="text-amber-400 font-medium animate-pulse">
                            Auto-scouting asset visual match...
                          </span>
                        ) : selectedFile ? (
                          <span className="text-amber-400 font-medium">{selectedFile.name}</span>
                        ) : (
                          <span><strong className="text-amber-500">Click to upload</strong> reference image</span>
                        )}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => startScouting(selectedFile)}
                disabled={isScouting}
                className={`w-full font-bold py-3.5 rounded-lg transition shadow-lg mt-4 ${
                  isScouting
                    ? "bg-amber-800/50 text-amber-200 cursor-wait"
                    : scoutComplete
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                    : "bg-amber-600 hover:bg-amber-500 text-black"
                }`}
              >
                {isScouting
                  ? "Scouting in Progress..."
                  : scoutComplete
                  ? "✓ Scouting Complete — Results Below"
                  : "Start Scouting"}
              </button>
            </div>

            {/* Results Display Section */}
            {scoutComplete && results.length > 0 && (
              <div className="bg-[#14141b] rounded-xl border border-gray-800 p-6 space-y-4 shadow-xl animate-fadeIn">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Matched Locations for {locationQuery} ({results.length})
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    Asset Match: {selectedFile?.name || "Uploaded Reference"}
                  </span>
                </div>

                <div className="space-y-3">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#1a1a24] border border-gray-800 hover:border-amber-500/50 p-4 rounded-lg flex justify-between items-start transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-gray-100 text-base">{item.name}</h4>
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2 py-0.5 rounded font-mono">
                            {item.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{item.location}</p>
                        <div className="flex gap-2 flex-wrap pt-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-[#222230] text-gray-300 text-[10px] px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <p className="text-sm font-semibold text-amber-400">{item.dailyRate}</p>
                        <button className="bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-black border border-amber-600/50 text-xs font-semibold px-3 py-1.5 rounded transition">
                          Request Permit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="bg-[#14141b] rounded-xl border border-gray-800 p-8 text-center text-gray-400">
            <h3 className="text-xl font-bold text-white mb-2">Pipeline Architecture</h3>
            <p className="text-sm">Agentic workflow setup and diagram view.</p>
          </div>
        )}
      </div>
    </main>
  );
}
