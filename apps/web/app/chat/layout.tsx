"use client";

import { Sidebar } from "@/components/sidebar/app-sidebar";

import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Responsive fallback for SSR: default to expanded
  const [sidebarWidth, setSidebarWidth] = useState("16rem");

  useEffect(() => {
    // Listen for sidebar width changes via CSS variable
    const observer = new MutationObserver(() => {
      const width = getComputedStyle(document.body).getPropertyValue("--sidebar-width");
      if (width) setSidebarWidth(width);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    // Initial read
    const width = getComputedStyle(document.body).getPropertyValue("--sidebar-width");
    if (width) setSidebarWidth(width);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Sidebar />
      <main
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </>
  );
}

