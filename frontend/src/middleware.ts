// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/middlewares/authMiddleware";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const middlewares = [intlMiddleware, authMiddleware];

export async function middleware(req: NextRequest) {
  for (const mw of middlewares) {
    const res = await mw(req);
    if (res) return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
