import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/backendService";
import { verifyApiLink } from "./lib/links";
import { VerifyResponse } from "./lib/types";

const authPages = ["/", "/login", "/register"];
const unProtectedPages: string[] = [];
const EmailVerificationPages = [
  "email/verify",
  "email/verify/already-verified",
  "email/verify/expired",
  "email/verify/success",
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isAuthPage = authPages.includes(url.pathname);
  const isProtectedPage =
    !authPages.includes(url.pathname) &&
    !unProtectedPages.includes(url.pathname);
  const isAcceptTermsPage = url.pathname === "/accept-terms";
  const isEmailVerificationPage = EmailVerificationPages.includes(url.pathname);

  const authToken = req.cookies.get("auth_token");

  const data = await api.get<VerifyResponse>(verifyApiLink, {
    headers: {
      Authorization: `Bearer ${authToken?.value || ""}`,
    },
  });

  const isAuthenticated =
    data.status === 200 && data.data.authenticated === true;

  const isValidTermsVersion =
    data.status === 200 && data.data.is_valid_terms_version === true;

  const isEmailVerified =
    data.status === 200 && data.data.email_verified === true;

  let isNoticeTermsVersion = null;

  if (data.status === 200) {
    isNoticeTermsVersion = data.data.notice_new_terms_version;
  }

  if (isAuthenticated && isAuthPage) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated && isProtectedPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && isEmailVerified && isEmailVerificationPage) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  if (isAuthenticated && !isEmailVerified) {
    url.pathname = "/email/verify";
    return NextResponse.redirect(url);
  }

  if (
    !isAcceptTermsPage &&
    isAuthenticated &&
    isProtectedPage &&
    !isValidTermsVersion &&
    isNoticeTermsVersion !== null
  ) {
    url.pathname = "/accept-terms";
    return NextResponse.redirect(url);
  }

  if (
    isAcceptTermsPage &&
    isAuthenticated &&
    (isValidTermsVersion ||
      (!isValidTermsVersion && isNoticeTermsVersion === null))
  ) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/login", "/register", "/accept-terms", "/home", "/password"],
};
