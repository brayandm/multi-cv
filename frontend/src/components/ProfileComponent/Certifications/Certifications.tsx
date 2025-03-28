"use client";
import React, { RefObject, useEffect } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { ICertificate, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";
import { MAX_CERTIFICATIONS_ELEMENTS } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";

interface ICertificationsProps {
  formRef: RefObject<HTMLFormElement | null>;
  width: number;
  maxWidth: number;
}

const Certifications = ({ formRef, width, maxWidth }: ICertificationsProps) => {
  const { certifications, updateCertifications, syncProfileOnFirstLogin } =
    useProfile();

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

  const [sync, setSync] = React.useState(false);

  const t = useTranslations();
  function onCertificationChange(
    index: number,
    key: keyof ICertificate,
    value: string | boolean
  ) {
    const updatedCertifications = [...certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [key]: value,
    };

    if (key === "hasnt_expiration_date" && value === true) {
      updatedCertifications[index].expiration_date = "";
    }

    if (key === "issue_date" || key === "expiration_date") {
      setSync(true);
    }

    updateCertifications(updatedCertifications);
  }

  useEffect(() => {
    if (sync) {
      syncProfileOnFirstLogin();
      setSync(false);
    }
  }, [syncProfileOnFirstLogin, sync]);

  function addNewCertification() {
    const certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      certificate_id: "",
      verification_url: "",
      description: "",
      issue_date: "",
      expiration_date: "",
      hasnt_expiration_date: false,
    };

    updateCertifications([...certifications, certification]);
  }

  function onRemovePage(index: number) {
    const updatedCertifications = certifications.filter(
      (_, certificationsIndex) => certificationsIndex !== index
    );

    updateCertifications(updatedCertifications);
  }

  return (
    <Paginator
      total={certifications.length}
      onNewPage={addNewCertification}
      onRemovePage={onRemovePage}
      maxElements={MAX_CERTIFICATIONS_ELEMENTS}
      formRef={formRef}
      elementName={t("pages.profile.sections.certifications.element")}
    >
      {certifications.map((certification, index) => {
        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: t("common.form.certification_name"),
            type: "text",
            placeholder: t("common.placeholders.enter_certification_name"),
            onValueChange: (value: string) =>
              onCertificationChange(index, "name", value),
            value: certification?.name || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          [
            {
              label: t("common.form.issuer"),
              type: "text",
              placeholder: t("common.placeholders.enter_certification_issuer"),
              onValueChange: (value: string) =>
                onCertificationChange(index, "issuer", value),
              value: certification?.issuer || "",
              onBlur: syncProfileOnFirstLogin,
              isRequired: true,
            },
            {
              label: t("common.form.certificate_id"),
              type: "text",
              placeholder: t(
                "common.placeholders.enter_certification_certificate_id"
              ),
              onValueChange: (value: string) =>
                onCertificationChange(index, "certificate_id", value),
              value: certification?.certificate_id || "",
              onBlur: syncProfileOnFirstLogin,
              customStyles: "w-[2/6]",
            },
          ],
          {
            label: t("common.form.verification_url"),
            type: "text",
            placeholder: t(
              "common.placeholders.enter_certification_verification_url"
            ),
            onValueChange: (value: string) =>
              onCertificationChange(index, "verification_url", value),
            value: certification?.verification_url || "",
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.certification_description"),
            type: "textarea",
            placeholder: t(
              "common.placeholders.enter_certification_description"
            ),
            onValueChange: (value: string) =>
              onCertificationChange(index, "description", value),
            value: certification?.description || "",
            onBlur: syncProfileOnFirstLogin,
          },
          [
            {
              label: t("common.form.issue_date"),
              type: "month_selector",
              onValueChange: (value: string) => {
                onCertificationChange(index, "issue_date", value);
              },
              value: certification?.issue_date || "",
              isRequired: true,
            },
            {
              label: t("common.form.expiration_date"),
              type: "month_selector",
              onValueChange: (value: string) => {
                onCertificationChange(index, "expiration_date", value);
              },
              isDisabled: certification?.hasnt_expiration_date,
              value: certification?.expiration_date || "",
              isRequired: true,
            },
          ],
          {
            label: t(
              "pages.profile.sections.certifications.hasnt_expiration_date"
            ),
            type: "checkbox",
            onValueChange: (value: boolean) => {
              onCertificationChange(index, "hasnt_expiration_date", value);
            },
            value: certification?.hasnt_expiration_date || "",
          },
        ];

        return (
          <div
            key={index}
            className={`mb-4 px-1 snap-center`}
            style={{
              minWidth: `calc(min(${maxWidth}vw, ${width}px) - 32px)`,
            }}
          >
            <div className="h-[320px] overflow-y-auto overflow-x-hidden">
              <DynamicInputs inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Certifications;
