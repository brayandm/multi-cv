import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/backendService";
import { userStatusApiLink } from "./lib/links";
import { UserStatusResponse } from "./lib/types";

const authPages = ["/", "/login", "/register"];
const unProtectedPages: string[] = [];
const badEmailVerificationPages = ["/email/verify", "/email/verify/expired"];
const goodEmailVerificationPages = [
  "/email/verify/success",
  "/email/verify/already-verified",
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isAuthPage = authPages.includes(url.pathname);
  const isProtectedPage =
    !authPages.includes(url.pathname) &&
    !unProtectedPages.includes(url.pathname);
  const isAcceptTermsPage = url.pathname === "/accept-terms";
  const isBadEmailVerificationPage = badEmailVerificationPages.includes(
    url.pathname
  );

  const isGoodEmailVerificationPage = goodEmailVerificationPages.includes(
    url.pathname
  );

  const authToken = req.cookies.get(process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME!);

  const data = await api.get<UserStatusResponse>(userStatusApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value || ""}`,
    },
  });

  const isAuthenticated =
    data.status === 200 && data.data.authenticated === true;

  const isValidTermsVersion =
    data.status === 200 && data.data.is_valid_terms_version === true;

  const isFirstTermsVersion =
    data.status === 200 && data.data.is_valid_terms_version === null;

  const isEmailVerified =
    data.status === 200 && data.data.email_verified === true;

  // const isFirstLogin = data.status === 200 && data.data.is_first_login === true;

  let isNoticeTermsVersion = null;

  if (data.status === 200) {
    isNoticeTermsVersion = data.data.notice_new_terms_version;
  }

  if (isAuthenticated) {
    if (isAuthPage) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }

    if (isEmailVerified && isBadEmailVerificationPage) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }

    if (!isEmailVerified && isGoodEmailVerificationPage) {
      url.pathname = "/email/verify";
      return NextResponse.redirect(url);
    }

    if (!isEmailVerified && isBadEmailVerificationPage) {
      return NextResponse.next();
    }

    if (!isEmailVerified) {
      url.pathname = "/email/verify";
      return NextResponse.redirect(url);
    }

    if (
      !isAcceptTermsPage &&
      isProtectedPage &&
      (isFirstTermsVersion ||
        (!isValidTermsVersion && isNoticeTermsVersion !== null))
    ) {
      url.pathname = "/accept-terms";
      return NextResponse.redirect(url);
    }

    if (
      isAcceptTermsPage &&
      !isFirstTermsVersion &&
      (isValidTermsVersion ||
        (!isValidTermsVersion && isNoticeTermsVersion === null))
    ) {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  } else {
    if (isProtectedPage) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/accept-terms",
    "/home",
    "/profile",
    "/password",
    "/email/:path*",
  ],
};
