import { registerUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { name, email, password, auth_token } = await req.json();

  const res = await registerUser(name, email, password, auth_token);

  if (res == 200) {
    return new NextResponse(
      JSON.stringify({
        message: "User registered successfully",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new NextResponse(
    JSON.stringify({
      message: "User registration failed",
    }),
    { status: res, headers: { "Content-Type": "application/json" } }
  );
}
