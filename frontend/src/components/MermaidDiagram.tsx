"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "#1d1b20",
    primaryColor: "#c89b4a",
    primaryTextColor: "#16151a",
    primaryBorderColor: "#322d2c",
    lineColor: "#948e85",
  },
});

interface MermaidProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute("data-processed");
      mermaid.contentLoaded();
      mermaid.render("mermaid-svg-scout", chart).then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      });
    }
  }, [chart]);

  return <div ref={ref} className="flex justify-center p-6 overflow-x-auto" />;
}
