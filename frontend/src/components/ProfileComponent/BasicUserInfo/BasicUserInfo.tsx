"use client";
import React, { useEffect } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { IBasicInfo, useProfile } from "@/contexts/ProfileContext";
import { useChat } from "@/contexts/ChatContext";

const BasicUserInfo: React.FC = () => {
  const { basicInfo, updateBasicInfo, syncProfileOnFirstLogin } = useProfile();

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

  const t = useTranslations();

  function onBasicUserInfoChange(
    key: keyof IBasicInfo,
    value: string | boolean
  ) {
    const updatedBasicInfo = { ...basicInfo, [key]: value };

    updateBasicInfo(updatedBasicInfo);
  }

  const inputs: IDynamicInputArray<string> = [
    {
      label: t("common.form.full_name"),
      placeholder: t("common.placeholders.enter_full_name"),
      type: "text",
      value: basicInfo.full_name,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("full_name", value);
      },
      isRequired: true,
      onBlur: syncProfileOnFirstLogin,
    },
    {
      label: t("common.form.email"),
      placeholder: t("common.placeholders.enter_email"),
      type: "email",
      value: basicInfo.email,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("email", value);
      },
      isRequired: true,
      onBlur: syncProfileOnFirstLogin,
    },
    [
      {
        label: t("common.form.phone_country_code"),
        type: "phone_country_code",
        value: basicInfo.phone_country_code,
        onValueChange: (value?: string) => {
          onBasicUserInfoChange("phone_country_code", value || "");
          syncProfileOnFirstLogin();
        },
        isRequired: true,
        validate: (value: unknown) => {
          value = value as { inputValue: string; selectedKey: string };
          const castedValue = value as {
            inputValue: string;
            selectedKey: string;
          };
          if (!castedValue.selectedKey) {
            return t("common.errors.country_code_required");
          }
        },
      },
      {
        label: t("common.form.phone_number"),
        placeholder: "XXXXXXXXX",
        type: "phone_number",
        value: basicInfo.phone_number,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("phone_number", value);
        },
        isRequired: true,
        onBlur: syncProfileOnFirstLogin,
      },
    ],
    [
      {
        label: t("common.form.your_location"),
        placeholder: t("common.placeholders.enter_location"),
        type: "text",
        value: basicInfo.location,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("location", value);
        },
        isRequired: true,
        onBlur: syncProfileOnFirstLogin,
      },
    ],
    {
      label: t("common.form.about"),
      placeholder: t("common.placeholders.enter_about"),
      type: "textarea",
      value: basicInfo.about,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("about", value);
      },
      isRequired: true,
      description: `${basicInfo.about.length} / 50`,
      onBlur: syncProfileOnFirstLogin,
      errorMessage: t("common.errors.length", {
        field: t("common.form.about"),
        length: 50,
        current_length: basicInfo.about.length,
      }),
      validate: (value) => {
        if (value.length < 50) {
          return "error";
        }
      },
    },
  ];

  return (
    <div className="px-1">
      <DynamicInputs inputs={inputs}></DynamicInputs>
    </div>
  );
};

export default BasicUserInfo;
