"use client";

import WelcomeComponent from "@/components/WelcomeComponent";
import { NavbarWrapper } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";
import { useEffect, useState } from "react";
import { useUserStatus } from "@/contexts/UserStatusContext";

export default function Home() {
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
      <WelcomeComponent />
    </>
  );
}
