"use client";

import { userLocaleApi, userSetLocaleApi } from "@/lib/backendService";
import { setCookieClient } from "@/lib/setCookieClient";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

interface LocaleContextType {
  locale: string;
  updateLocale: (newLocale: string) => void;
  syncLocale: (newLocale: string) => void;
  getLanguage: () => Language;
}

export interface Language {
  locale: string;
  name: string;
}

export const languages = [
  { code: "en", label: "English", name: "English" },
  { code: "es", label: "Spanish", name: "Spanish" },
  { code: "hi", label: "Hindi", name: "Romanized Hindi" },
  { code: "ru", label: "Russian", name: "Russian" },
];

export const mapLocaleToLanguage = (locale: string) => {
  const language = languages.find((lang) => lang.code === locale)?.name;

  return language || "English";
};

export const getSystemLocale = () => {
  const systemLocale = navigator.language.split("-")[0];

  return systemLocale || "en";
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [locale, setLocale] = useState(
    (getCookie("locale") as string) || getSystemLocale()
  );

  const updateLocale = async (newLocale: string) => {
    let userLocaleResponse;

    try {
      userLocaleResponse = await userLocaleApi();
    } catch (error) {
      console.log("Error getting user locale", error);
    }

    if (userLocaleResponse?.data?.locale) {
      setLocale(userLocaleResponse.data.locale);
    } else {
      setLocale(newLocale);
    }
  };

  const syncLocale = useCallback((newLocale: string) => {
    const updateLocaleServer = async (newLocale: string) => {
      try {
        await userSetLocaleApi(newLocale);
      } catch (error) {
        console.log("Error setting user locale", error);
      }
    };

    updateLocaleServer(newLocale);
    setLocale(newLocale);

    const isIframe = window.self !== window.top;

    if (isIframe) {
      storeExtensionStorageValue("locale", newLocale, () => {});
    }
  }, []);

  const getLanguage = useCallback(() => {
    return {
      locale: locale,
      name: mapLocaleToLanguage(locale || "en"),
    };
  }, [locale]);

  useEffect(() => {
    setCookieClient("locale", locale);
    router.refresh();
  }, [locale, router]);

  return (
    <LocaleContext.Provider
      value={{ locale, updateLocale, syncLocale, getLanguage }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
