"use client";

import React, { useState } from "react";

interface ScoutResult {
  id: string;
  name: string;
  location: string;
  matchScore: number;
  dailyRate: string;
  imageUrl: string;
  infoUrl: string;
  contactEmail: string;
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
    const encodedLoc = encodeURIComponent(location);

    if (nameLower.includes("water") || nameLower.includes("pool") || nameLower.includes("beach") || nameLower.includes("aqua")) {
      return [
        {
          id: "loc-1",
          name: `${location} Aquatic Studio & Resort`,
          location: `Coastal Zone, ${location}`,
          matchScore: 98,
          dailyRate: `${currencySymbol} 180,000 / day`,
          imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
          infoUrl: `https://www.google.com/maps/search/?api=1&query=${encodedLoc}+water+park+filming+location`,
          contactEmail: "permits@aquatic-studios.com",
          tags: ["Water Facilities", "High Capacity", "Underwater Rigs", "Permit Fast-Track"],
        },
        {
          id: "loc-2",
          name: `${location} Oceanfront Bay Complex`,
          location: `Bay District, ${location}`,
          matchScore: 92,
          dailyRate: `${currencySymbol} 195,000 / day`,
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
          infoUrl: `https://www.google.com/search?q=${encodedLoc}+oceanfront+film+location+permit`,
          contactEmail: "film-commission@baydistrict.gov",
          tags: ["Natural Horizon", "Controlled Waves", "Crew Staging"],
        },
        {
          id: "loc-3",
          name: `${location} Indoor Aquatic Stage`,
          location: `Studio District, ${location}`,
          matchScore: 87,
          dailyRate: `${currencySymbol} 150,000 / day`,
          imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=600&q=80",
          infoUrl: `https://www.google.com/search?q=${encodedLoc}+indoor+water+stage+production`,
          contactEmail: "booking@aquaticstage.io",
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
          imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&q=80",
          infoUrl: `https://www.google.com/maps/search/?api=1&query=${encodedLoc}+neon+downtown+district`,
          contactEmail: "permits@tokyofilminitiative.jp",
          tags: ["Cyberpunk Vibe", "Practical Neon", "Night Filming Permit"],
        },
        {
          id: "loc-2",
          name: `${location} Rooftop & Skyline Platform`,
          location: `Commercial District, ${location}`,
          matchScore: 94,
          dailyRate: `${currencySymbol} 210,000 / day`,
          imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
          infoUrl: `https://www.google.com/search?q=${encodedLoc}+rooftop+film+location`,
          contactEmail: "events@skyline-studios.com",
          tags: ["360 Degree View", "High Elevation", "Helipad Access"],
        },
      ];
    }

    // Default Fallback — Architectural / Urban / Studio setup
    return [
      {
        id: "loc-1",
        name: `${location} Primary Production Soundstage A`,
        location: `Central Film District, ${location}`,
        matchScore: 96,
        dailyRate: `${currencySymbol} 175,000 / day`,
        imageUrl: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=600&q=80",
        infoUrl: `https://www.google.com/maps/search/?api=1&query=${encodedLoc}+film+soundstage`,
        contactEmail: "info@soundstage-one.com",
        tags: ["Controlled Lighting", "Modular Sets", "Full Grip & Electric"],
      },
      {
        id: "loc-2",
        name: `${location} Metropolitan Exterior Lot B`,
        location: `Outskirts District, ${location}`,
        matchScore: 91,
        dailyRate: `${currencySymbol} 140,000 / day`,
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        infoUrl: `https://www.google.com/search?q=${encodedLoc}+exterior+film+lot+permits`,
        contactEmail: "permits@cityfilmcommission.org",
        tags: ["Generous Parking", "DIT Support", "Large Vehicle Access"],
      },
      {
        id: "loc-3",
        name: `${location} Heritage & Culture Grounds`,
        location: `Old Town Sector, ${location}`,
        matchScore: 85,
        dailyRate: `${currencySymbol} 190,000 / day`,
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        infoUrl: `https://www.google.com/maps/search/?api=1&query=${encodedLoc}+heritage+location`,
        contactEmail: "heritage-permits@culture-dept.gov",
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

            {/* Visual Results Display Section */}
            {scoutComplete && results.length > 0 && (
              <div className="bg-[#14141b] rounded-xl border border-gray-800 p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Matched Visual Locations for {locationQuery} ({results.length})
                  </h3>
                  <span className="text-xs font-mono text-gray-400">
                    Asset Match: {selectedFile?.name || "Uploaded Reference"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#1a1a24] border border-gray-800 hover:border-amber-500/50 rounded-xl overflow-hidden flex flex-col md:flex-row transition"
                    >
                      {/* Location Preview Image */}
                      <div className="md:w-56 h-40 md:h-auto relative bg-gray-900 shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-emerald-500/90 text-black font-bold text-xs px-2 py-0.5 rounded shadow">
                          {item.matchScore}% Match
                        </span>
                      </div>

                      {/* Content & Action Section */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-100 text-lg">{item.name}</h4>
                              <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                                📍 {item.location}
                              </p>
                            </div>
                            <span className="text-base font-bold text-amber-400">{item.dailyRate}</span>
                          </div>

                          {/* Tags */}
                          <div className="flex gap-2 flex-wrap mt-3">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="bg-[#222230] text-gray-300 text-[10px] px-2.5 py-1 rounded-md border border-gray-700/50"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Interactive Client Action Buttons */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-800/80">
                          <a
                            href={item.infoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium"
                          >
                            🌐 View Map & Info
                          </a>
                          <a
                            href={`mailto:${item.contactEmail}?subject=Permit Request: ${encodeURIComponent(item.name)}`}
                            className="text-xs bg-amber-600 hover:bg-amber-500 text-black font-bold px-3 py-2 rounded-lg transition flex items-center gap-1"
                          >
                            ✉️ Contact / Permit Request
                          </a>
                        </div>
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
