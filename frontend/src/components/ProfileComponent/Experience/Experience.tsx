"use client";
import React, { useEffect, useState } from "react";
import { IProfileFrom } from "../ProfileComponent.types";
import DynamicInputs, { IDynamicInput } from "../DynamicInputs/DynamicInputs";

interface IExperienceProps {
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
}

const Experience: React.FC<IExperienceProps> = (props) => {
  const [full_name, setFull_name] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    props.setFormData({
      ...props.formData,
      experience: [],
    });

    console.log(email, full_name, about);
  }, [email, full_name, about, props]);

  const inputs: IDynamicInput[] = [
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

export default Experience;
