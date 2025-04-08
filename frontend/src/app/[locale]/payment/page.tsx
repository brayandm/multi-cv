"use client";

import PaymentComponent from "@/components/PaymentComponent";
import { useSearchParams } from "next/navigation";
import { SpacerDefault } from "@/app/main.styles";

export default function Payment() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  return (
    <>
      <SpacerDefault />
      <PaymentComponent plan={plan} />
    </>
  );
}
