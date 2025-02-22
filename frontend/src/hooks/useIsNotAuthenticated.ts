import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyApi } from "@/lib/backendService";

export const useIsNotAuthenticated = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    verifyApi()
      .then((res) => {
        setAuthenticated(res.data.authenticated);
        if (res.data.authenticated === true) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    if (authenticated === false) {
      router.push("/");
    }
  }, [router, authenticated]);

  return { isLoading };
};
