"use client";
import React, { RefObject, useEffect } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { IExperience, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";

import { useTranslations } from "next-intl";
import Paginator from "../Paginator";
import { MAX_EXPERIENCE_ELEMENTS } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";

interface IExperienceProps {
  formRef: RefObject<HTMLFormElement | null>;
}

const Experience = ({ formRef }: IExperienceProps) => {
  const {
    experience: experienceList,
    updateExperience,
    syncProfileOnFirstLogin,
  } = useProfile();

  const { setChat } = useChat();

  const [sync, setSync] = React.useState(false);

  const t = useTranslations();
  function onExperienceChange(
    index: number,
    key: keyof IExperience,
    value: string | boolean
  ) {
    const updatedExperiences = [...experienceList];
    updatedExperiences[index] = { ...updatedExperiences[index], [key]: value };

    if (key === "is_present" && value === true) {
      updatedExperiences[index].end_date = "";
    }

    if (key === "is_present" || key === "start_date" || key === "end_date") {
      setSync(true);
    }

    updateExperience(updatedExperiences);
  }

  useEffect(() => {
    if (sync) {
      syncProfileOnFirstLogin();
      setSync(false);
    }
  }, [syncProfileOnFirstLogin, sync]);

  function addNewExperience() {
    const experience = {
      id: crypto.randomUUID(),
      company: "",
      link: "",
      role: "",
      location: "",
      description: "",
      start_date: "",
      end_date: "",
      is_present: false,
      notes: null,
    };

    updateExperience([...experienceList, experience]);
  }

  function onRemovePage(index: number) {
    const updatedExperiences = experienceList.filter(
      (_, experienceIndex) => experienceIndex !== index
    );

    updateExperience(updatedExperiences);
  }

  const onPageChange = React.useCallback(
    (page: number) => {
      const experience = experienceList[page - 1];

      if (
        experience.company.length > 0 &&
        experience.role.length > 0 &&
        experience.location.length > 0 &&
        experience.description.length >= 50 &&
        experience.start_date.length > 0 &&
        (experience.end_date.length > 0 || experience.is_present)
      ) {
        setChat({ type: "experience", id: experience.id });
      } else {
        setChat(null);
      }
    },
    [setChat, experienceList]
  );

  return (
    <Paginator
      total={experienceList.length}
      onNewPage={addNewExperience}
      onRemovePage={onRemovePage}
      maxElements={MAX_EXPERIENCE_ELEMENTS}
      onPageChange={onPageChange}
      formRef={formRef}
      elementName={t("pages.profile.sections.experience.element")}
    >
      {experienceList.map((experience, index) => {
        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: t("common.form.company_name"),
            type: "text",
            placeholder: t("common.placeholders.enter_company_name"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "company", value),
            value: experience?.company || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.link"),
            type: "text",
            placeholder: t("common.placeholders.enter_company_link"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "link", value),
            value: experience?.link || "",
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.role"),
            type: "text",
            placeholder: t("common.placeholders.enter_role"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "role", value),
            value: experience?.role || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.company_description"),
            type: "textarea",
            placeholder: t("common.placeholders.enter_job_description"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "description", value),
            value: experience?.description || "",
            isRequired: true,
            description: `${experience?.description.length} / 50`,
            onBlur: syncProfileOnFirstLogin,
            errorMessage: t("common.errors.length", {
              field: t("common.form.company_description"),
              length: 50,
              current_length: experience?.description.length,
            }),
            validate: (value) => {
              if (value.length < 50) {
                return "error";
              }
            },
          },
          {
            label: t("common.form.location"),
            type: "text",
            placeholder: t("common.placeholders.enter_location"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "location", value),
            value: experience?.location || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) => {
                onExperienceChange(index, "start_date", value);
              },
              value: experience?.start_date || "",
              isRequired: true,
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) => {
                onExperienceChange(index, "end_date", value);
              },
              value: experience?.end_date || "",
              isDisabled: experience?.is_present,
              isRequired: true,
            },
          ],
          {
            label: t("pages.profile.sections.experience.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) => {
              onExperienceChange(index, "is_present", value);
            },
            value: experience?.is_present || "",
          },
        ];

        return (
          <div key={index} className={`mb-4 px-1 snap-center `}>
            <div className="h-[320px] overflow-y-scroll">
              <DynamicInputs inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Experience;
