"use client";

import WelcomeComponent from "@/components/WelcomeComponent";
import { NavbarWrapper } from "@/app/main.styles";
import Navbar from "@/shared/components/Navbar";
import { useEffect, useState } from "react";
import { useUserStatus } from "@/contexts/UserStatusContext";

export default function Welcome() {
  const [isIframe, setIsIframe] = useState(false);
  const { userStatus, isLoading, refreshUserStatus } = useUserStatus();

  useEffect(() => {
    setIsIframe(window.self !== window.top);
    refreshUserStatus();
  }, []); // eslint-disable-line

  const getNavbarProps = () => {
    if (isLoading) {
      return { empty: true };
    }
    if (isIframe) {
      return { empty: true };
    }
    if (!userStatus.authenticated) {
      return { withAuthMethods: true };
    }
    return {};
  };

  return (
    <>
      <NavbarWrapper>
        <Navbar {...getNavbarProps()} />
      </NavbarWrapper>
      <WelcomeComponent />
    </>
  );
}
