"use client";
import React from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IExperience, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";

import { useTranslations } from "next-intl";
import Paginator from "../Paginator";

const Experience: React.FC = () => {
  const { profile, updateProfile, syncProfile } = useProfile();

  const t = useTranslations();
  function onExperienceChange(
    index: number,
    key: keyof IExperience,
    value: string | boolean
  ) {
    const updatedExperiences = [...profile.experience];
    updatedExperiences[index] = { ...updatedExperiences[index], [key]: value };

    if (key === "is_present" && value === true) {
      updatedExperiences[index].end_date = "";
    }

    updateProfile({
      ...profile,
      experience: updatedExperiences,
    });
  }

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
    };

    updateProfile({
      ...profile,
      experience: [...profile.experience, experience],
    });
  }

  function onRemovePage(index: number) {
    const updatedExperiences = profile.experience.filter(
      (_, experienceIndex) => experienceIndex !== index
    );

    updateProfile({
      ...profile,
      experience: updatedExperiences,
    });
  }

  return (
    <Paginator
      total={profile.experience.length}
      onNewPage={addNewExperience}
      onRemovePage={onRemovePage}
      buttonLabel={t("pages.profile.sections.experience.add_experience")}
    >
      {profile.experience.map((experience, index) => {
        const isPresent = (): IDynamicInput<boolean> => {
          return {
            label: t("pages.profile.sections.experience.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) => {
              onExperienceChange(index, "is_present", value);
              syncProfile();
            },
            value: experience?.is_present || "",
          };
        };

        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: t("common.form.company_name"),
            type: "text",
            placeholder: t("common.placeholders.enter_company_name"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "company", value),
            value: experience?.company || "",
            isRequired: true,
            onBlur: syncProfile,
          },
          {
            label: t("common.form.link"),
            type: "text",
            placeholder: t("common.placeholders.enter_company_link"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "link", value),
            value: experience?.link || "",
            onBlur: syncProfile,
          },
          {
            label: t("common.form.role"),
            type: "text",
            placeholder: t("common.placeholders.enter_role"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "role", value),
            value: experience?.role || "",
            isRequired: true,
            onBlur: syncProfile,
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
            onBlur: syncProfile,
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
            onBlur: syncProfile,
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) => {
                onExperienceChange(index, "start_date", value);
                syncProfile();
              },
              value: experience?.start_date || "",
              isRequired: true,
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) => {
                onExperienceChange(index, "end_date", value);
                syncProfile();
              },
              value: experience?.end_date || "",
              isRequired: true,
            },
          ],
          isPresent(),
        ];

        return (
          <div key={index} className={`mb-4 px-1 snap-center `}>
            <div className="h-[320px] overflow-y-scroll">
              <DynamicInputs isPresent={isPresent()} inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Experience;
