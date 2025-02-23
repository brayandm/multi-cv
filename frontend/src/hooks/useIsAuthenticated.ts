import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyApi } from "@/lib/backendService";

export const useIsAuthenticated = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const checkAuthentication = () => {
    verifyApi()
      .then((res) => {
        setAuthenticated(res.data.authenticated);
        if (res.data.authenticated === false) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setAuthenticated(false);
      });
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (authenticated === true) {
      router.push("/home");
    }
  }, [router, authenticated]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuthentication();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return { authenticated, isLoading };
};
