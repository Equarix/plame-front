"use client";

import React from "react";
import { useTheme } from "./context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      className="p-2.5 rounded-bento-control border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-850 focus:outline-none focus:ring-2 focus:ring-bento-secondary/30 transition-all duration-200 cursor-pointer flex items-center justify-center"
    >
      {theme === "light" ? (
        <FiMoon className="h-4.5 w-4.5" />
      ) : (
        <FiSun className="h-4.5 w-4.5 text-bento-primary" />
      )}
    </button>
  );
}
