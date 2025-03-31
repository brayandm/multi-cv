"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";
import { useEffect, useState } from "react";
import { Footer } from "@/components/WelcomeComponent/LandingPage";

export default function TermsAndConditionsLayout({
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
      {children}
      <Footer />
    </>
  );
}
