"use client";

import { Tldraw } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";

export default function CinemaCanvas() {
  return (
    <div className="h-[550px] w-full border border-[#322d2c] rounded-sm overflow-hidden">
      <Tldraw persistenceKey="agentic-cinema-storyboard" />
    </div>
  );
}
