"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper, SpacerDefault } from "../../main.styles";
import { useEffect, useState } from "react";

export default function PasswordLayout({
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
        {isIframe ? <Navbar empty /> : <Navbar withAuthMethods />}
      </NavbarWrapper>
      <SpacerDefault />
      {children}
    </>
  );
}
