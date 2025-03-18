"use client";
import React from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IEducation, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";

const Education: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const t = useTranslations();
  function onEducationChange(
    index: number,
    key: keyof IEducation,
    value: string | boolean
  ) {
    const updatedEducations = [...profile.education];
    updatedEducations[index] = { ...updatedEducations[index], [key]: value };

    updateProfile({
      ...profile,
      education: updatedEducations,
    });
  }

  function addNewEducation() {
    const education: IEducation = {
      id: crypto.randomUUID(),
      institution: "",
      end_date: "",
      start_date: "",
      is_present: false,
      location: "",
      career: "",
    };

    updateProfile({
      ...profile,
      education: [...profile.education, education],
    });
  }

  return (
    <Paginator
      total={profile.education.length}
      onNewPage={addNewEducation}
      buttonLabel={t("pages.profile.sections.education.add_education")}
    >
      {profile.education.map((education, index) => {
        const isPresentJob = (): IDynamicInput<boolean> => {
          return {
            label: t("pages.profile.sections.education.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) =>
              onEducationChange(index, "is_present", value),
            value: education?.is_present || "",
          };
        };

        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: t("common.form.institution"),
            type: "text",
            placeholder: t("common.placeholders.enter_institution_name"),
            onValueChange: (value: string) =>
              onEducationChange(index, "institution", value),
            value: education?.institution || "",
          },
          {
            label: t("common.form.career"),
            type: "text",
            placeholder: t("common.placeholders.enter_career"),
            onValueChange: (value: string) =>
              onEducationChange(index, "career", value),
            value: education?.career || "",
          },
          {
            label: t("common.form.location"),
            type: "text",
            placeholder: t("common.placeholders.enter_institution_location"),
            onValueChange: (value: string) =>
              onEducationChange(index, "location", value),
            value: education?.location || "",
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) =>
                onEducationChange(index, "start_date", value),
              value: education?.start_date || "",
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) =>
                onEducationChange(index, "end_date", value),
              value: education?.end_date || "",
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

export default Education;
