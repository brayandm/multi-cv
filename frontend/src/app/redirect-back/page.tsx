"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { syncCookies } from "@/lib/syncCookies";
import { AuthCookie } from "@/lib/types";

export default function RedirectBack() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const extension = searchParams.get("extension") === "true";

      const authCookieName = searchParams.get("name");
      const authCookieVBalue = searchParams.get("value");
      const authCookieExpirationDate = Number(
        searchParams.get("expiration_date")
      );

      if (authCookieName && authCookieVBalue && authCookieExpirationDate) {
        const auth_cookie: AuthCookie = {
          name: authCookieName,
          value: authCookieVBalue,
          expiration_date: authCookieExpirationDate,
        };

        syncCookies(auth_cookie, () => {
          if (extension) {
            window.close();
          } else {
            window.location.href = "/home";
          }
        });
      }
    }
  }, [searchParams]);
  return null;
}
