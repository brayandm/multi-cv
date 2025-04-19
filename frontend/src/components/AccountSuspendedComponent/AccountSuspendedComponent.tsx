"use client";

import { useTranslations } from "next-intl";

export default function SuspendedAccountComponent({}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 text-center w-[250px] mx-auto mt-10">
      <h1 className="text-center">{t("pages.account.suspended.title")}</h1>
      <p>{t("pages.account.suspended.description")}</p>
    </div>
  );
}
