import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useRefreshPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleActionRefreshPage = (event: MessageEvent) => {
      if (event.data.action === "refreshPage") {
        router.refresh();
      }
    };

    window.addEventListener("message", handleActionRefreshPage);

    return () => {
      window.removeEventListener("message", handleActionRefreshPage);
    };
  }, [router]);
};
