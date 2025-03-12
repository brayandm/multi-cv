import { googleLoginApi } from "./backendService";
import { syncCookies } from "./syncCookies";

export const handleGoogleSignIn = async () => {
  const isIframe = window.self !== window.top;

  if (isIframe) {
    window.open(process.env.NEXT_PUBLIC_FRONTEND_URL + "/auth/google");
  } else {
    const response = await googleLoginApi();
    const isLocal = response.data.is_local;
    const redirectUrl = response.data.url;
    const auth_cookie = response.data.auth_cookie;

    if (isLocal) {
      if (auth_cookie) {
        syncCookies(auth_cookie, () => {
          window.location.href = "/home";
        });
      }
    } else {
      if (redirectUrl) window.location.href = redirectUrl;
    }
  }
};
