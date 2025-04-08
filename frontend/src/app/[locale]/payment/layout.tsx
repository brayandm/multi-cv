"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "@/app/main.styles";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarWrapper>
        <Navbar profileRoute />
      </NavbarWrapper>
      {children}
    </>
  );
}
