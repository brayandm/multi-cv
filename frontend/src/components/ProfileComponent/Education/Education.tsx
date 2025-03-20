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
  const { profile, updateProfile, syncProfile } = useProfile();
  const t = useTranslations();
  function onEducationChange(
    index: number,
    key: keyof IEducation,
    value: string | boolean
  ) {
    const updatedEducations = [...profile.education];
    updatedEducations[index] = { ...updatedEducations[index], [key]: value };

    if (key === "is_present" && value === true) {
      updatedEducations[index].end_date = "";
    }

    updateProfile({
      ...profile,
      education: updatedEducations,
    });
  }

  function addNewEducation() {
    const education: IEducation = {
      id: crypto.randomUUID(),
      institution: "",
      link: "",
      career: "",
      location: "",
      start_date: "",
      end_date: "",
      is_present: false,
    };

    updateProfile({
      ...profile,
      education: [...profile.education, education],
    });
  }

  function onRemovePage(index: number) {
    const updatedEducations = profile.education.filter(
      (_, educationIndex) => educationIndex !== index
    );

    updateProfile({
      ...profile,
      education: updatedEducations,
    });
  }

  return (
    <Paginator
      total={profile.education.length}
      onNewPage={addNewEducation}
      onRemovePage={onRemovePage}
      buttonLabel={t("pages.profile.sections.education.add_education")}
    >
      {profile.education.map((education, index) => {
        const isPresent = (): IDynamicInput<boolean> => {
          return {
            label: t("pages.profile.sections.education.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) => {
              onEducationChange(index, "is_present", value);
              syncProfile();
            },
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
            isRequired: true,
            onBlur: syncProfile,
          },
          {
            label: t("common.form.link"),
            type: "text",
            placeholder: t("common.placeholders.enter_institution_link"),
            onValueChange: (value: string) =>
              onEducationChange(index, "link", value),
            value: education?.link || "",
            onBlur: syncProfile,
          },
          {
            label: t("common.form.career"),
            type: "text",
            placeholder: t("common.placeholders.enter_career"),
            onValueChange: (value: string) =>
              onEducationChange(index, "career", value),
            value: education?.career || "",
            isRequired: true,
            onBlur: syncProfile,
          },
          {
            label: t("common.form.location"),
            type: "text",
            placeholder: t("common.placeholders.enter_institution_location"),
            onValueChange: (value: string) =>
              onEducationChange(index, "location", value),
            value: education?.location || "",
            isRequired: true,
            onBlur: syncProfile,
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) => {
                onEducationChange(index, "start_date", value);
                syncProfile();
              },
              value: education?.start_date || "",
              isRequired: true,
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) => {
                onEducationChange(index, "end_date", value);
                syncProfile();
              },
              value: education?.end_date || "",
              isRequired: true,
            },
          ],
          isPresent(),
        ];

        return (
          <div key={index} className={`mb-4 px-1 snap-center`}>
            <div className="h-[320px] overflow-y-scroll">
              <DynamicInputs isPresent={isPresent()} inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Education;
