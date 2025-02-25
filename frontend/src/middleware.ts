import { NextRequest, NextResponse } from "next/server";
import { api } from "@/lib/backendService";
import { verifyApiLink } from "./lib/links";

const authPages = ["/", "/login", "/register"];
const protectedPages = ["/accept-terms", "/home", "/password"];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isAuthPage = authPages.includes(url.pathname);
  const isProtectedPage = protectedPages.some((route) =>
    url.pathname.startsWith(route)
  );

  const authToken = req.cookies.get("auth_token");

  const data = await api.get(verifyApiLink, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const isAuthenticated =
    data.status === 200 && data.data.authenticated === true;

  if (isAuthenticated && isAuthPage) {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated && isProtectedPage) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/login", "/register", "/accept-terms", "/home", "/password"],
};
