"use client";

import { useRouter } from "next/navigation";
import { logoutApi } from "@/lib/backendService";

import React from "react";
import {
  Navbar as NavbarUI,
  NavbarBrand,
  NavbarContent,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@heroui/react";
import { ITopBarNavigationProps } from "./Navbar.types";
import LanguageToggle from "../LanguageToggle";
import { useTranslations } from "next-intl";

const NavbarItems: React.FC<ITopBarNavigationProps> = ({
  passwordLink,
  logoutLink,
  homeLink,
  profileLink,
}) => {
  const router = useRouter();

  const logout = async () => {
    try {
      const logoutResponse = await logoutApi();

      if (logoutResponse.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tCommon = useTranslations();

  return (
    <>
      {homeLink && (
        <NavbarMenuItem>
          <Link
            className="w-full cursor-pointer"
            color={"foreground"}
            size="sm"
            onPress={() => router.push("/home")}
          >
            {tCommon("home")}
          </Link>
        </NavbarMenuItem>
      )}
      {passwordLink && (
        <NavbarMenuItem>
          <Link
            className="w-full cursor-pointer"
            color={"foreground"}
            size="sm"
            onPress={() => router.push("/password")}
          >
            {tCommon("change-password")}
          </Link>
        </NavbarMenuItem>
      )}
      {profileLink && (
        <NavbarMenuItem>
          <Link
            className="w-full cursor-pointer"
            size="sm"
            color={"foreground"}
            onPress={() => router.push("/profile")}
          >
            {tCommon("profile")}
          </Link>
        </NavbarMenuItem>
      )}
      {logoutLink && (
        <NavbarMenuItem>
          <Link
            className="w-full cursor-pointer"
            color={"danger"}
            size="sm"
            onPress={() => logout()}
          >
            {tCommon("logout")}
          </Link>
        </NavbarMenuItem>
      )}
    </>
  );
};

const Navbar: React.FC<ITopBarNavigationProps> = ({
  passwordLink,
  logoutLink,
  profileLink,
  homeLink,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  const tCommon = useTranslations();

  return (
    <NavbarUI onMenuOpenChange={setIsMenuOpen} style={{ overflow: "hidden" }}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link onPress={() => router.push("/")} className="cursor-pointer">
            <p className="font-bold text-inherit">{tCommon("app-name")}</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItems
          passwordLink={passwordLink}
          logoutLink={logoutLink}
          homeLink={homeLink}
          profileLink={profileLink}
        ></NavbarItems>
      </NavbarContent>

      <NavbarMenu className="overflow-hidden">
        <NavbarItems
          passwordLink={passwordLink}
          logoutLink={logoutLink}
          homeLink={homeLink}
          profileLink={profileLink}
        ></NavbarItems>
      </NavbarMenu>
      <LanguageToggle />
    </NavbarUI>
  );
};

export default Navbar;
