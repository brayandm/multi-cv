"use client";

import { useState, useEffect } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

export default function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const savedLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("locale="))
      ?.split("=")[1];

    if (savedLocale) setLocale(savedLocale);
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "es" : "en";
    setCookie("locale", newLocale, { path: "/" });
    setLocale(newLocale);
    router.refresh();
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      <span className="text-gray-700 dark:text-gray-200">
        {locale === "en" ? "Español" : "English"}
      </span>
    </button>
  );
}
