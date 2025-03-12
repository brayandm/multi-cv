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

        setCookie(cookie.name, cookie.value, {
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 60 * 60 * 24,
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
