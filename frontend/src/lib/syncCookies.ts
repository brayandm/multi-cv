import { AuthCookie } from "./types";

export const syncCookies = (auth_cookie: AuthCookie, callback?: () => void) => {
  window.postMessage({
    action: "setValue",
    key: "auth_cookie",
    value: auth_cookie,
  });

  window.addEventListener("message", (event) => {
    if (
      event.data.action === "responseSetValue" &&
      event.data.content === 200
    ) {
      if (callback) {
        callback();
      }
    }
  });
};
