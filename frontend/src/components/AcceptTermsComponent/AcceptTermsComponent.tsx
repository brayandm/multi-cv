"use client";

import {
  acceptTermsVersionApi,
  notifiedTermsVersionApi,
} from "@/lib/backendService";

import { Button, Checkbox } from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IAcceptTermsComponentProps {
  acceptTerms: boolean | null;
  noticeTerms: boolean | null;
}

export default function AcceptTermsComponent({
  acceptTerms,
  noticeTerms,
}: IAcceptTermsComponentProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    acceptTerms: false,
    underAge: false,
    talentPool: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let response;
      if (acceptTerms === false && noticeTerms === true) {
        response = await notifiedTermsVersionApi();
      } else {
        response = await acceptTermsVersionApi();
      }

      if (response.status === 200) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const t = useTranslations();

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{t("pages.terms_and_conditions.title")}</h1>
      {acceptTerms === null ? (
        <p> {t("pages.terms_and_conditions.description_first_time")}</p>
      ) : (
        <>
          {noticeTerms ? (
            <span>
              <p>
                {t.rich("pages.terms_and_conditions.updating_notice", {
                  termsConditions: () => (
                    <Link
                      href="/terms-and-conditions.html"
                      target="_blank"
                      className="text-primary underline"
                    >
                      {t("common.legal.terms_conditions")}
                    </Link>
                  ),
                  privacyPolicy: () => (
                    <Link
                      href="/privacy-policy.html"
                      target="_blank"
                      className="text-primary underline"
                    >
                      {t("common.legal.privacy_policy")}
                    </Link>
                  ),
                })}
              </p>
            </span>
          ) : (
            <p>
              {t.rich("pages.terms_and_conditions.accept_terms", {
                termsConditions: () => (
                  <Link
                    href="/terms-and-conditions.html"
                    target="_blank"
                    className="text-primary underline"
                  >
                    {t("common.legal.terms_conditions")}
                  </Link>
                ),
                privacyPolicy: () => (
                  <Link
                    href="/privacy-policy.html"
                    target="_blank"
                    className="text-primary underline"
                  >
                    {t("common.legal.privacy_policy")}
                  </Link>
                ),
              })}
            </p>
          )}
        </>
      )}
      <div className="flex flex-col gap-3 mt-7">
        {acceptTerms === null && (
          <div className="flex items-start gap-1">
            <Checkbox
              name="underAge"
              checked={formData.underAge}
              onChange={handleCheckboxChange}
              size="sm"
            />
            <span
              className="text-[9px] text-gray-600 text-left
          "
            >
              {t("common.legal.confirm_age")}
            </span>
          </div>
        )}
        {acceptTerms === null && (
          <div className="flex items-start gap-1">
            <Checkbox
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleCheckboxChange}
              size="sm"
            />
            <span className="text-[9px] text-gray-600 text-left">
              {t.rich("common.legal.accept_terms", {
                termsConditions: () => (
                  <Link
                    href="/terms-and-conditions.html"
                    target="_blank"
                    className="text-primary underline"
                  >
                    {t("common.legal.terms_conditions")}
                  </Link>
                ),
                privacyPolicy: () => (
                  <Link
                    href="/privacy-policy.html"
                    target="_blank"
                    className="text-primary underline"
                  >
                    {t("common.legal.privacy_policy")}
                  </Link>
                ),
              })}
            </span>
          </div>
        )}
        {acceptTerms === null && (
          <div className="flex items-start gap-1">
            <Checkbox
              name="talentPool"
              checked={formData.talentPool}
              onChange={handleCheckboxChange}
              size="sm"
            />
            <span
              className="text-[9px] text-gray-600 text-left
          "
            >
              {t("common.legal.talent_pool")}
            </span>
          </div>
        )}
        <Button
          color="primary"
          type="submit"
          isDisabled={
            (acceptTerms === null && !formData.acceptTerms) ||
            (acceptTerms === null && !formData.underAge)
          }
        >
          {t("common.buttons.continue")}
        </Button>
      </div>
    </form>
  );
}
