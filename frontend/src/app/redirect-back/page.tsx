"use client";

import { useEffect } from "react";

export default function RedirectBack() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.postMessage(
        {
          content: "Hello World",
        },
        process.env.NEXT_PUBLIC_FRONTEND_URL!
      );

      window.close();
    }
  }, []);
  return null;
}
