import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/backendService";
import { userStatusApiLink } from "@/lib/links";
import { UserStatusResponse } from "@/lib/types";
import { AxiosResponse } from "axios";
import { routePatternsToRegex } from "@/lib/matchers";
import { routing } from "@/i18n/routing"; // donde tienes locales y defaultLocale
import { Language } from "@/i18n/routing";
import { NextURL } from "next/dist/server/web/next-url";

const authPages = ["/login", "/register"];
const unProtectedPages = [
  "/",
  "/password/recovery",
  "/password/recovery/success",
  "/password/recovery/fail",
  "/password/recovery/new",
  "/email/verify/success",
  "/email/verify/already-verified",
  "/email/verify/expired",
];
const badEmailVerificationPages = ["/email/verify", "/email/verify/expired"];
const goodEmailVerificationPages = [
  "/email/verify/success",
  "/email/verify/already-verified",
];

export function createRedirectWithCallback(
  targetPath: string,
  nextUrl: NextURL
) {
  const callbackUrl = nextUrl.pathname + nextUrl.search;

  const redirectUrl = new URL(targetPath, nextUrl.origin);
  redirectUrl.searchParams.set("callbackUrl", callbackUrl);

  return NextResponse.redirect(redirectUrl);
}

export async function authMiddleware(req: NextRequest) {
  const originalPathname = req.nextUrl.pathname;
  const segments = originalPathname.split("/");
  const maybeLocale = segments[1];
  const isLocale = routing.locales.includes(maybeLocale as Language);
  const cleanPathname = isLocale
    ? "/" + segments.slice(2).join("/")
    : originalPathname;

  const matchesAuthRoute = authRoutesRegexps.some((regex) =>
    regex.test(cleanPathname)
  );

  if (!matchesAuthRoute) return;

  const isAuthPage = authPages.includes(cleanPathname);
  const isProtectedPage =
    !authPages.includes(cleanPathname) &&
    !unProtectedPages.includes(cleanPathname);
  const isUnProtectedPage = unProtectedPages.includes(cleanPathname);
  const isAcceptTermsPage = cleanPathname === "/accept-terms";
  const isBadEmailVerificationPage =
    badEmailVerificationPages.includes(cleanPathname);
  const isGoodEmailVerificationPage =
    goodEmailVerificationPages.includes(cleanPathname);
  const isProfileInitialPage =
    cleanPathname === "/profile/initial" ||
    cleanPathname === "/profile/auto-fill";
  const isSuspendedPage = cleanPathname === "/account/suspended";
  const isDeletionPage = cleanPathname === "/account/deletion";

  const authToken = req.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!);
  let data: AxiosResponse<UserStatusResponse>;

  try {
    data = await api.get<UserStatusResponse>(userStatusApiLink, {
      headers: {
        Authorization: `Bearer ${authToken?.value || ""}`,
      },
    });
  } catch {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/", req.url));
    } else {
      return;
    }
  }

  const isAuthenticated =
    data.status === 200 && data.data.authenticated === true;

  const isValidTermsVersion =
    data.status === 200 && data.data.is_valid_terms_version === true;

  const isFirstTermsVersion =
    data.status === 200 && data.data.is_valid_terms_version === null;

  const isEmailVerified =
    data.status === 200 && data.data.email_verified === true;

  const isFirstLogin = data.status === 200 && data.data.is_first_login === true;

  const isSuspended = data.status === 200 && data.data.is_suspended === true;

  let isNoticeTermsVersion = null;

  if (data.status === 200) {
    isNoticeTermsVersion = data.data.notice_new_terms_version;
  }

  if (isUnProtectedPage) return;

  if (isAuthenticated) {
    if (isDeletionPage) {
      return;
    }

    if (isSuspended) {
      if (isSuspendedPage) return;
      return NextResponse.redirect(new URL("/account/suspended", req.url));
    } else {
      if (isSuspendedPage) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
    }

    if (isAcceptTermsPage) {
      if (
        !isFirstTermsVersion &&
        (isValidTermsVersion ||
          (!isValidTermsVersion && isNoticeTermsVersion === null))
      ) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      return;
    } else {
      if (
        isFirstTermsVersion ||
        (!isValidTermsVersion && isNoticeTermsVersion !== null)
      ) {
        return createRedirectWithCallback("/accept-terms", req.nextUrl);
      }
    }

    if (isEmailVerified) {
      if (isBadEmailVerificationPage) {
        return NextResponse.redirect(new URL("/home", req.url));
      }
      if (isGoodEmailVerificationPage) return;
    } else {
      if (isBadEmailVerificationPage) return;

      return createRedirectWithCallback("/email/verify", req.nextUrl);
    }

    if (isFirstLogin && !isProfileInitialPage) {
      return createRedirectWithCallback("/profile/auto-fill", req.nextUrl);
    } else if (!isFirstLogin && isProfileInitialPage) {
      return createRedirectWithCallback("/profile", req.nextUrl);
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  } else {
    if (isProtectedPage) {
      return createRedirectWithCallback("/login", req.nextUrl);
    }
  }

  return;
}

const authRoutePatterns = [
  "/accept-terms/*",
  "/edit/*",
  "/email/*",
  "/home/*",
  "/login/*",
  "/password/*",
  "/payment/*",
  "/profile/*",
  "/register/*",
  "/settings/*",
  "/account/*",
  "/",
];

const authRoutesRegexps = routePatternsToRegex(authRoutePatterns);
