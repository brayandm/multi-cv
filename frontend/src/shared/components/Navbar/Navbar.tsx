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
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "../ThemeToggle";
import { useUserStatus } from "@/contexts/UserStatusContext";

const NavbarItems: React.FC<ITopBarNavigationProps> = ({
  onlyLogout,
  deleteAccount,
  settingsRoute,
  homeRoute,
  profileRoute,
  withAuthMethods,
}) => {
  const { run } = useInterceptor();

  const router = useRouter();

  const pathname = usePathname();

  const { refreshUserStatus } = useUserStatus();

  const logout = async () => {
    try {
      const logoutResponse = await logoutApi();

      await refreshUserStatus();

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
      {withAuthMethods ? (
        <>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={pathname == "/login" ? "primary" : "foreground"}
              size="sm"
              onPress={() => {
                if (pathname != "/login")
                  run({
                    "navbar-routing": () => {
                      router.push("/login");
                    },
                  });
              }}
            >
              {t("common.auth.login")}
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={pathname == "/register" ? "primary" : "foreground"}
              size="sm"
              onPress={() => {
                if (pathname != "/register")
                  run({
                    "navbar-routing": () => {
                      router.push("/register");
                    },
                  });
              }}
            >
              {t("common.auth.register")}
            </Link>
          </NavbarMenuItem>
        </>
      ) : onlyLogout ? (
        <>
          {deleteAccount && (
            <NavbarMenuItem>
              <Link
                className="w-full cursor-pointer"
                color={"danger"}
                size="sm"
                onPress={() => {
                  run({
                    "navbar-routing": () => {
                      router.push("/account/deletion");
                    },
                  });
                }}
              >
                {t("pages.settings.delete_account")}
              </Link>
            </NavbarMenuItem>
          )}
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
      ) : (
        <>
          <NavbarMenuItem>
            <Link
              className="w-full cursor-pointer"
              color={homeRoute ? "primary" : "foreground"}
              size="sm"
              onPress={() => {
                const newPath = "/home";
                if (!homeRoute || pathname != newPath)
                  run({
                    "navbar-routing": () => {
                      router.push(newPath);
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
                const newPath = "/profile";
                if (!profileRoute || pathname != newPath)
                  run({
                    "navbar-routing": () => {
                      router.push(newPath);
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
                const newPath = "/settings";
                if (!settingsRoute || pathname != newPath)
                  run({
                    "navbar-routing": () => {
                      router.push(newPath);
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
  deleteAccount = false,
  settingsRoute = false,
  homeRoute = false,
  profileRoute = false,
  withAuthMethods = false,
  disableLanguageSelector = false,
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
                  const isIframe = window.self !== window.top;

                  if (isIframe) {
                    router.push("/home");
                  } else {
                    router.push("/");
                  }
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
              deleteAccount={deleteAccount}
              settingsRoute={settingsRoute}
              homeRoute={homeRoute}
              profileRoute={profileRoute}
              withAuthMethods={withAuthMethods}
            ></NavbarItems>
          </NavbarContent>

          <NavbarMenu className="overflow-hidden">
            <NavbarItems
              onlyLogout={onlyLogout}
              deleteAccount={deleteAccount}
              settingsRoute={settingsRoute}
              homeRoute={homeRoute}
              profileRoute={profileRoute}
              withAuthMethods={withAuthMethods}
            ></NavbarItems>
          </NavbarMenu>
        </>
      )}
      <ThemeToggle />
      {!disableLanguageSelector && <LanguageToggle />}
    </NavbarUI>
  );
};

export default Navbar;
