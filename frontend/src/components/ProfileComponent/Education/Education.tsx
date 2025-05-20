"use client";
import React, { RefObject, useEffect } from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IEducation, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";
import { MAX_EDUCATION_ELEMENTS, SCREEN_SIZES } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { datesValidator } from "@/lib/dates";

interface IEducationProps {
  formRef: RefObject<HTMLFormElement | null>;
  width: number;
  maxWidth: number;
}

const Education = ({ formRef, width, maxWidth }: IEducationProps) => {
  const {
    education: educationList,
    updateEducation,
    syncProfileOnFirstLogin,
  } = useProfile();

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

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
    };

    updateEducation([...educationList, education]);
  }

  function onRemovePage(index: number) {
    const updatedEducations = educationList.filter(
      (_, educationIndex) => educationIndex !== index
    );

    updateEducation(updatedEducations);
  }

  const { width: windowWidth } = useWindowSize();

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
        const institutionInput: IDynamicInput<string & boolean> = {
          label: t("common.form.institution"),
          type: "text",
          placeholder: t("common.placeholders.enter_institution_name"),
          onValueChange: (value: string) =>
            onEducationChange(index, "institution", value),
          value: education?.institution || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const linkInput: IDynamicInput<string & boolean> = {
          label: t("common.form.link"),
          type: "text",
          placeholder: t("common.placeholders.enter_institution_link"),
          onValueChange: (value: string) =>
            onEducationChange(index, "link", value),
          value: education?.link || "",
          onBlur: syncProfileOnFirstLogin,
        };

        const careerInput: IDynamicInput<string & boolean> = {
          label: t("common.form.career"),
          type: "text",
          placeholder: t("common.placeholders.enter_career"),
          onValueChange: (value: string) =>
            onEducationChange(index, "career", value),
          value: education?.career || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const locationInput: IDynamicInput<string & boolean> = {
          label: t("common.form.location"),
          type: "text",
          placeholder: t("common.placeholders.enter_location"),
          onValueChange: (value: string) =>
            onEducationChange(index, "location", value),
          value: education?.location || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const startDateInput: IDynamicInput<string & boolean> = {
          label: t("common.form.start_date"),
          type: "month_selector",
          onValueChange: (value: string) => {
            onEducationChange(index, "start_date", value);
          },
          value: education?.start_date || "",
          isRequired: true,
          isInvalid: !education?.start_date,
        };

        const endDateInput: IDynamicInput<string & boolean> = {
          label: t("common.form.end_date"),
          type: "month_selector",
          onValueChange: (value: string) => {
            onEducationChange(index, "end_date", value);
          },
          isDisabled: education?.is_present,
          value: education?.end_date || "",
          isRequired: true,
          isInvalid: datesValidator(education?.start_date, education?.end_date)
            ? undefined
            : true,
          errorMessage: datesValidator(
            education?.start_date,
            education?.end_date
          )
            ? undefined
            : t("common.errors.dates_impossible"),
        };

        const isPresentInput: IDynamicInput<string & boolean> = {
          label: t("pages.profile.sections.education.is_present"),
          type: "checkbox",
          onValueChange: (value: boolean) => {
            onEducationChange(index, "is_present", value);
          },
          value: education?.is_present || "",
        };

        let inputs: IDynamicInputArray<string & boolean> = [];

        if (windowWidth < SCREEN_SIZES.sm) {
          inputs = [
            institutionInput,
            linkInput,
            careerInput,
            locationInput,
            [startDateInput, endDateInput],
            isPresentInput,
          ];
        } else {
          inputs = [
            [institutionInput, linkInput],
            careerInput,
            locationInput,
            [startDateInput, endDateInput],
            isPresentInput,
          ];
        }

        return (
          <div
            key={education.id}
            className={`mb-4 snap-center`}
            style={{
              minWidth: `calc(min(${maxWidth}vw, ${width}px) - 32px)`,
            }}
          >
            <div className="h-[300px] overflow-y-auto overflow-x-hidden px-1">
              <DynamicInputs inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Education;
