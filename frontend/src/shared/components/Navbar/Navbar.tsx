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
  onlyLogout,
  passwordRoute,
  homeRoute,
  profileRoute,
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
      {onlyLogout ? (
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
      ) : (
        <>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={homeRoute ? "primary" : "foreground"}
              size="sm"
              onPress={() => router.push("/home")}
            >
              {t("common.menu.home")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              size="sm"
              color={profileRoute ? "primary" : "foreground"}
              onPress={() => router.push("/profile")}
            >
              {t("common.menu.profile")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={passwordRoute ? "primary" : "foreground"}
              size="sm"
              onPress={() => router.push("/password")}
            >
              {t("common.menu.change_password")}
            </Link>
          </NavbarMenuItem>
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
        </>
      )}
    </>
  );
};

const Navbar: React.FC<ITopBarNavigationProps> = ({
  empty = false,
  onlyLogout = false,
  passwordRoute = false,
  homeRoute = false,
  profileRoute = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const router = useRouter();

  const t = useTranslations();

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
        {!empty && (
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

      {!empty && (
        <>
          <NavbarContent className="hidden sm:flex gap-4" justify="end">
            <NavbarItems
              onlyLogout={onlyLogout}
              passwordRoute={passwordRoute}
              homeRoute={homeRoute}
              profileRoute={profileRoute}
            ></NavbarItems>
          </NavbarContent>

          <NavbarMenu className="overflow-hidden">
            <NavbarItems
              onlyLogout={onlyLogout}
              passwordRoute={passwordRoute}
              homeRoute={homeRoute}
              profileRoute={profileRoute}
            ></NavbarItems>
          </NavbarMenu>
        </>
      )}
      <LanguageToggle />
    </NavbarUI>
  );
};

export default Navbar;
