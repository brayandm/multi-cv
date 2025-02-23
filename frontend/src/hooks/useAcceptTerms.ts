import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userApi } from "@/lib/backendService";

export const useAcceptTerms = () => {
  const [acceptTerms, setAcceptTerms] = useState<boolean | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    userApi()
      .then((res) => {
        setAcceptTerms(res.data.is_valid_terms_version);
        if (
          res.data.is_valid_terms_version === false ||
          res.data.is_valid_terms_version === null
        ) {
          setIsLoading(false);
        }
      })
      .catch(() => {
        setAcceptTerms(false);
      });
  }, []);

  useEffect(() => {
    if (acceptTerms === true) {
      router.push("/home");
    }
  }, [router, acceptTerms]);

  return { acceptTerms, isLoading };
};
