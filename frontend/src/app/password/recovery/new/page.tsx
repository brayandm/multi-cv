"use client";

import PasswordComponent from "@/components/PasswordComponent";
import { useSearchParams } from "next/navigation";

export default function PasswordRecoveryNew() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  return (
    <PasswordComponent
      passwordRecovery={{
        email: email || "",
        token: token || "",
      }}
    />
  );
}
