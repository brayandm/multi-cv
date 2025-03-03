"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
  IExperience,
  IExperienceProps,
} from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { Button, Pagination } from "@heroui/react";
import { useTranslations } from "next-intl";

const Experience: React.FC<IExperienceProps> = ({ formData, setFormData }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<Array<IExperience>>(
    formData.experience
  );
  const [currentExperience, setCurrentExperience] = useState<number>(1);
  const t = useTranslations("ProfilePage.Experience");
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

  const scrollToExperience = (page: number) => {
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
    setExperiences([
      ...experiences,
      {
        company: "",
        description: "",
        end_date: "",
        start_date: "",
        is_present: false,
        location: "",
        role: "",
      },
    ]);
    setTimeout(() => {
      scrollToExperience(experiences.length + 1);
    }, 200);
  }

  /* Handle scroll events  - - - - - - - - - - - - - - - - - - - - - - - - - -  */
  useEffect(() => {
    let debounceTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      debounceTimeout = setTimeout(() => {
        if (scrollRef.current) {
          console.log((scrollRef.current.scrollLeft - 400) / 416 + 2);

          setCurrentExperience(
            Math.round((scrollRef.current.scrollLeft - 400) / 416 + 2)
          );
        }
      }, 50);
    };
    const element = scrollRef.current;
    element?.addEventListener("scroll", handleScroll);

    return () => {
      element?.removeEventListener("scroll", handleScroll);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, []);
  /* Handle scroll events  - - - - - - - - - - - - - - - - - - - - - - - - - -  */

  return (
    <section className={`w-full flex flex-col`}>
      <div
        ref={scrollRef}
        className="w-[400px] overflow-hidden snap-x snap-mandatory"
      >
        <div ref={childRef} className="flex gap-2">
          {experiences.map((experience, index) => {
            const isPresentJob = (): IDynamicInput<boolean> => {
              return {
                label: t("is-present"), // Nueva clave para "I'm currently working here"
                type: "is_present",
                onValueChange: (value: boolean) =>
                  onExperienceChange(index, "is_present", value),
                value: experience?.is_present || "",
              };
            };

            const inputs: IDynamicInputArray<string & boolean> = [
              {
                label: t("company.label"),
                type: "text",
                placeholder: t("company.placeholder"),
                onValueChange: (value: string) =>
                  onExperienceChange(index, "company", value),
                value: experience?.company || "",
              },
              {
                label: t("role.label"),
                type: "text",
                placeholder: t("role.placeholder"),
                onValueChange: (value: string) =>
                  onExperienceChange(index, "role", value),
                value: experience?.role || "",
              },
              {
                label: t("description.label"),
                type: "textarea",
                placeholder: t("description.placeholder"),
                onValueChange: (value: string) =>
                  onExperienceChange(index, "description", value),
                value: experience?.description || "",
              },
              {
                label: t("country-city.label"),
                type: "text",
                placeholder: t("country-city.placeholder"),
                onValueChange: (value: string) =>
                  onExperienceChange(index, "location", value),
                value: experience?.location || "",
              },
              [
                {
                  label: t("start-date.label"),
                  type: "start_date",
                  onValueChange: (value: string) =>
                    onExperienceChange(index, "start_date", value),
                  value: experience?.start_date || "",
                },
                {
                  label: t("end-date.label"),
                  type: "end_date",
                  onValueChange: (value: string) =>
                    onExperienceChange(index, "end_date", value),
                  value: experience?.end_date || "",
                },
              ],
              isPresentJob(),
            ];

            return (
              <div key={index} className="min-w-[400px] mb-4 mr-2 snap-center">
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
              scrollToExperience(page);
              setCurrentExperience(page);
            }}
            className="mb-2"
            isCompact
            showControls
            initialPage={1}
            page={currentExperience}
            total={experiences.length}
          />
        </div>
      )}
      <Button variant="bordered" color="primary" onPress={addNewExperience}>
        {t("add-button")}
      </Button>
    </section>
  );
};

export default Experience;
