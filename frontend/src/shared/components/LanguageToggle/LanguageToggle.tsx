"use client";

import { useState, useEffect } from "react";
import { setCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Link } from "@heroui/react";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "hi", label: "Hindi" },
  { code: "ru", label: "Russian" },
];

export default function LanguageToggle() {
  const router = useRouter();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const savedLocale = (getCookie("locale") as string) || "en";
    setLocale(savedLocale);
  }, []);

  const changeLanguage = (newLocale: string) => {
    setCookie("locale", newLocale, {
      secure: true,
      sameSite: "none",
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      path: "/",
      partitioned: true,
    });

    setLocale(newLocale);
    router.refresh();
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Link className="cursor-pointer flex gap-1">
          <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />

          <span className="text-gray-700 dark:text-gray-200">
            {languages.find((lang) => lang.code === locale)?.code.toUpperCase()}
          </span>
        </Link>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownSection>
          {languages.map((lang) => (
            <DropdownItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`cursor-pointer ${
                locale === lang.code ? "font-bold" : ""
              }`}
            >
              {lang.label}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
