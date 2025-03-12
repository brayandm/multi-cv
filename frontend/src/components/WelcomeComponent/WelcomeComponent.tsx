"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRefreshPage } from "@/hooks/useRefreshPage";

export default function WelcomeComponent() {
  const router = useRouter();
  const t = useTranslations();

  useRefreshPage();

  return (
    <div className="flex flex-col mt-40 w-[280px] mx-auto">
      <h1 className="text-center">
        {t.rich("pages.welcome.title", {
          appName: () => <span className="text-primary">{t("app.name")}</span>,
        })}
      </h1>
      <p className="text-center">{t("pages.welcome.description")}</p>
      <div className="flex justify-center gap-2 mt-2">
        <Button onPress={() => router.push("/login")} color="primary">
          {t("common.auth.login")}
        </Button>
        <Button onPress={() => router.push("/register")} color="secondary">
          {t("common.auth.register")}
        </Button>
      </div>
    </div>
  );
}
