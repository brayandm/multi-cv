import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";

export const useRefreshPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleActionRefreshPage = async (event: MessageEvent) => {
      if (event.data.action === "responseAuthCookie") {
        const cookie = event.data.content as {
          name: string;
          value: string;
          expiration_date: number;
        };

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

        router.refresh();
      }
    };

    const isIframe = window.self !== window.top;

    if (isIframe) {
      window.addEventListener("message", handleActionRefreshPage);

      window.postMessage({ action: "applicationStarted" });

      console.log("Application started");
    }

    return () => {
      if (isIframe) {
        window.removeEventListener("message", handleActionRefreshPage);
      }
    };
  }, [router]);
};
