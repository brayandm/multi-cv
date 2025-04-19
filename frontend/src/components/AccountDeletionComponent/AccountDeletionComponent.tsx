"use client";

import { useTranslations } from "next-intl";

export default function AccountDeletionComponent({}) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2 text-center w-[250px] mx-auto mt-10">
      <h1 className="text-center">{t("pages.account.deletion.title")}</h1>
      <p>{t("pages.account.deletion.description")}</p>
    </div>
  );
}
