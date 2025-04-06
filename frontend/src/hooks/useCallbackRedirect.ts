import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CALLBACK_KEY = "callbackUrl";

export function useCallbackRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCallbackUrl =
    searchParams.get("callbackUrl") ||
    (typeof window !== "undefined"
      ? sessionStorage.getItem(CALLBACK_KEY)
      : null);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(
    initialCallbackUrl
  );

  useEffect(() => {
    const urlCallback = searchParams.get("callbackUrl");

    if (typeof urlCallback === "string") {
      sessionStorage.setItem(CALLBACK_KEY, urlCallback);
      setCallbackUrl(urlCallback);
    } else {
      const stored = sessionStorage.getItem(CALLBACK_KEY);
      setCallbackUrl(stored);
    }
  }, [searchParams]);

  const redirectToCallback = () => {
    const url = sessionStorage.getItem(CALLBACK_KEY);

    if (url) {
      sessionStorage.removeItem(CALLBACK_KEY);
      router.push(url);
    }
  };

  return {
    callbackUrl,
    redirectToCallback,
  };
}
