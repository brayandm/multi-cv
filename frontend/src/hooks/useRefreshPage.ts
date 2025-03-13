"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export const useRefreshPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleActionRefreshPage = async (event: MessageEvent) => {
      if (event.data.action === "responseExtensionStorage") {
        const content = event.data.content as {
          locale?: string;
          auth_cookie?: {
            name: string;
            value: string;
            expiration_date: number;
          };
        };

        const cookie = content.auth_cookie;
        const locale = content.locale;

        if (locale) {
          setCookie("locale", locale, {
            secure: true,
            sameSite: "none",
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
            path: "/",
            partitioned: true,
          });
        }

        if (cookie) {
          const maxAge = Math.floor(
            (cookie.expiration_date * 1000 - Date.now()) / 1000
          );

          setCookie(cookie.name, cookie.value, {
            secure: true,
            sameSite: "none",
            domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
            path: "/",
            maxAge: maxAge,
            partitioned: true,
          });
        }

        router.refresh();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    const isIframe = window.self !== window.top;

    if (isIframe) {
      window.addEventListener("message", handleActionRefreshPage);

      window.postMessage({ action: "applicationStarted" });

      console.log("Application started");
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
  }, [router]);
};
