import { setCookie } from "cookies-next";

export const setCookieClient = async (
  name: string,
  value: string,
  expiration_date: number | null = null
) => {
  let maxAge = 60 * 60 * 24 * 365; // 1 year

  if (expiration_date) {
    maxAge = Math.floor((expiration_date * 1000 - Date.now()) / 1000);
  }

  await setCookie(name, value, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: "/",
    maxAge: maxAge,
    partitioned: true,
  });

  await setCookie(name, value, {
    secure: true,
    sameSite: "none",
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    path: "/",
    maxAge: maxAge,
    partitioned: true,
  });
};
