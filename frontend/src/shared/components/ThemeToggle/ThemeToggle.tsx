"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

export default function ThemeToggle() {
  const { theme, syncTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    syncTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="text-xl cursor-pointer text-gray-600 dark:text-gray-300 "
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <SunIcon className="w-5 h-5" />
      ) : (
        <MoonIcon className="w-5 h-5" />
      )}
    </button>
  );
}
