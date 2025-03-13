"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { AuthCookie } from "@/lib/types";
import { setCookieClient } from "@/lib/setCookieClient";

export default function RedirectBack() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const extension = searchParams.get("extension") === "true";

      const authCookieName = searchParams.get("name");
      const authCookieValue = searchParams.get("value");
      const authCookieExpirationDate = Number(
        searchParams.get("expiration_date")
      );

      if (!authCookieName || !authCookieValue || !authCookieExpirationDate) {
        window.location.href = "/";
        return;
      }

      const auth_cookie: AuthCookie = {
        name: authCookieName,
        value: authCookieValue,
        expiration_date: authCookieExpirationDate,
      };

      if (extension) {
        storeExtensionStorageValue("auth_cookie", auth_cookie, () => {
          window.close();
        });
      } else {
        setCookieClient(
          auth_cookie.name,
          auth_cookie.value,
          auth_cookie.expiration_date
        );
        window.location.href = "/home";
      }
    }
  }, [searchParams]);
  return null;
}
