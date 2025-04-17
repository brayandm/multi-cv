"use client";

import { useRefreshPage } from "@/hooks/useRefreshPage";
import { ReactNode } from "react";

import CookieBanner from "@/shared/components/CookieBanner";

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  useRefreshPage();

  return (
    <>
      {children}
      <CookieBanner />
    </>
  );
};
