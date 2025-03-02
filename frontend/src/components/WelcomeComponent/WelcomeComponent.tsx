"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function WelcomeComponent() {
  const router = useRouter();
  const t = useTranslations("WelcomePage");
  const tCommon = useTranslations();

  return (
    <div className="flex flex-col mt-40 w-[280px] mx-auto">
      <h1 className="text-center">
        {t("welcome-to")}{" "}
        <span className="text-primary">{tCommon("app-name")}</span>
      </h1>
      <p className="text-center">{t("description")}</p>
      <div className="flex justify-center gap-2 mt-2">
        <Button onPress={() => router.push("/login")} color="primary">
          {tCommon("login")}
        </Button>
        <Button onPress={() => router.push("/register")} color="secondary">
          {tCommon("register")}
        </Button>
      </div>
    </div>
  );
}
