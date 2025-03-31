"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";
import { useEffect, useState } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);
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
