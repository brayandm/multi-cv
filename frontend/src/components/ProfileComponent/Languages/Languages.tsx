"use client";
import React, { useCallback, useEffect, useState } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs";
import { useTranslations } from "next-intl";
import { addToast, Button } from "@heroui/react";
import AddIcon from "@/shared/icons/AddIcon/AddIcon";
import { MAX_LANGUAGES_ELEMENTS } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";
import { XMarkIcon } from "@heroicons/react/24/solid";

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

const Languages: React.FC = () => {
  const { languages, updateLanguages } = useProfile();

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

  const [inputLanguage, setInputLanguage] = useState<string>("");

  const { syncProfileOnFirstLogin } = useProfile();

  const t = useTranslations();

  const addLanguage = useCallback(() => {
    if (inputLanguage === "") return;

    if (languages.length >= MAX_LANGUAGES_ELEMENTS) {
      addToast({
        title: t("common.errors.max_elements", {
          element: t("common.texts.languages"),
        }),
        description: t("common.errors.max_elements_description", {
          element: t("common.texts.languages"),
          max: MAX_LANGUAGES_ELEMENTS,
        }),
        color: "warning",
        timeout: 5000,
      });
      return;
    }

    updateLanguages([
      ...languages,
      {
        name: inputLanguage,
        level: "",
      },
    ]);

    syncProfileOnFirstLogin();

    setInputLanguage("");
  }, [inputLanguage, languages, updateLanguages, syncProfileOnFirstLogin, t]);

  const languageLevels = [
    { label: t("common.texts.basic"), key: "Basic" },
    { label: t("common.texts.intermediate"), key: "Intermediate" },
    { label: t("common.texts.professional"), key: "Professional" },
    { label: t("common.texts.native"), key: "Native" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();

        addLanguage();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addLanguage]);

  const inputs: IDynamicInputArray<string> = [
    {
      label: t("common.form.language"),
      placeholder: t("common.placeholders.enter_language"),
      type: "text",
      value: inputLanguage,
      endContent: <InputButton onPress={addLanguage}></InputButton>,
      onValueChange: setInputLanguage,
    },
  ];

  const languagesComponentes = languages.map((language, index) => {
    const inputs: IDynamicInputArray<string> = [
      {
        type: "selector",
        placeholder: t("common.placeholders.select_language_level"),
        value: language.name,
        onValueChange: (value: string) => {
          console.log("onValueChange", value);
          const updatedLanguages = [...languages];
          updatedLanguages[index].level = value;
          updateLanguages(updatedLanguages);
        },
        selectItems: languageLevels,
        isRequired: true,
        onBlur: syncProfileOnFirstLogin,
        text: language.name,
        afterContent: (
          <div className="flex pt-2">
            <Button
              variant="solid"
              isIconOnly
              className="ml-2 min-w-6 w-6 h-6 rounded-small"
              onPress={() => {
                const updatedLanguages = languages.filter(
                  (lang, langIndex) => langIndex !== index
                );
                updateLanguages(updatedLanguages);
              }}
              color="danger"
            >
              <XMarkIcon width={15} />
            </Button>
          </div>
        ),
      },
    ];

    return (
      <div key={index} className="mb-4">
        <DynamicInputs inputs={inputs}></DynamicInputs>
      </div>
    );
  });

  return (
    <div className="px-1">
      <DynamicInputs inputs={inputs}></DynamicInputs>
      <div className="mt-5 h-[320px] overflow-y-auto overflow-x-hidden">
        {languagesComponentes}
      </div>
    </div>
  );
};

export default Languages;
