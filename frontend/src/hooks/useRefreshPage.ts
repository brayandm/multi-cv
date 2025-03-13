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

    window.addEventListener("message", handleActionRefreshPage);

    return () => {
      window.removeEventListener("message", handleActionRefreshPage);
    };
  }, [router]);
};
