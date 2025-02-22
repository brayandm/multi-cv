"use client";

import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function WelcomeComponent() {
  const router = useRouter();

  const { isLoading } = useIsAuthenticated();

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col mt-40 w-[280px] mx-auto">
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
