import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/backendService";
import { userStatusApiLink } from "@/lib/links";
import { UserStatusResponse } from "@/lib/types";
import { AxiosResponse } from "axios";
import { routePatternsToRegex } from "@/lib/matchers";

const authPages = ["/login", "/register"];
const unProtectedPages: string[] = ["/"];
const badEmailVerificationPages = ["/email/verify", "/email/verify/expired"];
const goodEmailVerificationPages = [
  "/email/verify/success",
  "/email/verify/already-verified",
];

export async function authMiddleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const matchesAuthRoute = authRoutesRegexps.some((regex) =>
    regex.test(pathname)
  );

  if (!matchesAuthRoute) return;

  const url = req.nextUrl.clone();

  const isAuthPage = authPages.includes(url.pathname);
  const isProtectedPage =
    !authPages.includes(url.pathname) &&
    !unProtectedPages.includes(url.pathname);
  const isUnProtectedPage = unProtectedPages.includes(url.pathname);
  const isAcceptTermsPage = url.pathname === "/accept-terms";
  const isBadEmailVerificationPage = badEmailVerificationPages.includes(
    url.pathname
  );

  const isGoodEmailVerificationPage = goodEmailVerificationPages.includes(
    url.pathname
  );

  const isProfileInitialPage =
    url.pathname === "/profile/initial" ||
    url.pathname === "/profile/auto-fill";

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

  let isNoticeTermsVersion = null;

  if (data.status === 200) {
    isNoticeTermsVersion = data.data.notice_new_terms_version;
  }

  if (isUnProtectedPage) {
    return;
  }

  if (isAuthenticated) {
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
        return NextResponse.redirect(new URL("/accept-terms", req.url));
      }
    }

    if (isEmailVerified) {
      if (isBadEmailVerificationPage) {
        return NextResponse.redirect(new URL("/home", req.url));
      }

      if (isGoodEmailVerificationPage) {
        return;
      }
    } else {
      if (isBadEmailVerificationPage) {
        return;
      }

      return NextResponse.redirect(new URL("/email/verify", req.url));
    }

    if (isFirstLogin && !isProfileInitialPage) {
      return NextResponse.redirect(new URL("/profile/auto-fill", req.url));
    } else if (!isFirstLogin && isProfileInitialPage) {
      return NextResponse.redirect(new URL("/profile", req.url));
    }

    if (isAuthPage) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  } else {
    if (isProtectedPage) {
      const callbackUrl = req.nextUrl.pathname + req.nextUrl.search;

      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", callbackUrl);

      return NextResponse.redirect(loginUrl);
    }
  }

  return;
}

const authRoutePatterns = [
  "/",
  "/login",
  "/register",
  "/accept-terms",
  "/home",
  "/payment/*",
  "/edit/*",
  "/settings",
  "/profile/*",
  "/password",
  "/email/*",
];

const authRoutesRegexps = routePatternsToRegex(authRoutePatterns);
