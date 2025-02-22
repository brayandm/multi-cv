"use client";

import { verifyApi } from "@/lib/backendService";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WelcomeComponent() {
  const router = useRouter();

  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    verifyApi().then((res) => {
      setVerified(res.data.authenticated);
    });
  }, []);

  useEffect(() => {
    if (verified === true) {
      router.push("/home");
    }
  }, [router, verified]);

  if (verified === null || verified === true) {
    return null;
  }

  return (
    <div className="flex flex-col mt-40 w-[250px] mx-auto">
      <h1 className="text-center">
        Welcome to <span className="text-primary">MultiCV</span>
      </h1>
      <p className="text-center">Create unique CVs for unique job offers.</p>
      <div className="flex justify-center gap-2 mt-2">
        <Button onPress={() => router.push("/login")} color="primary">
          Login
        </Button>
        <Button onPress={() => router.push("/register")} color="secondary">
          Register
        </Button>
      </div>
    </div>
  );
}
