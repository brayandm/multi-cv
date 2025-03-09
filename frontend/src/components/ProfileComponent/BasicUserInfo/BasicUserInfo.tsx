"use client";
import React, { useEffect, useState } from "react";
import { IDynamicInputArray, IProfileFrom } from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";

interface IBasicUserInfoProps {
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
  width: number;
}

const BasicUserInfo: React.FC<IBasicUserInfoProps> = (props) => {
  const [fullName, setFullName] = useState<string>(
    props.formData.basicInfo.full_name
  );
  const [about, setAbout] = useState<string>(props.formData.basicInfo.about);
  const [email, setEmail] = useState<string>(props.formData.basicInfo.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    props.formData.basicInfo.phone_number
  );
  const [countryCode, setCountryCode] = useState<string>(
    props.formData.basicInfo.country_code
  );
  const t = useTranslations();

  useEffect(() => {
    props.setFormData({
      ...props.formData,
      basicInfo: {
        about,
        email,
        full_name: fullName,
        phone_number: phoneNumber,
        country_code: countryCode,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, fullName, about, phoneNumber, countryCode]);

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
        value: fullName,
        onValueChange: setFullName,
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
