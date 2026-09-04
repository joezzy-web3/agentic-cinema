"use client";

import React, { useState } from "react";
import VisualHero from "./components/VisualHero";

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
      ];
    }

    return [
      {
        id: "loc-1",
        name: `${location} Primary Soundstage A`,
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
    ];
  };

  const startScouting = (file: File | null) => {
    setIsScouting(true);
    setScoutComplete(false);

    const fileName = file ? file.name : "reference_asset.jpg";
    const currSymbol = currency === "JPY" ? "¥" : currency === "USD" ? "$" : "€";

    setTimeout(() => {
      setResults(generateDynamicResults(fileName, locationQuery, currSymbol));
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
    <main className="min-h-screen bg-[#0d0d11] text-gray-100 p-6 md:p-10 flex flex-col items-center space-y-10">
      <div className="w-full max-w-5xl space-y-10">
        
        {/* Top Header + Developer PFP Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-800 pb-6 gap-4">
          <div>
            <p className="text-amber-500 font-mono text-xs tracking-widest uppercase mb-1">
              EXT. WORLDWIDE — CONTINUOUS
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Agentic Cinema</h1>
          </div>

          {/* Developer PFP Badge */}
          <div className="flex items-center gap-3 bg-[#161622] border border-gray-800 px-4 py-2 rounded-full shadow-lg">
            <img
              src="/pfp.jpg"
              alt="Developer Profile"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://github.com/joezzy-web3.png";
              }}
              className="w-10 h-10 rounded-full border-2 border-amber-500 object-cover shadow-sm"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-gray-100 flex items-center gap-1.5">
                joezzy-web3
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[9px] px-1.5 py-0.2 rounded font-mono">
                  DEV
                </span>
              </p>
              <p className="text-[10px] text-gray-400 font-mono">Lead Engineer</p>
            </div>
          </div>
        </div>

        {/* PayPal Style Hero Visual Section */}
        <VisualHero />

        {/* Scout Engine Section */}
        <div className="bg-[#14141b] rounded-xl border border-gray-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-lg">
            <span>✦</span>
            <h2>Scout Parameters</h2>
          </div>

          <div className="space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Currency</label>
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
                <label className="block text-xs font-medium text-gray-400 mb-1">Daily permit budget</label>
                <input
                  type="number"
                  value={budgetQuery}
                  onChange={(e) => setBudgetQuery(e.target.value)}
                  className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-amber-500 outline-none text-right text-white font-medium"
                />
              </div>
            </div>

            {/* Reference File Dropzone */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Reference Image / Location Asset
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-[#1a1a23] hover:border-amber-500 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          </div>

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
            {isScouting ? "Scouting in Progress..." : scoutComplete ? "✓ Scouting Complete — Results Below" : "Start Scouting"}
          </button>
        </div>

        {/* Results Section */}
        {scoutComplete && results.length > 0 && (
          <div className="bg-[#14141b] rounded-xl border border-gray-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-bold text-white">
              ✓ Matched Visual Locations for {locationQuery} ({results.length})
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1a1a24] border border-gray-800 hover:border-amber-500/50 rounded-xl overflow-hidden flex flex-col md:flex-row transition"
                >
                  <div className="md:w-52 h-44 relative bg-gray-900 shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-100 text-lg">{item.name}</h4>
                          <p className="text-xs text-gray-400 mt-0.5">📍 {item.location}</p>
                        </div>
                        <span className="text-base font-bold text-amber-400">{item.dailyRate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-3 border-t border-gray-800">
                      <a
                        href={item.infoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-2 rounded-lg transition font-medium"
                      >
                        🌐 View Map & Info
                      </a>
                      <a
                        href={`mailto:${item.contactEmail}?subject=Permit Request: ${encodeURIComponent(item.name)}`}
                        className="text-xs bg-amber-600 hover:bg-amber-500 text-black font-bold px-3 py-2 rounded-lg transition"
                      >
                        ✉️ Request Permit
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
