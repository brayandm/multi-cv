"use client";

import { userLocaleApi, userSetLocaleApi } from "@/lib/backendService";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
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
import { getCookie } from "cookies-next";

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

export type Language = "en" | "es" | "hi" | "ru";

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

export const getCookieLocale = () => {
  return getCookie("NEXT_LOCALE");
};

export const getPathLocale = (pathname: string) => {
  const segments = pathname.split("/");
  const localeFromPath = segments[1];

  if (!localeFromPath) {
    return routing.defaultLocale;
  }

  if (!routing.locales.includes(localeFromPath as Language)) {
    return routing.defaultLocale;
  }

  return localeFromPath;
};

export const getLocaleFromSources = (pathname: string) => {
  const cookieLocale = getCookieLocale();

  if (cookieLocale && routing.locales.includes(cookieLocale as Language)) {
    return cookieLocale as string;
  }

  const pathLocale = getPathLocale(pathname);

  if (pathLocale && routing.locales.includes(pathLocale as Language)) {
    return pathLocale;
  }

  const systemLocale = getSystemLocale();

  if (systemLocale && routing.locales.includes(systemLocale as Language)) {
    return systemLocale;
  }

  return routing.defaultLocale;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);

    setLocale(getLocaleFromSources(pathname));
  }, [pathname]);

  const updateRoute = async () => {
    const { locales } = routing;

    const segments = pathname.split("/");
    const currentLocaleFromPath = locales.includes(segments[1] as Language)
      ? segments[1]
      : null;

    if (currentLocaleFromPath === locale) {
      return;
    }

    const path = currentLocaleFromPath
      ? segments.slice(2).join("/")
      : segments.slice(1).join("/");

    const newPath = `/${locale}/${path}`;
    const query = searchParams.toString();

    await router.replace(query ? `${newPath}?${query}` : newPath);
    await router.refresh();
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
      updateRoute();
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
