"use client";
import React, { useRef, useState } from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IPaginatorProps } from "../Paginator/Paginator.types";
import { IEducation, useProfile } from "@/lib/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { Button, Pagination } from "@heroui/react";
import { useTranslations } from "next-intl";

const Education: React.FC<IPaginatorProps> = ({ width }) => {
  const { profile, updateProfile } = useProfile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [educations, setEducations] = useState<Array<IEducation>>(
    profile.education
  );
  const [currentEducation, setCurrentpage] = useState<number>(1);
  const t = useTranslations();
  function onEducationChange(
    index: number,
    key: keyof IEducation,
    value: string | boolean
  ) {
    const updatedEducations = [...educations];
    updatedEducations[index] = { ...updatedEducations[index], [key]: value };

    setEducations(updatedEducations);
    updateProfile({
      ...profile,
      education: updatedEducations,
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
  function addNewEducation() {
    const education: IEducation = {
      institution: "",
      end_date: "",
      start_date: "",
      is_present: false,
      location: "",
      career: "",
    };

    setEducations([...educations, education]);
    updateProfile({
      ...profile,
      education: [...educations, education],
    });
    setTimeout(() => {
      scrollToPage(educations.length + 1);
      setCurrentpage(educations.length + 1);
    }, 200);
  }

  return (
    <section className={`flex flex-col`}>
      <div ref={scrollRef} className="overflow-hidden snap-x snap-mandatory">
        <div ref={childRef} className="flex">
          {educations.map((education, index) => {
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
                placeholder: t(
                  "common.placeholders.enter_institution_location"
                ),
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

      {educations.length > 0 && (
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
            page={currentEducation}
            total={educations.length}
          />
        </div>
      )}
      <Button
        variant="bordered"
        color="primary"
        onPress={addNewEducation}
        className="mx-1"
      >
        {t("pages.profile.sections.education.add")}
      </Button>
    </section>
  );
};

export default Education;
