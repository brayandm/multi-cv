"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { useProfile } from "@/lib/ProfileContext";
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
    <Button
      variant="shadow"
      className="shadow-md"
      isIconOnly
      onPress={props.onPress}
      color="primary"
    >
      <AddIcon></AddIcon>
    </Button>
  );
};

const Skills: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const [inputSkill, setInputSkill] = useState<string>("");

  const t = useTranslations();

  const addSkill = useCallback(() => {
    if (inputSkill === "") return;

    updateProfile({
      ...profile,
      skills: [...profile.skills, inputSkill],
    });
    setInputSkill("");
  }, [inputSkill, profile, updateProfile]);

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
      <ChipArea
        chips={profile.skills}
        setChips={(skills) => updateProfile({ ...profile, skills })}
      ></ChipArea>
    </div>
  );
};

export default Skills;
