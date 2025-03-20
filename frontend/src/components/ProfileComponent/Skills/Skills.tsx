"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { useProfile } from "@/contexts/ProfileContext";
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
    <Button variant="solid" isIconOnly onPress={props.onPress} color="primary">
      <AddIcon></AddIcon>
    </Button>
  );
};

const Skills: React.FC = () => {
  const { skills, updateSkills } = useProfile();
  const [inputSkill, setInputSkill] = useState<string>("");

  const { syncProfile } = useProfile();

  const t = useTranslations();

  const addSkill = useCallback(() => {
    if (inputSkill === "") return;

    updateSkills({
      list: [...skills.list, inputSkill],
    });

    syncProfile();

    setInputSkill("");
  }, [inputSkill, skills, updateSkills, syncProfile]);

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
      errorMessage: t("common.errors.skill_length", {
        min: 5,
      }),
      validate: () => {
        if (skills.list.length < 5) {
          return "error";
        }
      },
    },
  ];

  return (
    <div className="px-1">
      <DynamicInputs inputs={inputs}></DynamicInputs>
      <ChipArea
        chips={skills.list}
        setChips={(skills) => {
          updateSkills({ list: skills });
          syncProfile();
        }}
      ></ChipArea>
    </div>
  );
};

export default Skills;
