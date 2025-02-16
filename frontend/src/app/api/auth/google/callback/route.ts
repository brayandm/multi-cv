import { googleOAuth, googleOAuthCallback } from "@/lib/auth";
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
    return new NextResponse(
      JSON.stringify({
        message: "Google OAuth started",
        redirect: res.responseUrl,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
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
