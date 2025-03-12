import { AuthCookie } from "./types";

export const syncCookies = (auth_cookie: AuthCookie, callback?: () => void) => {
  window.postMessage(
    {
      action: "setAuthCookie",
      content: auth_cookie,
    },
    process.env.NEXT_PUBLIC_FRONTEND_URL!
  );

  window.addEventListener("message", (event) => {
    if (event.origin !== process.env.NEXT_PUBLIC_FRONTEND_URL) return;

    if (
      event.data.action === "responseSetAuthCookie" &&
      event.data.content === 200
    ) {
      if (callback) {
        callback();
      }
    }
  });
};
