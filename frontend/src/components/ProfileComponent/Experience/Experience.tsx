"use client";
import React, { RefObject, useEffect } from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IExperience, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";

import { useTranslations } from "next-intl";
import Paginator from "../Paginator";
import { MAX_EXPERIENCE_ELEMENTS, SCREEN_SIZES } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";
import { useWindowSize } from "@/hooks/useWindowSize";
import { datesValidator } from "@/lib/dates";

interface IExperienceProps {
  formRef: RefObject<HTMLFormElement | null>;
  width: number;
  maxWidth: number;
}

const Experience = ({ formRef, width, maxWidth }: IExperienceProps) => {
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
    };

    updateExperience([...experienceList, experience]);
  }

  function onRemovePage(index: number) {
    const updatedExperiences = experienceList.filter(
      (_, experienceIndex) => experienceIndex !== index
    );

    updateExperience(updatedExperiences);
  }

  const [currentPage, setCurrentPage] = React.useState(1);

  const onPageChange = React.useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const experience = experienceList[currentPage - 1];

    if (
      experience &&
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
  }, [currentPage, experienceList]); // eslint-disable-line

  const { width: windowWidth } = useWindowSize();

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
        const companyNameInput: IDynamicInput<string & boolean> = {
          label: t("common.form.company_name"),
          type: "text",
          placeholder: t("common.placeholders.enter_company_name"),
          onValueChange: (value: string) =>
            onExperienceChange(index, "company", value),
          value: experience?.company || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const linkInput: IDynamicInput<string & boolean> = {
          label: t("common.form.link"),
          type: "text",
          placeholder: t("common.placeholders.enter_company_link"),
          onValueChange: (value: string) =>
            onExperienceChange(index, "link", value),
          value: experience?.link || "",
          onBlur: syncProfileOnFirstLogin,
        };

        const roleInput: IDynamicInput<string & boolean> = {
          label: t("common.form.role"),
          type: "text",
          placeholder: t("common.placeholders.enter_role"),
          onValueChange: (value: string) =>
            onExperienceChange(index, "role", value),
          value: experience?.role || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const descriptionInput: IDynamicInput<string & boolean> = {
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
        };

        const locationInput: IDynamicInput<string & boolean> = {
          label: t("common.form.location"),
          type: "text",
          placeholder: t("common.placeholders.enter_location"),
          onValueChange: (value: string) =>
            onExperienceChange(index, "location", value),
          value: experience?.location || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const startDateInput: IDynamicInput<string & boolean> = {
          label: t("common.form.start_date"),
          type: "month_selector",
          onValueChange: (value: string) => {
            onExperienceChange(index, "start_date", value);
          },
          value: experience?.start_date || "",
          isRequired: true,
          isInvalid: !experience?.start_date,
        };

        const endDateInput: IDynamicInput<string & boolean> = {
          label: t("common.form.end_date"),
          type: "month_selector",
          onValueChange: (value: string) => {
            onExperienceChange(index, "end_date", value);
          },
          value: experience?.end_date || "",
          isDisabled: experience?.is_present,
          isRequired: true,
          isInvalid: datesValidator(
            experience?.start_date,
            experience?.end_date
          )
            ? undefined
            : true,
          errorMessage: datesValidator(
            experience?.start_date,
            experience?.end_date
          )
            ? undefined
            : t("common.errors.dates_impossible"),
        };

        const isPresentInput: IDynamicInput<string & boolean> = {
          label: t("pages.profile.sections.experience.is_present"),
          type: "checkbox",
          onValueChange: (value: boolean) => {
            onExperienceChange(index, "is_present", value);
          },
          value: experience?.is_present || "",
        };

        let inputs: IDynamicInputArray<string & boolean> = [];

        if (windowWidth < SCREEN_SIZES.mobile) {
          inputs = [
            companyNameInput,
            linkInput,
            roleInput,
            descriptionInput,
            locationInput,
            [startDateInput, endDateInput],
            isPresentInput,
          ];
        } else {
          inputs = [
            [companyNameInput, linkInput],
            [roleInput, locationInput],
            descriptionInput,
            [startDateInput, endDateInput],
            isPresentInput,
          ];
        }

        return (
          <div
            key={experience.id}
            className={`mb-4 snap-center`}
            style={{
              minWidth: `calc(min(${maxWidth}vw, ${width}px) - 32px)`,
            }}
          >
            <div className={`h-[300px] overflow-y-auto px-1`}>
              <DynamicInputs inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Experience;
