"use client";

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
  addToast,
} from "@heroui/react";
import { ITopBarNavigationProps } from "./Navbar.types";
import LanguageToggle from "../LanguageToggle";
import { useTranslations } from "next-intl";
import { useInterceptor } from "@/contexts/InterceptorContext";
import { useRouter } from "next/navigation";

const NavbarItems: React.FC<ITopBarNavigationProps> = ({
  onlyLogout,
  settingsRoute,
  homeRoute,
  profileRoute,
}) => {
  const { run } = useInterceptor();

  const router = useRouter();

  const logout = async () => {
    try {
      const logoutResponse = await logoutApi();

      if (logoutResponse.status === 200) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      addToast({
        title: t("common.errors.settings"),
        description: t("common.errors.server"),
        color: "danger",
        timeout: 5000,
      });
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
              onPress={() => {
                run({
                  "navbar-routing": () => {
                    if (!homeRoute) router.push("/home");
                  },
                });
              }}
            >
              {t("common.menu.home")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              size="sm"
              color={profileRoute ? "primary" : "foreground"}
              onPress={() => {
                run({
                  "navbar-routing": () => {
                    if (!profileRoute) router.push("/profile");
                  },
                });
              }}
            >
              {t("common.menu.profile")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={settingsRoute ? "primary" : "foreground"}
              size="sm"
              onPress={() => {
                run({
                  "navbar-routing": () => {
                    if (!settingsRoute) router.push("/settings");
                  },
                });
              }}
            >
              {t("common.menu.settings")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={"danger"}
              size="sm"
              onPress={() => {
                run({
                  "navbar-routing": () => {
                    logout();
                  },
                });
              }}
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
  settingsRoute = false,
  homeRoute = false,
  profileRoute = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const t = useTranslations();

  const router = useRouter();

  const { run } = useInterceptor();

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
          <Link
            onPress={() => {
              run({
                "navbar-routing": () => {
                  router.push("/");
                },
              });
            }}
            className="cursor-pointer"
          >
            <p className="font-bold text-inherit">{t("app.name")}</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {!empty && (
        <>
          <NavbarContent className="hidden sm:flex gap-4" justify="end">
            <NavbarItems
              onlyLogout={onlyLogout}
              settingsRoute={settingsRoute}
              homeRoute={homeRoute}
              profileRoute={profileRoute}
            ></NavbarItems>
          </NavbarContent>

          <NavbarMenu className="overflow-hidden">
            <NavbarItems
              onlyLogout={onlyLogout}
              settingsRoute={settingsRoute}
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
