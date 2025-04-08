"use client";

import { SpacerDefault } from "@/app/main.styles";

export default function PaymentAlreadyPremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SpacerDefault />
      {children}
    </>
  );
}
