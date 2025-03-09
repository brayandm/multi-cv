"use client";
import React, { useRef, useState } from "react";
import {
  IDynamicInputArray,
  IProject,
  IExperienceProps,
} from "../ProfileComponent.types";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { Button, Pagination } from "@heroui/react";
import { useTranslations } from "next-intl";

const Projects: React.FC<IExperienceProps> = ({
  formData,
  setFormData,
  width,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Array<IProject>>(formData.projects);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const t = useTranslations();
  function onProjectChange(
    index: number,
    key: keyof IProject,
    value: string | boolean
  ) {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };

    setProjects(updatedProjects);
    setFormData({
      ...formData,
      projects: updatedProjects,
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
  function addNewProject() {
    const project = {
      name: "",
      description: "",
      end_date: "",
      start_date: "",
      link: "",
    };

    setProjects([...projects, project]);
    setFormData({
      ...formData,
      projects: [...projects, project],
    });
    setTimeout(() => {
      scrollToPage(projects.length + 1);
      setCurrentPage(projects.length + 1);
    }, 200);
  }

  return (
    <section className={` flex flex-col`}>
      <div ref={scrollRef} className="overflow-hidden snap-x snap-mandatory">
        <div ref={childRef} className="flex">
          {projects.map((project, index) => {
            const inputs: IDynamicInputArray<string & boolean> = [
              {
                label: t("common.form.project_name"),
                type: "text",
                placeholder: t("common.placeholders.enter_project_name"),
                onValueChange: (value: string) =>
                  onProjectChange(index, "name", value),
                value: project?.name || "",
              },
              {
                label: t("common.form.project_description"),
                type: "textarea",
                placeholder: t("common.placeholders.enter_project_description"),
                onValueChange: (value: string) =>
                  onProjectChange(index, "description", value),
                value: project?.description || "",
              },
              [
                {
                  label: t("common.form.company_start_date"),
                  type: "start_date",
                  onValueChange: (value: string) =>
                    onProjectChange(index, "start_date", value),
                  value: project?.start_date || "",
                },
                {
                  label: t("common.form.company_end_date"),
                  type: "end_date",
                  onValueChange: (value: string) =>
                    onProjectChange(index, "end_date", value),
                  value: project?.end_date || "",
                },
              ],

              {
                label: t("common.form.project_link"),
                type: "text",
                placeholder: t("common.placeholders.enter_project_link"),
                onValueChange: (value: string) =>
                  onProjectChange(index, "link", value),
                value: project?.link || "",
              },
            ];

            return (
              <div
                key={index}
                className={`w-[calc(var(--initialWidth)-2*0.75rem-2*0.25rem)] mb-4 px-1 snap-center`}
                style={
                  { "--initialWidth": `${width}px` } as React.CSSProperties
                }
              >
                <DynamicInputs inputs={inputs} />
              </div>
            );
          })}
        </div>
      </div>

      {projects.length > 0 && (
        <div className="flex justify-center">
          <Pagination
            onChange={(page) => {
              scrollToPage(page);
              setCurrentPage(page);
            }}
            className="mb-2"
            size="sm"
            isCompact
            showControls
            initialPage={1}
            page={currentPage}
            total={projects.length}
          />
        </div>
      )}
      <Button
        variant="bordered"
        color="primary"
        onPress={addNewProject}
        className="mx-1"
      >
        {t("pages.profile.sections.projects.add_project")}
      </Button>
    </section>
  );
};

export default Projects;
