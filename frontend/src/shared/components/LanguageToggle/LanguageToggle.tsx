"use client";

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
import { languages, useLocale } from "@/contexts/LocaleContext";

export default function LanguageToggle() {
  const { locale, syncLocale } = useLocale();

  const changeLanguage = (newLocale: string) => {
    syncLocale(newLocale);

    const isIframe = window.self !== window.top;

    if (isIframe) {
      storeExtensionStorageValue("locale", newLocale, () => {});
    }
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
