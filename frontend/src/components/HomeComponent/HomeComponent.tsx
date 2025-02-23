"use client";

import { useIsNotAuthenticated } from "@/hooks/useIsNotAuthenticated";
import { fetcherApi, logoutApi } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function HomeComponent() {
  const router = useRouter();

  const { authenticated, isLoading } = useIsNotAuthenticated();

  const { data: userData, isLoading: isUserDataLoading } = useSWR(
    authenticated ? userApiLink : null,
    fetcherApi
  );

  if (isLoading || isUserDataLoading) {
    return null;
  }

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

  return (
    <div className="flex flex-col w-[250px] mt-8 mx-auto">
      <h1 className="text-center">Home</h1>
      <p className="text-center">Welcome {userData?.name}</p>
      <form
        className="flex flex-col gap-2 text-center mt-8 w-[250px] mx-auto"
        onSubmit={handleSubmit}
      >
        <Button color="primary" type="submit">
          Logout
        </Button>
      </form>
    </div>
  );
}
