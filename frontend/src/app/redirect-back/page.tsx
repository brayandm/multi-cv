"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { AuthCookie } from "@/lib/types";
import { setCookieClient } from "@/lib/setCookieClient";
import { useCallbackRedirect } from "@/hooks/useCallbackRedirect";

export default function RedirectBack() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { callbackUrl, redirectToCallback } = useCallbackRedirect();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const extension = searchParams.get("extension") === "true";

      const authCookieName = decodeURIComponent(searchParams.get("name") || "");
      const authCookieValue = decodeURIComponent(
        searchParams.get("value") || ""
      );
      const authCookieExpirationDate = Number(
        decodeURIComponent(searchParams.get("expiration_date") || "")
      );

      if (!authCookieName || !authCookieValue || !authCookieExpirationDate) {
        router.push("/");
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
        ).then(() => {
          if (callbackUrl) {
            redirectToCallback();
          } else {
            router.push("/home");
          }
        });
      }
    }
  }, []); // eslint-disable-line
  return null;
}
