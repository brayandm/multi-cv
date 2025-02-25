"use client";

import { useNotAcceptTerms } from "@/hooks/useNotAcceptTerms";
import { fetcherApi } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import useSWR from "swr";
import TopBarNavigationComponent from "../TopBarNavigationComponent";

export default function HomeComponent() {
  const { isLoading: isAcceptTermsLoading } = useNotAcceptTerms();

  const { data: userData, isLoading: isUserDataLoading } = useSWR(
    userApiLink,
    fetcherApi
  );

  if (isUserDataLoading || isAcceptTermsLoading) {
    return null;
  }

  return (
    <>
      <TopBarNavigationComponent passwordLink logoutLink />{" "}
      <div className="flex flex-col w-[250px] mx-auto">
        <h1 className="text-center">Home</h1>
        <p className="text-center">Welcome {userData?.name}</p>
      </div>
    </>
  );
}
