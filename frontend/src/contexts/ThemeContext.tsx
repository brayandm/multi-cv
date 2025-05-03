"use client";

import { userThemeApi, userSetThemeApi } from "@/lib/backendService";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { getCookie } from "cookies-next";
import { setCookieClient } from "@/lib/setCookieClient";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: string;
  updateTheme: (newTheme: string) => void;
  syncTheme: (newTheme: string) => void;
}

export const getSystemTheme = (): Theme => {
  return "dark";
  // if (typeof window === "undefined") return "light";
  // return window.matchMedia("(prefers-color-scheme: dark)").matches
  //   ? "dark"
  //   : "light";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [theme, setTheme] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setTheme((getCookie("theme") as string) || getSystemTheme());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme, initialized]);

  const updateTheme = async (newTheme: string) => {
    let userThemeResponse;

    try {
      userThemeResponse = await userThemeApi();
    } catch (error) {
      console.log("Error getting user theme", error);
    }

    if (userThemeResponse?.data) {
      if (userThemeResponse.data.theme) {
        setTheme(userThemeResponse.data.theme);
      } else {
        setTheme(newTheme);
        try {
          userSetThemeApi(newTheme);
        } catch (error) {
          console.log("Error setting user theme", error);
        }
      }
    } else {
      setTheme(newTheme);
    }
  };

  const syncTheme = useCallback((newTheme: string) => {
    const updateThemeServer = async (newTheme: string) => {
      try {
        await userSetThemeApi(newTheme);
      } catch (error) {
        console.log("Error setting user theme", error);
      }
    };

    updateThemeServer(newTheme);
    setTheme(newTheme);

    const isIframe = window.self !== window.top;

    if (isIframe) {
      storeExtensionStorageValue("theme", newTheme, () => {});
    }
  }, []);

  useEffect(() => {
    if ((getCookie("theme") as string) !== theme && initialized) {
      setCookieClient("theme", theme).then(() => {
        router.refresh();
      });
    }
  }, [theme, initialized]); // eslint-disable-line

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, syncTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
