"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { addToast, Button } from "@heroui/react";
import ChipArea from "@/shared/components/ChipArea";
import AddIcon from "@/shared/icons/AddIcon/AddIcon";
import { MAX_SKILLS_ELEMENTS } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";

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

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

  const [inputSkill, setInputSkill] = useState<string>("");

  const { syncProfileOnFirstLogin } = useProfile();

  const t = useTranslations();

  const addSkill = useCallback(() => {
    if (inputSkill === "") return;

    if (skills.list.length >= MAX_SKILLS_ELEMENTS) {
      addToast({
        title: t("common.errors.max_elements", {
          element: t("common.texts.skills"),
        }),
        description: t("common.errors.max_elements_description", {
          element: t("common.texts.skills"),
          max: MAX_SKILLS_ELEMENTS,
        }),
        color: "warning",
        timeout: 5000,
      });
      return;
    }

    updateSkills({
      list: [...skills.list, inputSkill],
      notes: null,
    });

    syncProfileOnFirstLogin();

    setInputSkill("");
  }, [inputSkill, skills, updateSkills, syncProfileOnFirstLogin, t]);

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
      description: t("common.form.skill_description", { min: 5 }),
      errorMessage: t("common.errors.skill_length", {
        min: 5,
      }),
      isInvalid: skills.list.length >= 5 ? false : undefined,
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
      <div className="h-[320px] overflow-y-scroll">
        <ChipArea
          chips={skills.list}
          setChips={(skills) => {
            updateSkills({ list: skills, notes: null });
            syncProfileOnFirstLogin();
          }}
        ></ChipArea>
      </div>
    </div>
  );
};

export default Skills;
