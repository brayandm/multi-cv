"use client";

import { googleLoginApi } from "@/lib/backendService";

export default function AuthGoogle() {
  const handleGoogleSignIn = async () => {
    const response = await googleLoginApi(true);
    const redirectUrl = response.data.url;
    if (redirectUrl) window.location.href = redirectUrl;
  };

  handleGoogleSignIn();

  return <></>;
}
