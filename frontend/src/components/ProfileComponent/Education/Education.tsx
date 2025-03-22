"use client";
import React, { RefObject, useEffect } from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { IEducation, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";
import { MAX_EDUCATION_ELEMENTS } from "@/lib/consts";

interface IEducationProps {
  formRef: RefObject<HTMLFormElement | null>;
}

const Education = ({ formRef }: IEducationProps) => {
  const {
    education: educationList,
    updateEducation,
    syncProfileOnFirstLogin,
  } = useProfile();

  const [sync, setSync] = React.useState(false);

  const t = useTranslations();
  function onEducationChange(
    index: number,
    key: keyof IEducation,
    value: string | boolean
  ) {
    const updatedEducations = [...educationList];
    updatedEducations[index] = { ...updatedEducations[index], [key]: value };

    if (key === "is_present" && value === true) {
      updatedEducations[index].end_date = "";
    }

    if (key === "is_present" || key === "start_date" || key === "end_date") {
      setSync(true);
    }

    updateEducation(updatedEducations);
  }

  useEffect(() => {
    if (sync) {
      syncProfileOnFirstLogin();
      setSync(false);
    }
  }, [syncProfileOnFirstLogin, sync]);

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
      notes: null,
    };

    updateEducation([...educationList, education]);
  }

  function onRemovePage(index: number) {
    const updatedEducations = educationList.filter(
      (_, educationIndex) => educationIndex !== index
    );

    updateEducation(updatedEducations);
  }

  return (
    <Paginator
      total={educationList.length}
      onNewPage={addNewEducation}
      onRemovePage={onRemovePage}
      maxElements={MAX_EDUCATION_ELEMENTS}
      formRef={formRef}
      elementName={t("pages.profile.sections.education.element")}
    >
      {educationList.map((education, index) => {
        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: t("common.form.institution"),
            type: "text",
            placeholder: t("common.placeholders.enter_institution_name"),
            onValueChange: (value: string) =>
              onEducationChange(index, "institution", value),
            value: education?.institution || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.link"),
            type: "text",
            placeholder: t("common.placeholders.enter_institution_link"),
            onValueChange: (value: string) =>
              onEducationChange(index, "link", value),
            value: education?.link || "",
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.career"),
            type: "text",
            placeholder: t("common.placeholders.enter_career"),
            onValueChange: (value: string) =>
              onEducationChange(index, "career", value),
            value: education?.career || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          {
            label: t("common.form.location"),
            type: "text",
            placeholder: t("common.placeholders.enter_location"),
            onValueChange: (value: string) =>
              onEducationChange(index, "location", value),
            value: education?.location || "",
            isRequired: true,
            onBlur: syncProfileOnFirstLogin,
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) => {
                onEducationChange(index, "start_date", value);
              },
              value: education?.start_date || "",
              isRequired: true,
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) => {
                onEducationChange(index, "end_date", value);
              },
              isDisabled: education?.is_present,
              value: education?.end_date || "",
              isRequired: true,
            },
          ],
          {
            label: t("pages.profile.sections.education.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) => {
              onEducationChange(index, "is_present", value);
            },
            value: education?.is_present || "",
          },
        ];

        return (
          <div key={index} className={`mb-4 px-1 snap-center`}>
            <div className="h-[320px] overflow-y-scroll">
              <DynamicInputs inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Education;
