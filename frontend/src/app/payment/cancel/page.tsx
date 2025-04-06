"use client";

import { Button } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function PaymentCancel() {
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  const t = useTranslations();

  return (
    <>
      <form
        className="flex flex-col gap-2 text-center w-[250px] mx-auto"
        onSubmit={handleContinue}
      >
        <h1 className="text-center">{t("pages.payment.cancel.title")}</h1>
        <p>{t("pages.payment.cancel.description")}</p>
        <Button color="primary" type="submit">
          {t("common.buttons.continue")}
        </Button>
      </form>
    </>
  );
}
