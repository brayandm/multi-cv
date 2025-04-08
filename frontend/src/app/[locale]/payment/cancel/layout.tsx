"use client";

import { SpacerDefault } from "@/app/main.styles";

export default function PaymentCancelLayout({
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
