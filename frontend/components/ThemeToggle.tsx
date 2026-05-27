"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDark(true);
    } else {
      document.body.classList.remove("dark-mode");
      setDark(false);
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = !dark;
    setDark(nextTheme);

    if (nextTheme) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) return null;

  return (
    <button className="theme-btn" onClick={toggleTheme}>
      {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}