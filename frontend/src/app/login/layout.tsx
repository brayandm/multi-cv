"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isIframe = window.self !== window.top;
  return (
    <>
      <NavbarWrapper>
        <NavbarWrapper>
          {isIframe ? <Navbar empty /> : <Navbar withAuthMethods />}
        </NavbarWrapper>
      </NavbarWrapper>
      {children}
    </>
  );
}
