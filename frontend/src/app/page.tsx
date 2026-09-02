"use client";

import React, { useState } from "react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"scout" | "pipeline">("scout");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
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
                  defaultValue="Tokyo"
                  className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-amber-500 outline-none text-white font-medium"
                />
              </div>

              {/* Currency & Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Currency
                  </label>
                  <select className="w-full bg-transparent border-b border-gray-700 py-2 focus:border-amber-500 outline-none text-white font-medium">
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
                    defaultValue="200000"
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
                      className="w-8 h-8 mb-2 text-amber-500"
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
                      {selectedFile ? (
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
            <button className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-3.5 rounded-lg transition shadow-lg mt-4">
              Scouting...
            </button>
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
