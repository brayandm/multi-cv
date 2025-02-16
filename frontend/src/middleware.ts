export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!login|register|api/register|api/auth/google/api/auth/google/callback).*)",
  ],
};
