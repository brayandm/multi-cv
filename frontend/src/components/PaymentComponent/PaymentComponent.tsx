"use client";

import { checkoutSessionApi } from "@/lib/backendService";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface IPaymentComponentProps {
  plan: string | null;
}

export default function PaymentComponent({ plan }: IPaymentComponentProps) {
  const router = useRouter();
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (!plan || hasProcessedRef.current) return;
    hasProcessedRef.current = true;

    if (plan === "free") {
      router.push("/home");
      return;
    }

    const redirectToStripe = async () => {
      try {
        const response = await checkoutSessionApi(plan);
        const { id } = response.data;

        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe.js has not loaded.");

        const result = await stripe.redirectToCheckout({ sessionId: id });
        if (result.error) {
          console.error(result.error.message);
        }
      } catch (err) {
        console.error("Error redirecting to checkout:", err);
      }
    };

    redirectToStripe();
  }, [plan]); // eslint-disable-line

  return (
    <div className="flex mt-20 flex-col items-center justify-center">
      <Spinner variant="dots" />
    </div>
  );
}
