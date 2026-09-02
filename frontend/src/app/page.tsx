"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Big_Shoulders_Display, Inter, IBM_Plex_Mono } from "next/font/google";
import { Film, GitFork, Layout, Sparkles } from "lucide-react";
import MermaidDiagram from "@/components/MermaidDiagram";

const CinemaCanvas = dynamic(() => import("@/components/CinemaCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[550px] w-full items-center justify-center border border-[#322d2c] bg-[#1d1b20] text-xs text-[#948e85]">
      Loading Storyboard Canvas…
    </div>
  ),
});

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

interface LocationItem {
  name: string;
  category: string;
  aesthetic: string;
  estimated_cost: string;
  logistics: string;
  image_url: string;
}

const CURRENCIES = ["USD", "EUR", "GBP", "NGN", "CAD", "AUD", "JPY", "AED"];

const PIPELINE_DIAGRAM = `
  graph LR
    A[User Location Request] --> B[FastAPI Backend]
    B --> C[Gemini 3.6 Flash Engine]
    C --> D[Unsplash Image Resolution]
    D --> E[6-Tile Contact Sheet UI]
`;

function Sprocket() {
  return (
    <div
      className="h-3.5 w-full"
      style={{
        backgroundColor: "var(--panel)",
        backgroundImage:
          "radial-gradient(circle at 10px 7px, var(--bg) 3.4px, transparent 3.5px)",
        backgroundSize: "20px 14px",
        backgroundRepeat: "repeat-x",
      }}
    />
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scout" | "storyboard" | "architecture">("scout");
  const [city, setCity] = useState("Tokyo");
  const [budget, setBudget] = useState("200000");
  const [currency, setCurrency] = useState("JPY");
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleScout = async () => {
    setLoading(true);
    setError(null);
    setLocations([]);

    try {
      const response = await fetch("https://agentic-cinema.onrender.com/scout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: city,
          budget: budget,
          currency: currency,
        }),
      });

      if (!response.ok) throw new Error(`Server returned status: ${response.status}`);

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
    <div
      className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen font-[family-name:var(--font-body)]`}
      style={
        {
          "--bg": "#16151a",
          "--panel": "#1d1b20",
          "--border": "#322d2c",
          "--text": "#ede9e2",
          "--text-muted": "#948e85",
          "--brass": "#c89b4a",
          "--brass-hover": "#b78c3f",
          "--brick": "#b24a3e",
          backgroundColor: "var(--bg)",
          color: "var(--text)",
        } as React.CSSProperties
      }
    >
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
        <header className="mb-8 border-b pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ borderColor: "var(--border)" }}>
          <div>
            <p className="mb-2 font-[family-name:var(--font-mono)] text-[11px] tracking-wide" style={{ color: "var(--brass)" }}>
              EXT. WORLDWIDE — CONTINUOUS
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-black leading-none sm:text-6xl">
              Agentic Cinema
            </h1>
          </div>

          <div className="flex gap-2 bg-[#1d1b20] p-1 border border-[#322d2c] rounded-sm">
            <button
              onClick={() => setActiveTab("scout")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all ${
                activeTab === "scout" ? "bg-[#c89b4a] text-[#16151a]" : "text-[#948e85] hover:text-[#ede9e2]"
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Scout Engine
            </button>
            <button
              onClick={() => setActiveTab("storyboard")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all ${
                activeTab === "storyboard" ? "bg-[#c89b4a] text-[#16151a]" : "text-[#948e85] hover:text-[#ede9e2]"
              }`}
            >
              <Layout className="w-3.5 h-3.5" /> Canvas & Storyboard
            </button>
            <button
              onClick={() => setActiveTab("architecture")}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-sm transition-all ${
                activeTab === "architecture" ? "bg-[#c89b4a] text-[#16151a]" : "text-[#948e85] hover:text-[#ede9e2]"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" /> Pipeline Architecture
            </button>
          </div>
        </header>

        {activeTab === "scout" && (
          <main className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="sticky top-8 space-y-6 rounded-sm border p-6" style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}>
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#c89b4a]" /> Scout Parameters
                </h2>

                <div>
                  <label htmlFor="city" className="mb-1.5 block text-xs" style={{ color: "var(--text-muted)" }}>City, region or country</label>
                  <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-transparent border-b py-2 text-sm focus:outline-none focus:border-[#c89b4a]"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="currency" className="mb-1.5 block text-xs" style={{ color: "var(--text-muted)" }}>Currency</label>
                    <select
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-transparent border-b py-2 text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c} value={c} style={{ backgroundColor: "var(--panel)" }}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="budget" className="mb-1.5 block text-xs" style={{ color: "var(--text-muted)" }}>Daily permit budget</label>
                    <input
                      id="budget"
                      type="text"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-transparent border-b py-2 text-right font-[family-name:var(--font-mono)] text-sm focus:outline-none"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                </div>

                <button
                  onClick={handleScout}
                  disabled={loading}
                  className="w-full rounded-sm py-3 text-sm font-semibold transition-colors disabled:opacity-50"
                  style={{ backgroundColor: "var(--brass)", color: "var(--bg)" }}
                >
                  {loading ? "Scouting..." : "Start AI Location Scout"}
                </button>

                {error && <div className="rounded-sm border px-3 py-2 text-xs text-[#e3a89f] border-[#b24a3e]">Error: {error}</div>}
              </div>
            </div>

            <div className="lg:col-span-9">
              {locations.length === 0 && !loading && (
                <div className="flex min-h-[320px] flex-col items-center justify-center border border-dashed p-12 text-center" style={{ borderColor: "var(--border)" }}>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>No locations scouted yet.</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>Enter target city and click "Start AI Location Scout".</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {locations.map((loc, idx) => (
                  <div key={idx} className="overflow-hidden" style={{ backgroundColor: "var(--panel)" }}>
                    <Sprocket />
                    <div className="relative aspect-[4/3] w-full bg-[#16151a]">
                      <img src={loc.image_url} alt={loc.name} className="h-full w-full object-cover" />
                    </div>
                    <Sprocket />
                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">{loc.name}</h3>
                          <span className="mt-1 inline-block border px-1.5 py-0.5 text-[10px]" style={{ borderColor: "var(--brass)", color: "var(--brass)" }}>
                            {loc.category}
                          </span>
                        </div>
                        <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: "var(--text-muted)" }}>{loc.estimated_cost}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{loc.aesthetic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {activeTab === "storyboard" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#c89b4a]">Interactive Location Storyboard</h2>
              <p className="text-xs text-[#948e85]">Use the canvas below to sketch set layouts, place cameras, and annotate scouted spots.</p>
            </div>
            <CinemaCanvas />
          </section>
        )}

        {activeTab === "architecture" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#c89b4a]">AI Scouting Pipeline Architecture</h2>
              <p className="text-xs text-[#948e85]">Real-time workflow diagram powered by Mermaid.js</p>
            </div>
            <div className="rounded-sm border border-[#322d2c] bg-[#1d1b20] p-6">
              <MermaidDiagram chart={PIPELINE_DIAGRAM} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
