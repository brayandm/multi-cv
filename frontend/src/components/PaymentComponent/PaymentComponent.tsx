"use client";

import { checkoutSessionApi } from "@/lib/backendService";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useUserStatus } from "@/contexts/UserStatusContext";
import { useTranslations } from "next-intl";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface IPaymentComponentProps {
  plan: string | null;
}

export default function PaymentComponent({ plan }: IPaymentComponentProps) {
  const router = useRouter();
  const hasProcessedRef = useRef(false);

  const { userStatus } = useUserStatus();

  useEffect(() => {
    if (!plan || hasProcessedRef.current) return;
    if (!userStatus) return;
    if (userStatus.authenticated && !userStatus.is_freemium) {
      router.push("/payment/already-premium");
      return;
    }
    hasProcessedRef.current = true;

    if (plan === "freemium") {
      setTimeout(() => {
        router.push("/home");
      }, 1000);
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
  }, [plan, userStatus]); // eslint-disable-line

  const t = useTranslations();

  return (
    <div className="flex mt-20 flex-col items-center justify-center">
      {plan === "freemium" ? (
        <h1 className="text-2xl font-bold mb-4">
          {t("common.texts.analizing_plan")}
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-4">
          {t("common.texts.payment_redirecting")}
        </h1>
      )}
      <Spinner variant="dots" />
    </div>
  );
}
