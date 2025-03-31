"use client";

import WelcomeComponent from "@/components/WelcomeComponent";
import { NavbarWrapper } from "./main.styles";
import Navbar from "@/shared/components/Navbar";

export default function Home() {
  const isIframe = window.self !== window.top;
  return (
    <>
      <NavbarWrapper>
        {isIframe ? <Navbar empty /> : <Navbar withAuthMethods />}
      </NavbarWrapper>
      <WelcomeComponent />
    </>
  );
}
