"use client";

import Navbar from "@/shared/components/Navbar";
import { NavbarWrapper } from "../main.styles";
import { useEffect, useState } from "react";
import { useUserStatus } from "@/contexts/UserStatusContext";
import { Footer } from "@/components/WelcomeComponent/LandingPage";

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isIframe, setIsIframe] = useState(false);

  const { userStatus, isLoading, refreshUserStatus } = useUserStatus();

  useEffect(() => {
    setIsIframe(window.self !== window.top);
    refreshUserStatus();
  }, []); // eslint-disable-line

  return (
    <>
      <NavbarWrapper>
        {!isLoading && (
          <>
            {isIframe ? (
              <Navbar empty />
            ) : userStatus.authenticated ? (
              <Navbar />
            ) : (
              <Navbar withAuthMethods />
            )}
          </>
        )}
      </NavbarWrapper>
      {children}
      <Footer />
    </>
  );
}
