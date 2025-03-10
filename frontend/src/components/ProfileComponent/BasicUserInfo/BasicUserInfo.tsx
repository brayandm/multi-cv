"use client";
import React, { useEffect, useState } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { useProfile } from "@/lib/ProfileContext";

const BasicUserInfo: React.FC = () => {
  const { profile, updateProfile } = useProfile();

  const [fullName, setFullName] = useState<string>(profile.basicInfo.full_name);
  const [location, setLocation] = useState<string>(profile.basicInfo.location);
  const [about, setAbout] = useState<string>(profile.basicInfo.about);
  const [email, setEmail] = useState<string>(profile.basicInfo.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    profile.basicInfo.phone_number
  );
  const [countryCode, setCountryCode] = useState<string>(
    profile.basicInfo.country_code
  );
  const t = useTranslations();

  useEffect(() => {
    updateProfile({
      ...profile,
      basicInfo: {
        location,
        about,
        email,
        full_name: fullName,
        phone_number: phoneNumber,
        country_code: countryCode,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, fullName, about, phoneNumber, countryCode, location]);

  const inputs: IDynamicInputArray<string> = [
    {
      label: t("common.form.full_name"),
      placeholder: t("common.placeholders.enter_full_name"),
      type: "text",
      value: fullName,
      onValueChange: setFullName,
    },
    {
      label: t("common.form.email"),
      placeholder: t("common.placeholders.enter_email"),
      type: "email",
      value: email,
      onValueChange: setEmail,
    },
    [
      {
        label: t("common.form.country_code"),
        type: "country_code",
        value: countryCode,
        onValueChange: setCountryCode,
      },
      {
        label: t("common.form.phone_number"),
        placeholder: "XXXXXXXXX",
        type: "phone_number",
        value: phoneNumber,
        onValueChange: setPhoneNumber,
      },
    ],
    [
      {
        label: t("common.form.your_location"),
        placeholder: t("common.placeholders.enter_location"),
        type: "text",
        value: location,
        onValueChange: setLocation,
      },
    ],
    {
      label: t("common.form.about"),
      placeholder: t("common.placeholders.enter_about"),
      type: "textarea",
      value: about,
      onValueChange: setAbout,
    },
  ];

  return (
    <div className="px-1">
      <DynamicInputs inputs={inputs}></DynamicInputs>
    </div>
  );
};

export default BasicUserInfo;
