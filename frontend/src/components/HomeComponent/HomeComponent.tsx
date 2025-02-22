"use client";

import { logoutApi, verifyApi } from "@/lib/backendService";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeComponent() {
  const router = useRouter();

  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    verifyApi().then((res) => {
      setVerified(res.data.authenticated);
    });
  }, []);

  useEffect(() => {
    if (verified === false) {
      router.push("/");
    }
  }, [router, verified]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const logoutResponse = await logoutApi();

      if (logoutResponse.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (verified === null || verified === false) {
    return null;
  }

  return (
    <div className="flex flex-col w-[250px] mx-auto">
      <h1 className="text-center">Home</h1>
      <form onSubmit={handleSubmit}>
        <Button color="primary" type="submit">
          Logout
        </Button>
      </form>
    </div>
  );
}
