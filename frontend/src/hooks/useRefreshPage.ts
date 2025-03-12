import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setAuthCookieApi } from "@/lib/backendService";

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

        await setAuthCookieApi(cookie.value);

        router.refresh();
      }
    };

    window.addEventListener("message", handleActionRefreshPage);

    return () => {
      window.removeEventListener("message", handleActionRefreshPage);
    };
  }, [router]);
};
