"use client";
import React, { useEffect, useState } from "react";
import { IDynamicInputArray, IProfileFrom } from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";

interface IBasicUserInfoProps {
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
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
  const t = useTranslations("ProfilePage.BasicUserInfo");

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
      label: t("full-name.label"),
      placeholder: t("full-name.placeholder"),
      type: "text",
      value: fullName,
      onValueChange: setFullName,
    },
    {
      label: t("email.label"),
      placeholder: t("email.placeholder"),
      type: "email",
      value: email,
      onValueChange: setEmail,
    },
    [
      {
        label: t("country.label"),
        type: "country_code",
        value: countryCode,
        onValueChange: setCountryCode,
      },
      {
        label: t("phone.label"),
        placeholder: "XXXXXXXXX",
        type: "phone_number",
        value: phoneNumber,
        onValueChange: setPhoneNumber,
      },
    ],
    {
      label: t("about.label"),
      placeholder: t("about.placeholder"),
      type: "textarea",
      value: about,
      onValueChange: setAbout,
    },
  ];

  return <DynamicInputs inputs={inputs}></DynamicInputs>;
};

export default BasicUserInfo;
