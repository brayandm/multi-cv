"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IDynamicInputArray, IProfileFrom } from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { Button } from "@heroui/react";
import ChipArea from "@/shared/components/ChipArea";
import AddIcon from "@/shared/icons/AddIcon/AddIcon";

interface InputButtonProps {
  onPress: () => void;
}

const InputButton: React.FC<InputButtonProps> = (props) => {
  return (
    <Button variant="shadow" isIconOnly onPress={props.onPress} color="primary">
      <AddIcon></AddIcon>
    </Button>
  );
};

interface IBasicUserInfoProps {
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
  width: number;
}

const Skills: React.FC<IBasicUserInfoProps> = (props) => {
  const [inputSkill, setInputSkill] = useState<string>("");
  const [skillsArray, setSkillsArray] = useState<Array<string>>(
    props.formData.skills
  );
  const t = useTranslations();

  const addSkill = useCallback(() => {
    if (inputSkill === "") return;

    setSkillsArray((prevSkills) => [...prevSkills, inputSkill]);
    setInputSkill("");
  }, [inputSkill]);

  useEffect(() => {
    props.setFormData({
      ...props.formData,
      skills: [...skillsArray],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skillsArray]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addSkill]);

  const inputs: IDynamicInputArray<string> = [
    {
      label: t("common.form.skill"),
      placeholder: t("common.placeholders.enter_skill"),
      type: "text",
      value: inputSkill,
      endContent: <InputButton onPress={addSkill}></InputButton>,
      onValueChange: setInputSkill,
    },
  ];

  return (
    <div className="px-1">
      <DynamicInputs inputs={inputs}></DynamicInputs>
      <ChipArea chips={skillsArray} setChips={setSkillsArray}></ChipArea>
    </div>
  );
};

export default Skills;
