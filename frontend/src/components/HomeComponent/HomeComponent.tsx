"use client";

import { logoutApi } from "@/lib/backendService";
import { Button } from "@heroui/react";
import { useRouter } from "next/router";

export default function HomeComponent() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const logoutResponse = await logoutApi();

      if (logoutResponse.status === 200) {
        router.push("/welcome");
      }
    } catch (error) {
      console.log(error);
    }
  };

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
