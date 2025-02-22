"use client";

import { fetcherApi } from "@/lib/backendService";
import { verifyApiLink } from "@/lib/links";
import { VerifyResponse } from "@/lib/types";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export default function WelcomeComponent() {
  const router = useRouter();

  const { data, isLoading } = useSWR<VerifyResponse>(verifyApiLink, fetcherApi);

  useEffect(() => {
    if (data?.authenticated) {
      router.push("/home");
    }
  }, [router, data]);

  return (
    <>
      {isLoading || data?.authenticated ? null : (
        <div className="flex flex-col mt-40 w-[250px] mx-auto">
          <h1 className="text-center">
            Welcome to <span className="text-primary">MultiCV</span>
          </h1>
          <p className="text-center">
            Create unique CVs for unique job offers.
          </p>
          <div className="flex justify-center gap-2 mt-2">
            <Button onPress={() => router.push("/login")} color="primary">
              Login
            </Button>
            <Button onPress={() => router.push("/register")} color="secondary">
              Register
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
