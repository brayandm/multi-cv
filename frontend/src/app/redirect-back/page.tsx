"use client";

import { useEffect } from "react";

export default function RedirectBack() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.close();
    }
  }, []);
  return null;
}
