"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");

    if(saved !== null) 
    {
        setCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const sidebarState = !collapsed;

    setCollapsed(sidebarState);
    localStorage.setItem("sidebarCollapsed", String(sidebarState));
  }

  return (
    <aside>
      <button onClick={toggleSidebar}>{collapsed ? "Expand" : "Collapse"}</button>

      {!collapsed && (
        <nav>
          <Link href="/">Home</Link>
          <Link href="/community">Community</Link>
        </nav>
      )}
    </aside>
  );
}