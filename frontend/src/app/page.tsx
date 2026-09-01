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
  const [city, setCity] = useState("Abuja");
  const [budget, setBudget] = useState("200000");
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
          image_name: image ? image.name : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const data = await response.json();
      if (data.locations) {
        setLocations(data.locations);
      } else {
        throw new Error("Invalid response format received from AI.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Hero / Header */}
      <div className="relative border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">AI Scouting Engine Online</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 bg-gradient-to-r from-white via-neutral-200 to-indigo-400 bg-clip-text text-transparent">
              AGENTIC CINEMA
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Autonomous location scouting & production logistics intel</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Search Sidebar */}
        <div className="lg:col-span-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 shadow-xl backdrop-blur-md h-fit space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            Production Parameters
          </h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">City / Region</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="e.g. Abuja"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">Daily Budget Target (₦)</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="e.g. 200000"
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-400 mb-2">Mood / Reference Photo</label>
            <div className="relative border-2 border-dashed border-neutral-800 hover:border-neutral-700 transition rounded-xl p-4 text-center cursor-pointer bg-neutral-950">
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              <p className="text-xs text-neutral-400">{image ? image.name : "Click or drag moodboard reference"}</p>
            </div>
          </div>

          <button
            onClick={handleScout}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 text-white font-semibold py-4 rounded-xl transition duration-200 shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Scouting Locations...
              </>
            ) : (
              "Start AI Location Scout"
            )}
          </button>

          {error && <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300">{error}</div>}
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-6">
          {locations.length === 0 && !loading && (
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
              <div className="w-12 h-12 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-500 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              <h3 className="text-white font-medium text-base">No Locations Scouted Yet</h3>
              <p className="text-neutral-500 text-xs mt-1 max-w-sm">Enter a target city and daily permit budget on the left to deploy the AI scout engine.</p>
            </div>
          )}

          {locations.map((loc, idx) => (
            <div key={idx} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl transition hover:border-neutral-700">
              <div className="relative h-64 w-full bg-neutral-950">
                <img src={loc.image_url} alt={loc.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
                    {loc.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">{loc.name}</h3>
                  <span className="bg-emerald-950/90 text-emerald-400 border border-emerald-800 px-3 py-1 rounded-lg text-xs font-mono font-bold">
                    {loc.estimated_cost}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">Visual Aesthetic & Vibe</h4>
                  <p className="text-sm text-neutral-200 leading-relaxed">{loc.aesthetic}</p>
                </div>

                <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Production & Logistics Brief
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{loc.logistics}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
