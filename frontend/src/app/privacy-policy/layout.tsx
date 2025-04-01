"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper, SpacerDefault } from "../main.styles";
import { useEffect, useState } from "react";
import { Footer } from "@/components/WelcomeComponent/LandingPage";

export default function PrivacyPolicyLayout({
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
        {isIframe ? (
          <Navbar empty />
        ) : (
          <Navbar withAuthMethods disableLanguageSelector />
        )}
      </NavbarWrapper>
      <SpacerDefault />
      {children}
      <Footer />
    </>
  );
}
