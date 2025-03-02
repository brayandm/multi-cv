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

  const t = useTranslations("TermsAndConditionsPage");
  const tCommon = useTranslations();

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{t("title")}</h1>
      {acceptTerms === null ? (
        <p> {t("description-first-time")}</p>
      ) : (
        <>
          {noticeTerms ? (
            <span>
              <p>
                {t("we-are-updating")}{" "}
                <Link
                  href="/privacy-policy.html"
                  target="_blank"
                  className="text-primary underline"
                >
                  {tCommon("privacy-policy")}
                </Link>{" "}
                {tCommon("and")}{" "}
                <Link
                  href="/terms-and-conditions.html"
                  target="_blank"
                  className="text-primary underline"
                >
                  {tCommon("terms-and-conditions")}
                </Link>
                . {t("notification")}{" "}
              </p>
            </span>
          ) : (
            <p>
              {t("we-are-updating")}{" "}
              <Link
                href="/privacy-policy.html"
                target="_blank"
                className="text-primary underline"
              >
                {tCommon("privacy-policy")}
              </Link>{" "}
              {tCommon("and")}{" "}
              <Link
                href="/terms-and-conditions.html"
                target="_blank"
                className="text-primary underline"
              >
                {tCommon("terms-and-conditions")}
              </Link>
              . {t("by-clickin")}
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
              className="text-[9px] text-gray-600
          "
            >
              {tCommon("confirm-age")}
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
              {tCommon("i-accept")}{" "}
              <Link
                href="/terms-and-conditions.html"
                target="_blank"
                className="text-primary underline"
              >
                {tCommon("terms-and-conditions")}
              </Link>{" "}
              {tCommon("and")}{" "}
              <Link
                href="/privacy-policy.html"
                target="_blank"
                className="text-primary underline"
              >
                {tCommon("privacy-policy")}
              </Link>
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
          {tCommon("continue")}
        </Button>
      </div>
    </form>
  );
}
