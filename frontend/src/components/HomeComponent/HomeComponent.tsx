"use client";

import { fetcherApi } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import useSWR from "swr";
import Navbar from "../shared/components/Navbar";
import CvList from "./CvList";
import { CV } from "@/lib/types";

export default function HomeComponent() {
  const { data: userData, isLoading: isUserDataLoading } = useSWR(
    userApiLink,
    fetcherApi
  );
  if (isUserDataLoading) {
    return null;
  }
  console.log(userData);

  const cvs: CV[] = [
    {
      company: "Revolut",
      id: 1,
      pdf_file: "revolut_9139j.pdf",
      role: "Backend Senior Developer",
      time_to_expire: 1000,
    },
  ];
  return (
    <main className="">
      <Navbar passwordLink logoutLink />
      <div className="flex justify-center">
        <CvList cvs={cvs}></CvList>
      </div>
    </main>
  );
}
