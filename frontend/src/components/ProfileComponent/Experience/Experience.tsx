"use client";
import React, { useRef, useState } from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
  IExperience,
  IExperienceProps,
} from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { Button, Pagination } from "@heroui/react";
import { useTranslations } from "next-intl";

const Experience: React.FC<IExperienceProps> = ({
  formData,
  setFormData,
  width,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<Array<IExperience>>(
    formData.experience
  );
  const [currentExperience, setCurrentpage] = useState<number>(1);
  const t = useTranslations();
  function onExperienceChange(
    index: number,
    key: keyof IExperience,
    value: string | boolean
  ) {
    const updatedExperiences = [...experiences];
    updatedExperiences[index] = { ...updatedExperiences[index], [key]: value };

    setExperiences(updatedExperiences);
    setFormData({
      ...formData,
      experience: updatedExperiences,
    });
  }

  const scrollToPage = (page: number) => {
    if (!childRef.current) return;
    const children = childRef.current.children;
    const targetChild = children[page - 1] as HTMLElement;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  };
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

    setExperiences([...experiences, experience]);
    setFormData({
      ...formData,
      experience: [...experiences, experience],
    });
    setTimeout(() => {
      scrollToPage(experiences.length + 1);
      setCurrentpage(experiences.length + 1);
    }, 200);
  }

  return (
    <section className={`flex flex-col`}>
      <div ref={scrollRef} className="overflow-hidden snap-x snap-mandatory">
        <div ref={childRef} className="flex">
          {experiences.map((experience, index) => {
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
                label: t("common.form.company_description"),
                type: "textarea",
                placeholder: t("common.placeholders.enter_company_description"),
                onValueChange: (value: string) =>
                  onExperienceChange(index, "description", value),
                value: experience?.description || "",
              },
              {
                label: t("common.form.company_location"),
                type: "text",
                placeholder: t("common.placeholders.enter_company_location"),
                onValueChange: (value: string) =>
                  onExperienceChange(index, "location", value),
                value: experience?.location || "",
              },
              [
                {
                  label: t("common.form.company_start_date"),
                  type: "start_date",
                  onValueChange: (value: string) =>
                    onExperienceChange(index, "start_date", value),
                  value: experience?.start_date || "",
                },
                {
                  label: t("common.form.company_end_date"),
                  type: "end_date",
                  onValueChange: (value: string) =>
                    onExperienceChange(index, "end_date", value),
                  value: experience?.end_date || "",
                },
              ],
              isPresentJob(),
            ];

            return (
              <div
                key={index}
                className={`w-[calc(var(--initialWidth)-2*0.75rem-2*0.25rem)] mb-4 px-1 snap-center`}
                style={
                  { "--initialWidth": `${width}px` } as React.CSSProperties
                }
              >
                <DynamicInputs isPresentJob={isPresentJob()} inputs={inputs} />
              </div>
            );
          })}
        </div>
      </div>

      {experiences.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            onChange={(page) => {
              scrollToPage(page);
              setCurrentpage(page);
            }}
            className="mb-2"
            size="sm"
            isCompact
            showControls
            initialPage={1}
            page={currentExperience}
            total={experiences.length}
          />
        </div>
      )}
      <Button
        variant="bordered"
        color="primary"
        onPress={addNewExperience}
        className="mx-1"
      >
        {t("pages.profile.sections.experience.add_experience")}
      </Button>
    </section>
  );
};

export default Experience;
