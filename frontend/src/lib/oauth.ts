import { googleLoginApi } from "./backendService";

export const handleGoogleSignIn = async () => {
  const isIframe = window.self !== window.top;

  if (isIframe) {
    window.open(process.env.NEXT_PUBLIC_FRONTEND_URL + "/auth/google");
  } else {
    const response = await googleLoginApi();
    const redirectUrl = response.data.url;
    window.location.href = redirectUrl;
  }
};
