import { googleLoginApi } from "./backendService";

export const handleGoogleSignIn = async () => {
  const isIframe = window.self !== window.top;

  if (isIframe) {
    window.open(process.env.NEXT_PUBLIC_FRONTEND_URL + "/auth/google");
  } else {
    const response = await googleLoginApi();
    const isLocal = response.data.is_local;
    const redirectUrl = response.data.url;
    const auth_cookie = response.data.auth_cookie;

    window.postMessage(
      {
        type: "set_auth_cookie",
        content: auth_cookie,
      },
      process.env.NEXT_PUBLIC_FRONTEND_URL!
    );

    if (isLocal) window.location.href = "/home";
    if (redirectUrl) window.location.href = redirectUrl;
  }
};
