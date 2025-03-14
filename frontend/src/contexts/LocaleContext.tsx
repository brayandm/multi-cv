"use client";

import { setCookieClient } from "@/lib/setCookieClient";
import { getCookie } from "cookies-next";
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
  const [locale, setLocale] = useState((getCookie("locale") as string) || "en");

  const updateLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  const syncLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  useEffect(() => {
    setCookieClient("locale", locale);
  }, [locale]);

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
