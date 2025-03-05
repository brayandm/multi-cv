"use client";

import { useRouter } from "next/navigation";
import { logoutApi } from "@/lib/backendService";

import React, { useEffect } from "react";
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

  const t = useTranslations();

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
            {t("common.menu.home")}
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
            {t("common.menu.change_password")}
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
            {t("common.menu.profile")}
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
            {t("common.auth.logout")}
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

  const t = useTranslations();

  const [noContent, setNoContent] = React.useState(true);

  useEffect(() => {
    if (!passwordLink && !logoutLink && !profileLink && !homeLink) {
      setNoContent(false);
    } else {
      setNoContent(true);
    }
  }, [passwordLink, logoutLink, profileLink, homeLink]);

  return (
    <NavbarUI
      onMenuOpenChange={setIsMenuOpen}
      className="overflow-hidden"
      maxWidth="full"
      classNames={{
        base: "shadow-md bg-default-50",
      }}
    >
      <NavbarContent>
        {noContent && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        )}
        <NavbarBrand>
          <Link onPress={() => router.push("/")} className="cursor-pointer">
            <p className="font-bold text-inherit">{t("app.name")}</p>
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
