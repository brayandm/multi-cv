"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookieClient } from "@/lib/setCookieClient";
import { getSystemLocale, useLocale } from "@/contexts/LocaleContext";
import { getSystemTheme, useTheme } from "@/contexts/ThemeContext";
import { getCookie } from "cookies-next";

export const useRefreshPage = () => {
  const router = useRouter();

  const { updateLocale } = useLocale();
  const { updateTheme } = useTheme();

  useEffect(() => {
    const handleActionRefreshPage = async (event: MessageEvent) => {
      if (event.data.action === "responseExtensionStorage") {
        const content = event.data.content as {
          locale?: string;
          theme?: string;
          auth_cookie?: {
            name: string;
            value: string;
            expiration_date: number;
          };
        };

        const cookie = content.auth_cookie;
        const locale = content.locale;
        const theme = content.theme;

        if (locale) {
          updateLocale(locale);
        }

        if (theme) {
          updateTheme(theme);
        }

        if (cookie) {
          setCookieClient(cookie.name, cookie.value, cookie.expiration_date);
        }
        router.refresh();
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        updateLocale((getCookie("locale") as string) || getSystemLocale());
        updateTheme((getCookie("theme") as string) || getSystemTheme());

        router.refresh();
      }
    };

    const isIframe = window.self !== window.top;

    if (isIframe) {
      window.addEventListener("message", handleActionRefreshPage);

      window.postMessage({ action: "applicationStarted" });
    } else {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      if (isIframe) {
        window.removeEventListener("message", handleActionRefreshPage);
      } else {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, [router, updateLocale, updateTheme]);
};
