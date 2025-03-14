"use client";

import { userLocaleApi, userSetLocaleApi } from "@/lib/backendService";
import { setCookieClient } from "@/lib/setCookieClient";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface LocaleContextType {
  locale: string;
  updateLocale: (newLocale: string) => void;
  syncLocale: (newLocale: string) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    setLocale((getCookie("locale") as string) || "en");
  }, []);

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

  const updateLocaleServer = async (newLocale: string) => {
    try {
      await userSetLocaleApi(newLocale);
    } catch (error) {
      console.log("Error setting user locale", error);
    }
  };

  const syncLocale = (newLocale: string) => {
    updateLocaleServer(newLocale);
    setLocale(newLocale);
  };

  useEffect(() => {
    setCookieClient("locale", locale);
    router.refresh();
  }, [locale, router]);

  return (
    <LocaleContext.Provider value={{ locale, updateLocale, syncLocale }}>
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
