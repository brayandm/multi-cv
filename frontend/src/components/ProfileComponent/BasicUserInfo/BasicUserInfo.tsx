"use client";
import React from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { IBasicInfo, useProfile } from "@/contexts/ProfileContext";

const BasicUserInfo: React.FC = () => {
  const { profile, updateProfile } = useProfile();

  const t = useTranslations();

  function onBasicUserInfoChange(
    key: keyof IBasicInfo,
    value: string | boolean
  ) {
    const updatedBasicInfo = { ...profile.basic_info, [key]: value };

    updateProfile({
      ...profile,
      basic_info: updatedBasicInfo,
    });
  }

  const inputs: IDynamicInputArray<string> = [
    {
      label: t("common.form.full_name"),
      placeholder: t("common.placeholders.enter_full_name"),
      type: "text",
      value: profile.basic_info.full_name,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("full_name", value);
      },
      isRequired: true,
    },
    {
      label: t("common.form.email"),
      placeholder: t("common.placeholders.enter_email"),
      type: "email",
      value: profile.basic_info.email,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("email", value);
      },
      isRequired: true,
    },
    [
      {
        label: t("common.form.phone_country_code"),
        type: "phone_country_code",
        value: profile.basic_info.phone_country_code,
        onValueChange: (value?: string) => {
          onBasicUserInfoChange("phone_country_code", value || "");
        },
        isRequired: true,
      },
      {
        label: t("common.form.phone_number"),
        placeholder: "XXXXXXXXX",
        type: "phone_number",
        value: profile.basic_info.phone_number,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("phone_number", value);
        },
        isRequired: true,
      },
    ],
    [
      {
        label: t("common.form.your_location"),
        placeholder: t("common.placeholders.enter_location"),
        type: "text",
        value: profile.basic_info.location,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("location", value);
        },
        isRequired: true,
      },
    ],
    {
      label: t("common.form.about"),
      placeholder: t("common.placeholders.enter_about"),
      type: "textarea",
      value: profile.basic_info.about,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("about", value);
      },
      isRequired: true,
      isInvalid: profile.basic_info.about.length < 50,
      errorMessage: t("common.errors.length", {
        field: t("common.form.about"),
        length: 50,
        current_length: profile.basic_info.about.length,
      }),
      description: `${profile.basic_info.about.length} / 50`,
    },
  ];

  return (
    <div className="px-1">
      <DynamicInputs inputs={inputs}></DynamicInputs>
    </div>
  );
};

export default BasicUserInfo;
