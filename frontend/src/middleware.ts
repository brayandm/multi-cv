export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!login|register|api/register|api/oauth/google/login|api/oauth/google/callback).*)",
  ],
};
