"use client";

import React, { useState } from "react";

interface LocationItem {
  name: string;
  category: string;
  aesthetic: string;
  estimated_cost: string;
  logistics: string;
  image_url: string;
}

export default function Home() {
  const [city, setCity] = useState("Tokyo");
  const [budget, setBudget] = useState("200000");
  const [currency, setCurrency] = useState("JPY");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleScout = async () => {
    setLoading(true);
    setError(null);
    setLocations([]);

    try {
      const response = await fetch("https://agentic-cinema.onrender.com/scout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: city,
          budget: budget,
          currency: currency,
          image_name: image ? image.name : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.locations && Array.isArray(data.locations)) {
        setLocations(data.locations);
      } else {
        throw new Error("No valid location data received.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch location scout analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 font-sans">
      <header className="max-w-5xl mx-auto mb-8 text-center sm:text-left border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">Global AI Scout Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            AGENTIC CINEMA
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Worldwide Film Location Scouting & Logistics Intelligence
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 h-fit space-y-5 shadow-xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Scout Parameters</h2>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">City, Region or Country</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. London, Paris, Tokyo, Lagos"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="NGN">NGN (₦)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="AED">AED (AED)</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Daily Permit Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. 2000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium">Reference Mood Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white cursor-pointer"
            />
            {image && <p className="text-[11px] text-indigo-400 mt-1">Attached: {image.name}</p>}
          </div>

          <button
            onClick={handleScout}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition duration-200 text-sm shadow-lg shadow-indigo-600/20"
          >
            {loading ? "Scouting Worldwide..." : "Start AI Location Scout"}
          </button>

          {error && <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">{error}</div>}
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-6">
          {locations.length === 0 && !loading && (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-12 text-center text-slate-500 min-h-[300px] flex flex-col items-center justify-center">
              <p className="text-sm">Ready to scout global production locations.</p>
              <p className="text-xs text-slate-600 mt-1">Try entering "Paris", "New York", or "Cape Town" with your target currency.</p>
            </div>
          )}

          {locations.map((loc, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl transition hover:border-slate-700">
              <div className="relative h-56 w-full bg-slate-950">
                <img src={loc.image_url} alt={loc.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-950/80 backdrop-blur-md border border-slate-700 text-indigo-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {loc.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{loc.name}</h3>
                  <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-800 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                    {loc.estimated_cost}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Visual Aesthetic</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{loc.aesthetic}</p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
                  <h4 className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider mb-1">Logistics & Permits Brief</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{loc.logistics}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
