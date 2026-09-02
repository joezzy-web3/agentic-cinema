"use client";

import React, { useEffect, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
}

export default function MermaidDiagram({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && ref.current) {
      import("mermaid").then((mermaid) => {
        mermaid.default.initialize({
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
        mermaid.default.render("mermaid-svg-scout", chart).then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        });
      });
    }
  }, [chart, mounted]);

  if (!mounted) {
    return <div className="p-6 text-xs text-[#948e85]">Loading diagram…</div>;
  }

  return <div ref={ref} className="flex justify-center p-6 overflow-x-auto" />;
}
