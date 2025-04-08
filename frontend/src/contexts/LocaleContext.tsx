"use client";

import { userLocaleApi, userSetLocaleApi } from "@/lib/backendService";
import { setCookieClient } from "@/lib/setCookieClient";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { getCookie } from "cookies-next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { routing } from "@/i18n/routing";

interface LocaleContextType {
  locale: string;
  updateLocale: (newLocale: string) => void;
  syncLocale: (newLocale: string) => void;
  getTraduction: () => Traduction;
}

export interface Traduction {
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
  if (typeof navigator === "undefined") {
    return "en";
  }

  const systemLocale = navigator.language.split("-")[0];

  return systemLocale || "en";
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setLocale((getCookie("locale") as string) || getSystemLocale());
    setInitialized(true);
  }, []);

  const updateRoute = () => {
    const { locales } = routing;

    const segments = pathname.split("/");
    const hasLocale = locales.includes(
      segments[1] as "en" | "es" | "hi" | "ru"
    );
    const path = hasLocale
      ? segments.slice(2).join("/")
      : segments.slice(1).join("/");

    const newPath = `/${locale}/${path}`;

    const query = searchParams.toString();
    router.replace(query ? `${newPath}?${query}` : newPath);
    router.refresh();
  };

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

    updateRoute();
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

  const getTraduction = useCallback(() => {
    return {
      locale: locale,
      name: mapLocaleToLanguage(locale || "en"),
    };
  }, [locale]);

  useEffect(() => {
    if (initialized && locale) {
      setCookieClient("locale", locale).then(() => {
        updateRoute();
      });
    }
  }, [locale, initialized]); // eslint-disable-line

  return (
    <LocaleContext.Provider
      value={{ locale, updateLocale, syncLocale, getTraduction }}
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
