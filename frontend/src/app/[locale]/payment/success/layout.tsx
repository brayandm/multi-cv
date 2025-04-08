"use client";

import { SpacerDefault } from "@/app/main.styles";

export default function PaymentSuccessLayout({
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
