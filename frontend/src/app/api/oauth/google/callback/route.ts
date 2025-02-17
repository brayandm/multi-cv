export const dynamic = "force-dynamic";

import { googleOAuthCallback } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code == null) {
    return new NextResponse(
      JSON.stringify({
        message: "User registration failed",
        redirect: "/login",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const res = await googleOAuthCallback(code);

  if (res.status == 200) {
    return NextResponse.redirect(
      process.env.HOST! +
        "/login?token=" +
        res.token +
        "&id=" +
        res.userId +
        "&ppa=" +
        res.privacyPolicyAccept
    );
  }

  return new NextResponse(
    JSON.stringify({
      message: "User registration failed",
      redirect: "/login",
    }),
    { status: res.status, headers: { "Content-Type": "application/json" } }
  );
}
