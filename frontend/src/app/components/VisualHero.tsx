"use client";

import React, { useState } from "react";

interface VisualItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  actionText: string;
  overlayTitle: string;
  overlaySubtitle: string;
  overlayPrice: string;
  imageUrl: string;
}

const visualItems: VisualItem[] = [
  {
    id: "scout-1",
    badge: "CINEMATIC SCOUT",
    title: "Global Location Intelligence",
    description: "Match reference imagery with world-class soundstages, architectural complexes, and iconic exterior lots in seconds.",
    actionText: "Explore Soundstages",
    overlayTitle: "Tokyo Cyber Alleyway",
    overlaySubtitle: "99% Match • Practical Neon Set",
    overlayPrice: "¥160,000 / day",
    imageUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "scout-2",
    badge: "AQUATIC STAGES",
    title: "Water & Oceanfront Facilities",
    description: "Discover production-ready water tanks, coastal resorts, and deep-water filming basins equipped with camera rigs.",
    actionText: "View Water Sets",
    overlayTitle: "Okinawa Aquatic Complex",
    overlaySubtitle: "98% Match • Heated Underwater Tank",
    overlayPrice: "¥180,000 / day",
    imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function VisualHero() {
  const [activeVisual, setActiveVisual] = useState<VisualItem>(visualItems[0]);

  return (
    <div className="w-full max-w-5xl rounded-2xl overflow-hidden border border-gray-800 bg-[#121218] shadow-2xl grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column: Descriptive Hero Text */}
      <div className="p-8 lg:p-10 bg-[#0e0e13] flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <span className="text-amber-500 font-mono text-xs tracking-widest uppercase font-bold">
            {activeVisual.badge}
          </span>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {activeVisual.title}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            {activeVisual.description}
          </p>
          <button className="bg-amber-600 hover:bg-amber-500 text-black font-bold px-6 py-3 rounded-full transition shadow-lg text-sm">
            {activeVisual.actionText}
          </button>
        </div>

        {/* Multi-Visual Selector Thumbnails */}
        <div className="border-t border-gray-800/80 pt-4">
          <p className="text-[11px] font-semibold text-gray-400 mb-2.5 uppercase tracking-wider">
            Select Visual Preview
          </p>
          <div className="flex gap-3">
            {visualItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveVisual(item)}
                className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition ${
                  activeVisual.id === item.id
                    ? "border-amber-500 scale-105 shadow-md"
                    : "border-gray-800 opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Background Visual with Frosted Glass Overlay Card */}
      <div className="relative min-h-[380px] lg:min-h-[460px] w-full bg-gray-900 flex items-center justify-center p-6">
        <img
          src={activeVisual.imageUrl}
          alt={activeVisual.overlayTitle}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Glassmorphism Card */}
        <div className="relative z-10 w-full max-w-xs bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-2xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/40 text-amber-400 font-bold text-xl">
            🎬
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">
              {activeVisual.overlayTitle}
            </h3>
            <p className="text-xs text-gray-200 mt-1 font-medium">
              {activeVisual.overlaySubtitle}
            </p>
          </div>
          <p className="text-2xl font-black text-amber-400">
            {activeVisual.overlayPrice}
          </p>
          <button className="w-full bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-2 rounded-xl transition text-xs">
            Confirm Location Permit
          </button>
        </div>
      </div>
    </div>
  );
}
