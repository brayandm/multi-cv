"use client";

import { fetcherApi, logoutApi } from "@/lib/backendService";
import { verifyApiLink } from "@/lib/links";
import { VerifyResponse } from "@/lib/types";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function HomeComponent() {
  const router = useRouter();

  const { data, isLoading } = useSWR<VerifyResponse>(verifyApiLink, fetcherApi);

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

  if (isLoading || !data?.authenticated) {
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
