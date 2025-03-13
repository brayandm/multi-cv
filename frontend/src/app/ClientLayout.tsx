"use client";

import { useRefreshPage } from "@/hooks/useRefreshPage";
import { ReactNode } from "react";

export const ClientLayout = ({ children }: { children: ReactNode }) => {
  useRefreshPage();

  return <>{children}</>;
};
