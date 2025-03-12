import { AuthCookie } from "./types";

export const syncCookies = (auth_cookie: AuthCookie, callback?: () => void) => {
  window.postMessage({
    action: "setAuthCookie",
    content: auth_cookie,
  });

  window.addEventListener("message", (event) => {
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
