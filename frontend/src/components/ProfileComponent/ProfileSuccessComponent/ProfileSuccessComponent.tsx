"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
export default function ProfileSuccessComponent() {
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/home");
  };

  const t = useTranslations();

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleContinue}
    >
      <h1 className="text-center">{t("pages.profile.success.title")}</h1>
      <p>{t("pages.profile.success.message")}</p>
      <Button color="primary" type="submit">
        {t("common.buttons.go_home")}
      </Button>
    </form>
  );
}
