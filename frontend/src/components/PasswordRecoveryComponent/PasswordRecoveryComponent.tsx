"use client";

import { useState, useEffect } from "react";
import { passwordRecoveryEmailApi } from "@/lib/backendService";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { generalInputsStyles } from "@/lib/customStyles";

interface IPasswordRecoveryComponentProps {
  type: "success" | "fail" | "recovery";
}

export default function PasswordRecoveryComponent({
  type,
}: IPasswordRecoveryComponentProps) {
  const router = useRouter();
  const [isCooldown, setIsCooldown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [tryOtherDay, setTryOtherDay] = useState(false);

  const [email, setEmail] = useState("");

  const resendTime = 60;

  useEffect(() => {
    const lastSentTime = localStorage.getItem(
      "passwordRecovery:lastEmailResendTime"
    );
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
  }, []);

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
      const response = await passwordRecoveryEmailApi(email);

      if (response.status === 200) {
        localStorage.setItem(
          "passwordRecovery:lastEmailResendTime",
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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  const handleTryAgain = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/password/recovery");
  };

  const t = useTranslations();

  return (
    <>
      {type === "recovery" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={resendEmail}
        >
          <h1 className="text-center">{t("pages.password_recovery.title")}</h1>
          <p>{t("pages.password_recovery.instructions")}</p>
          <Input
            label={t("common.form.email")}
            color="default"
            placeholder={t("common.placeholders.enter_email")}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            classNames={generalInputsStyles}
          />
          <Button
            color="primary"
            type="submit"
            isDisabled={isCooldown || tryOtherDay || !email}
          >
            {tryOtherDay && t("common.buttons.too_many_requests")}
            {!tryOtherDay &&
              (isCooldown
                ? t("common.buttons.resend_in", {
                    timeleft: timeLeft,
                  })
                : t("common.buttons.send_email"))}
          </Button>
        </form>
      )}
      {type === "success" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={handleContinue}
        >
          <h1 className="text-center">
            {t("pages.password_recovery.success.title")}
          </h1>
          <p>{t("pages.password_recovery.success.message")}</p>
          <Button color="primary" type="submit">
            {t("common.buttons.continue")}
          </Button>
        </form>
      )}
      {type === "fail" && (
        <form
          className="flex flex-col gap-2 text-center w-[250px] mx-auto"
          onSubmit={handleTryAgain}
        >
          <h1 className="text-center">
            {t("pages.password_recovery.fail.title")}
          </h1>
          <p>{t("pages.password_recovery.fail.message")}</p>
          <Button color="primary" type="submit">
            {t("common.buttons.try_again")}
          </Button>
        </form>
      )}
    </>
  );
}
