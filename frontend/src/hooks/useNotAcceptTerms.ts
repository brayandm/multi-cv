import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/backendService";

export const useNotAcceptTerms = () => {
  const [acceptTerms, setAcceptTerms] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    userApi()
      .then((res) => {
        setAcceptTerms(res.data.is_valid_terms_version);
        if (res.data.is_valid_terms_version === true) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setAcceptTerms(false);
      });
  }, []);

  useEffect(() => {
    if (acceptTerms === false) {
      router.push("/accept-terms");
    }
  }, [router, acceptTerms]);

  return { acceptTerms, isLoading };
};
