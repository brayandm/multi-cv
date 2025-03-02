"use client";
import React, { useEffect, useState } from "react";
import { IDynamicInputArray, IProfileFrom } from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs";

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
      label: "Full name",
      placeholder: "John Doe",
      type: "text",
      value: fullName,
      onValueChange: setFullName,
    },
    {
      label: "Email",
      placeholder: "john@example.doe",
      type: "email",
      value: email,
      onValueChange: setEmail,
    },
    [
      {
        label: "Country",
        type: "country_code",
        value: countryCode,
        onValueChange: setCountryCode,
      },
      {
        label: "Phone number",
        placeholder: "XXXXXXXXX",
        type: "phone_number",
        value: phoneNumber,
        onValueChange: setPhoneNumber,
      },
    ],
    {
      label: "About you",
      placeholder: "I have done...",
      type: "textarea",
      value: about,
      onValueChange: setAbout,
    },
  ];

  return <DynamicInputs inputs={inputs}></DynamicInputs>;
};

export default BasicUserInfo;
