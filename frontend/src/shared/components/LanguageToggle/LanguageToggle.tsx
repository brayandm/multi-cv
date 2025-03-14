"use client";

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
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { setCookieClient } from "@/lib/setCookieClient";
import { useLocale } from "@/contexts/LocaleContext";

const languages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "hi", label: "Hindi" },
  { code: "ru", label: "Russian" },
];

export default function LanguageToggle() {
  const router = useRouter();
  const { locale, updateLocale } = useLocale();

  const changeLanguage = (newLocale: string) => {
    setCookieClient("locale", newLocale);

    updateLocale(newLocale);

    const isIframe = window.self !== window.top;

    if (isIframe) {
      storeExtensionStorageValue("locale", newLocale, () => {});
    }

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
              onPress={() => changeLanguage(lang.code)}
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
