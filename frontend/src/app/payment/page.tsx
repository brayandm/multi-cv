"use client";

import PaymentComponent from "@/components/PaymentComponent";
import { useSearchParams } from "next/navigation";

export default function Payment() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  return (
    <>
      <PaymentComponent plan={plan} />
    </>
  );
}
