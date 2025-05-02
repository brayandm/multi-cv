"use client";

import { useState, useEffect } from "react";
import { resendEmailApi } from "@/lib/backendService";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallbackRedirect } from "@/hooks/useCallbackRedirect";

interface IEmailVerificationComponentProps {
  type: "already-verified" | "success" | "expired" | "verification";
  email?: string;
}

export default function EmailVerificationComponent({
  type,
  email,
}: IEmailVerificationComponentProps) {
  const router = useRouter();
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tryOtherDay, setTryOtherDay] = useState(false);
  const [displayResendButton, setDisplayResendButton] = useState(false);
  const resendTime = 60;

  useEffect(() => {
    const firstTimeResend = localStorage.getItem(email + ":firstTimeResend");
    if (!firstTimeResend) {
      localStorage.setItem(email + ":firstTimeResend", "true");
      localStorage.setItem(
        email + ":lastEmailResendTime",
        Date.now().toString()
      );
      setIsCooldown(true);
      setTimeLeft(resendTime);
      setDisplayResendButton(true);
    }
  }, [email]);

  useEffect(() => {
    const lastSentTime = localStorage.getItem(email + ":lastEmailResendTime");
    if (lastSentTime) {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(lastSentTime)) / 1000
      );
      const remainingTime = Math.max(60 - elapsedTime, 0);

      if (remainingTime > 0) {
        setIsCooldown(true);
        setTimeLeft(remainingTime);
      }
    }
    setDisplayResendButton(true);
  }, [email]);

  useEffect(() => {
    if (isCooldown) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsCooldown(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCooldown]);

  const resendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isCooldown) return;

    try {
      const response = await resendEmailApi();

      if (response.status === 200) {
        localStorage.setItem(
          email + ":lastEmailResendTime",
          Date.now().toString()
        );
        setIsCooldown(true);
        setTimeLeft(resendTime);
      }
    } catch (error: unknown) {
      console.log(error);
      if (
        (
          error as {
            status: number;
          }
        ).status === 429
      ) {
        setTryOtherDay(true);
      }
    }
  };

  const { callbackUrl, redirectToCallback } = useCallbackRedirect();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (callbackUrl) {
      redirectToCallback();
    } else {
      router.push("/home");
    }
  };

  const t = useTranslations();

  return (
    <>
      {type === "verification" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={resendEmail}
        >
          <h1 className="text-center">{t("pages.email_verification.title")}</h1>
          <p>{t("pages.email_verification.instructions")}</p>
          {displayResendButton && (
            <Button
              color="primary"
              type="submit"
              isDisabled={isCooldown || tryOtherDay}
            >
              {tryOtherDay && t("common.buttons.too_many_requests")}
              {!tryOtherDay &&
                (isCooldown
                  ? t("common.buttons.resend_in", {
                      timeleft: timeLeft,
                    })
                  : t("common.buttons.send_email"))}
            </Button>
          )}
        </form>
      )}
      {type === "already-verified" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={handleContinue}
        >
          <h1 className="text-center">
            {t("pages.email_verification.already_verified.title")}
          </h1>
          <p>{t("pages.email_verification.already_verified.message")}</p>
          <Button color="primary" type="submit">
            {t("common.buttons.continue")}
          </Button>
        </form>
      )}
      {type === "success" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={handleContinue}
        >
          <h1 className="text-center">
            {t("pages.email_verification.success.title")}
          </h1>
          <p>{t("pages.email_verification.success.message")}</p>
          <Button color="primary" type="submit">
            {t("common.buttons.continue")}
          </Button>
        </form>
      )}
      {type === "expired" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={resendEmail}
        >
          <h1 className="text-center">
            {t("pages.email_verification.expired.title")}
          </h1>
          <p>{t("pages.email_verification.expired.message")}</p>
          {displayResendButton && (
            <Button
              color="primary"
              type="submit"
              isDisabled={isCooldown || tryOtherDay}
            >
              {tryOtherDay && t("common.buttons.too_many_requests")}
              {!tryOtherDay &&
                (isCooldown
                  ? t("common.buttons.resend_in", {
                      timeleft: timeLeft,
                    })
                  : t("common.buttons.send_email"))}
            </Button>
          )}
        </form>
      )}
    </>
  );
}
