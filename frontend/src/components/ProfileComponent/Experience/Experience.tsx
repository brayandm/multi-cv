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
  const { profile, updateProfile } = useProfile();

  const t = useTranslations();
  function onExperienceChange(
    index: number,
    key: keyof IExperience,
    value: string | boolean
  ) {
    const updatedExperiences = [...profile.experience];
    updatedExperiences[index] = { ...updatedExperiences[index], [key]: value };

    updateProfile({
      ...profile,
      experience: updatedExperiences,
    });
  }

  function addNewExperience() {
    const experience = {
      company: "",
      description: "",
      end_date: "",
      start_date: "",
      is_present: false,
      location: "",
      role: "",
    };

    updateProfile({
      ...profile,
      experience: [...profile.experience, experience],
    });
  }

  return (
    <Paginator
      total={profile.experience.length}
      onNewPage={addNewExperience}
      buttonLabel={t("pages.profile.sections.experience.add_experience")}
    >
      {profile.experience.map((experience, index) => {
        const isPresentJob = (): IDynamicInput<boolean> => {
          return {
            label: t("pages.profile.sections.experience.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) =>
              onExperienceChange(index, "is_present", value),
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
          },
          {
            label: t("common.form.role"),
            type: "text",
            placeholder: t("common.placeholders.enter_role"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "role", value),
            value: experience?.role || "",
          },
          {
            label: t("common.form.description"),
            type: "textarea",
            placeholder: t("common.placeholders.enter_job_description"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "description", value),
            value: experience?.description || "",
          },
          {
            label: t("common.form.location"),
            type: "text",
            placeholder: t("common.placeholders.enter_location"),
            onValueChange: (value: string) =>
              onExperienceChange(index, "location", value),
            value: experience?.location || "",
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) =>
                onExperienceChange(index, "start_date", value),
              value: experience?.start_date || "",
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) =>
                onExperienceChange(index, "end_date", value),
              value: experience?.end_date || "",
            },
          ],
          isPresentJob(),
        ];

        return (
          <div key={index} className={`mb-4 px-1 snap-center`}>
            <DynamicInputs isPresentJob={isPresentJob()} inputs={inputs} />
          </div>
        );
      })}
    </Paginator>
  );
};

export default Experience;
