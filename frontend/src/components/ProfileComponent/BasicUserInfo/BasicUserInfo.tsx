"use client";
import React from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { IBasicInfo, useProfile } from "@/lib/ProfileContext";

const BasicUserInfo: React.FC = () => {
  const { profile, updateProfile } = useProfile();

  const t = useTranslations();

  function onBasicUserInfoChange(
    key: keyof IBasicInfo,
    value: string | boolean
  ) {
    const updatedBasicInfo = { ...profile.basicInfo, [key]: value };

    updateProfile({
      ...profile,
      basicInfo: updatedBasicInfo,
    });
  }

  const inputs: IDynamicInputArray<string> = [
    {
      label: t("common.form.full_name"),
      placeholder: t("common.placeholders.enter_full_name"),
      type: "text",
      value: profile.basicInfo.full_name,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("full_name", value);
      },
    },
    {
      label: t("common.form.email"),
      placeholder: t("common.placeholders.enter_email"),
      type: "email",
      value: profile.basicInfo.email,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("email", value);
      },
    },
    [
      {
        label: t("common.form.country_code"),
        type: "country_code",
        value: profile.basicInfo.country_code,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("country_code", value);
        },
      },
      {
        label: t("common.form.phone_number"),
        placeholder: "XXXXXXXXX",
        type: "phone_number",
        value: profile.basicInfo.phone_number,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("phone_number", value);
        },
      },
    ],
    [
      {
        label: t("common.form.your_location"),
        placeholder: t("common.placeholders.enter_location"),
        type: "text",
        value: profile.basicInfo.location,
        onValueChange: (value: string) => {
          onBasicUserInfoChange("location", value);
        },
      },
    ],
    {
      label: t("common.form.about"),
      placeholder: t("common.placeholders.enter_about"),
      type: "textarea",
      value: profile.basicInfo.about,
      onValueChange: (value: string) => {
        onBasicUserInfoChange("about", value);
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
