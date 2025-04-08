"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { setCookieClient } from "@/lib/setCookieClient";
import { getSystemLocale, Language, useLocale } from "@/contexts/LocaleContext";
import { getSystemTheme, useTheme } from "@/contexts/ThemeContext";
import { getCookie } from "cookies-next";
import { routing } from "@/i18n/routing";

export const useRefreshPage = () => {
  const router = useRouter();
  const pathname = usePathname();

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
          await updateLocale(locale);
        }

        if (theme) {
          await updateTheme(theme);
        }

        if (cookie) {
          await setCookieClient(
            cookie.name,
            cookie.value,
            cookie.expiration_date
          );
        }

        router.refresh();
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        const { locales } = routing;
        const segments = pathname.split("/");
        const localeFromPath = locales.includes(segments[1] as Language)
          ? segments[1]
          : getSystemLocale();

        await updateLocale(localeFromPath);
        await updateTheme((getCookie("theme") as string) || getSystemTheme());

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
  }, [router, updateLocale, updateTheme, pathname]);
};
