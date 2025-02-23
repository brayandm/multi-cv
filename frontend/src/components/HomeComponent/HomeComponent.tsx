"use client";

import { useIsNotAuthenticated } from "@/hooks/useIsNotAuthenticated";
import { useNotAcceptTerms } from "@/hooks/useNotAcceptTerms";
import { fetcherApi } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import useSWR from "swr";

export default function HomeComponent() {
  const { authenticated, isLoading } = useIsNotAuthenticated();

  const { isLoading: isAcceptTermsLoading } = useNotAcceptTerms();

  const { data: userData, isLoading: isUserDataLoading } = useSWR(
    authenticated ? userApiLink : null,
    fetcherApi
  );

  if (isLoading || isUserDataLoading || isAcceptTermsLoading) {
    return null;
  }

  return (
    <div className="flex flex-col w-[250px] mx-auto">
      <h1 className="text-center">Home</h1>
      <p className="text-center">Welcome {userData?.name}</p>
    </div>
  );
}
