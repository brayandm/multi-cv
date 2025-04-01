"use client";

import WelcomeComponent from "@/components/WelcomeComponent";
import { NavbarWrapper } from "./main.styles";
import Navbar from "@/shared/components/Navbar";
import { useEffect, useState } from "react";

export default function Home() {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    setIsIframe(window.self !== window.top);
  }, []);

  return (
    <>
      <NavbarWrapper>
        {isIframe ? <Navbar empty /> : <Navbar withAuthMethods />}
      </NavbarWrapper>
      <WelcomeComponent />
    </>
  );
}
