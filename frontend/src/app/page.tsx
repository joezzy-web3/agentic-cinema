"use client";

import React, { useState } from "react";
import { Big_Shoulders_Display, Inter, IBM_Plex_Mono } from "next/font/google";

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
    } fontally {
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
          "--panel-2": "#232025",
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
      <style jsx global>{`
        @keyframes reveal {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          animation: reveal 0.5s ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            animation: none;
          }
        }
        .field-underline {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border);
          border-radius: 0;
        }
        .field-underline:focus {
          outline: none;
          border-bottom-color: var(--brass);
        }
        *:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 2px;
        }
      `}</style>

      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
        <header className="mb-14 border-b pb-8" style={{ borderColor: "var(--border)" }}>
          <p
            className="mb-3 font-[family-name:var(--font-mono)] text-[11px] tracking-wide"
            style={{ color: "var(--brass)" }}
          >
            EXT. WORLDWIDE — CONTINUOUS
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-6xl font-black leading-[0.9] sm:text-7xl"
            style={{ color: "var(--text)" }}
          >
            Agentic Cinema
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            An AI location scout. Give it a place and a budget, it comes back
            with a shot list and a permit brief.
          </p>
        </header>

        <main className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div
              className="sticky top-8 space-y-6 rounded-sm border p-6"
              style={{ backgroundColor: "var(--panel)", borderColor: "var(--border)" }}
            >
              <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                Scout request
              </h2>

              <div>
                <label htmlFor="city" className="mb-1.5 block text-xs" style={{ color: "var(--text-muted)" }}>
                  City, region or country
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="field-underline w-full py-2 text-sm"
                  style={{ color: "var(--text)" }}
                  placeholder="London, Lagos, Tokyo…"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="currency" className="mb-1.5 block text-xs" style={{ color: "var(--text-muted)" }}>
                    Currency
                  </label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="field-underline w-full py-2 text-sm"
                    style={{ color: "var(--text)" }}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c} style={{ backgroundColor: "var(--panel)" }}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="budget" className="mb-1.5 block text-xs" style={{ color: "var(--text-muted)" }}>
                    Daily permit budget
                  </label>
                  <input
                    id="budget"
                    type="text"
                    inputMode="numeric"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="field-underline w-full py-2 text-right font-[family-name:var(--font-mono)] text-sm"
                    style={{ color: "var(--text)" }}
                    placeholder="2000"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="mood-photo"
                  className="inline-block cursor-pointer border-b border-dashed pb-0.5 text-xs"
                  style={{ borderColor: "var(--text-muted)", color: "var(--text-muted)" }}
                >
                  {image ? `Attached: ${image.name}` : "Attach a reference mood photo (optional)"}
                </label>
                <input
                  id="mood-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <button
                onClick={handleScout}
                disabled={loading}
                className="w-full rounded-sm py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: "var(--brass)", color: "var(--bg)" }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = "var(--brass-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--brass)";
                }}
              >
                {loading ? "Scouting…" : "Scout locations"}
              </button>

              {error && (
                <div
                  className="rounded-sm border px-3 py-2.5 text-xs leading-relaxed"
                  style={{ borderColor: "var(--brick)", color: "#e3a89f" }}
                >
                  Scout failed: {error}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            {locations.length === 0 && !loading && (
              <div
                className="flex min-h-[320px] flex-col items-center justify-center border border-dashed p-12 text-center"
                style={{ borderColor: "var(--border)" }}
              >
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No locations scouted yet.
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  Enter a city and run a scout — results appear here as a contact sheet.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {locations.map((loc, idx) => (
                <div key={idx} className="reveal" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="overflow-hidden" style={{ backgroundColor: "var(--panel)" }}>
                    <Sprocket />
                    <div className="relative aspect-[4/3] w-full" style={{ backgroundColor: "var(--bg)" }}>
                      <img src={loc.image_url} alt={loc.name} className="h-full w-full object-cover" />
                    </div>
                    <Sprocket />

                    <div className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold leading-tight">
                            {loc.name}
                          </h3>
                          <span
                            className="mt-1 inline-block border px-1.5 py-0.5 text-[11px]"
                            style={{ borderColor: "var(--brass)", color: "var(--brass)" }}
                          >
                            {loc.category}
                          </span>
                        </div>
                        <span
                          className="whitespace-nowrap font-[family-name:var(--font-mono)] text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {loc.estimated_cost}
                        </span>
                      </div>

                      <div>
                        <p className="mb-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Look
                        </p>
                        <p className="text-xs leading-relaxed">{loc.aesthetic}</p>
                      </div>

                      <div className="border-t pt-3" style={{ borderColor: "var(--border)" }}>
                        <p className="mb-1 text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Permits &amp; logistics
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                          {loc.logistics}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
