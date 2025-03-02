"use client";
import React, { useEffect, useState } from "react";
import { IDynamicInput, IProfileFrom } from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs";

interface IBasicUserInfoProps {
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
}

const BasicUserInfo: React.FC<IBasicUserInfoProps> = (props) => {
  const [full_name, setFull_name] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    props.setFormData({
      ...props.formData,
      basicInfo: {
        about,
        email,
        full_name,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, full_name, about]);

  const inputs: IDynamicInput<string>[] = [
    {
      label: "Full name",
      placeholder: "John Doe",
      type: "email",
      value: props.formData.basicInfo.full_name,
      onValueChange: setFull_name,
    },
    {
      label: "Email",
      placeholder: "john@example.doe",
      type: "email",
      value: email,
      onValueChange: setEmail,
    },
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
