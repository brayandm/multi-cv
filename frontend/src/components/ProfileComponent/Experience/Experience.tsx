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

const Experience: React.FC<IExperienceProps> = ({ formData, setFormData }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<Array<IExperience>>(
    new Array<IExperience>()
  );
  const [currentExperience, setCurrentExperience] = useState<number>(1);

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
        <div ref={childRef} className="flex gap-2 ">
          {experiences.map((experience, index) => {
            const isPresentJob = (): IDynamicInput<boolean> => {
              return {
                label: "I'm currently working here",
                type: "is_present",
                onValueChange: (value: boolean) =>
                  onExperienceChange(index, "is_present", value),
                value: experience?.is_present || "",
              };
            };
            const inputs: IDynamicInputArray<string & boolean> = [
              {
                label: "Company",
                type: "text",
                placeholder: "Company name",
                onValueChange: (value: string) =>
                  onExperienceChange(index, "company", value),
                value: experience?.company || "",
              },
              {
                label: "Role",
                type: "text",
                placeholder: "Your role in the company",
                onValueChange: (value: string) =>
                  onExperienceChange(index, "role", value),
                value: experience?.role || "",
              },
              {
                label: "Description",
                type: "textarea",
                placeholder:
                  "A description of your duties and responsibilities in the job",
                onValueChange: (value: string) =>
                  onExperienceChange(index, "description", value),
                value: experience?.description || "",
              },
              {
                label: "Country / City",
                type: "text",
                placeholder: 'The work location (you can also type "Remote")',
                onValueChange: (value: string) =>
                  onExperienceChange(index, "description", value),
                value: experience?.description || "",
              },
              [
                {
                  label: "Start Date",
                  type: "start_date",
                  onValueChange: (value: string) =>
                    onExperienceChange(index, "start_date", value),
                  value: experience?.start_date || "",
                },
                {
                  label: "End Date",
                  type: "end_date",
                  onValueChange: (value: string) =>
                    onExperienceChange(index, "end_date", value),
                  value: experience?.end_date || "",
                },
              ],

              isPresentJob(),
            ];
            return (
              <div key={index} className=" min-w-[400px] mb-4 mr-2 snap-center">
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
        Add Experience
      </Button>
    </section>
  );
};

export default Experience;
