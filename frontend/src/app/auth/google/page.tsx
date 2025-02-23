"use client";

import { googleLoginApi } from "@/lib/backendService";

export default function AuthGoogle() {
  const handleGoogleSignIn = async () => {
    const response = await googleLoginApi();
    const redirectUrl = response.data.url;
    window.location.href = redirectUrl;
  };

  handleGoogleSignIn();

  return <></>;
}
