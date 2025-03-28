"use client";
import React, { RefObject, useEffect } from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IProject, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";
import { MAX_PROJECTS_ELEMENTS } from "@/lib/consts";
import { useChat } from "@/contexts/ChatContext";

interface IProjectsProps {
  formRef: RefObject<HTMLFormElement | null>;
  width: number;
  maxWidth: number;
}

const Projects = ({ formRef, width, maxWidth }: IProjectsProps) => {
  const { projects, updateProjects, syncProfileOnFirstLogin } = useProfile();

  const { setChat } = useChat();

  useEffect(() => {
    setChat(null);
  }, [setChat]);

  const [sync, setSync] = React.useState(false);

  const t = useTranslations();
  function onProjectChange(
    index: number,
    key: keyof IProject,
    value: string | boolean
  ) {
    const updatedProjects = [...projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };

    if (key === "is_present" && value === true) {
      updatedProjects[index].end_date = "";
    }

    if (key === "is_present" || key === "start_date" || key === "end_date") {
      setSync(true);
    }

    updateProjects(updatedProjects);
  }

  useEffect(() => {
    if (sync) {
      syncProfileOnFirstLogin();
      setSync(false);
    }
  }, [syncProfileOnFirstLogin, sync]);

  function addNewProject() {
    const project = {
      id: crypto.randomUUID(),
      name: "",
      link: "",
      description: "",
      start_date: "",
      end_date: "",
      is_present: false,
    };

    updateProjects([...projects, project]);
  }

  function onRemovePage(index: number) {
    const updatedProjects = projects.filter(
      (_, projectsIndex) => projectsIndex !== index
    );

    updateProjects(updatedProjects);
  }

  return (
    <Paginator
      total={projects.length}
      onNewPage={addNewProject}
      onRemovePage={onRemovePage}
      maxElements={MAX_PROJECTS_ELEMENTS}
      formRef={formRef}
      elementName={t("pages.profile.sections.projects.element")}
    >
      {projects.map((project, index) => {
        const projectNameInput: IDynamicInput<string & boolean> = {
          label: t("common.form.project_name"),
          type: "text",
          placeholder: t("common.placeholders.enter_project_name"),
          onValueChange: (value: string) =>
            onProjectChange(index, "name", value),
          value: project?.name || "",
          isRequired: true,
          onBlur: syncProfileOnFirstLogin,
        };

        const linkInput: IDynamicInput<string & boolean> = {
          label: t("common.form.link"),
          type: "text",
          placeholder: t("common.placeholders.enter_project_link"),
          onValueChange: (value: string) =>
            onProjectChange(index, "link", value),
          value: project?.link || "",
          onBlur: syncProfileOnFirstLogin,
        };

        const projectDescriptionInput: IDynamicInput<string & boolean> = {
          label: t("common.form.project_description"),
          type: "textarea",
          placeholder: t("common.placeholders.enter_project_description"),
          onValueChange: (value: string) =>
            onProjectChange(index, "description", value),
          value: project?.description || "",
          isRequired: true,
          description: `${project?.description.length} / 50`,
          onBlur: syncProfileOnFirstLogin,
          errorMessage: t("common.errors.length", {
            field: t("common.form.project_description"),
            length: 50,
            current_length: project?.description.length,
          }),
          validate: (value) => {
            if (value.length < 50) {
              return "error";
            }
          },
        };

        const startDateInput: IDynamicInput<string & boolean> = {
          label: t("common.form.start_date"),
          type: "month_selector",
          onValueChange: (value: string) => {
            onProjectChange(index, "start_date", value);
          },
          value: project?.start_date || "",
          isRequired: true,
        };

        const endDateInput: IDynamicInput<string & boolean> = {
          label: t("common.form.end_date"),
          type: "month_selector",
          onValueChange: (value: string) => {
            onProjectChange(index, "end_date", value);
          },
          isDisabled: project?.is_present,
          value: project?.end_date || "",
          isRequired: true,
        };

        const isPresentInput: IDynamicInput<string & boolean> = {
          label: t("pages.profile.sections.projects.is_present"),
          type: "checkbox",
          onValueChange: (value: boolean) => {
            onProjectChange(index, "is_present", value);
          },
          value: project?.is_present || "",
        };

        const inputs: IDynamicInputArray<string & boolean> = [
          projectNameInput,
          linkInput,
          projectDescriptionInput,
          [startDateInput, endDateInput],
          isPresentInput,
        ];

        return (
          <div
            key={index}
            className={`mb-4 px-1 snap-center`}
            style={{
              minWidth: `calc(min(${maxWidth}vw, ${width}px) - 32px)`,
            }}
          >
            <div className="h-[320px] overflow-y-auto overflow-x-hidden">
              <DynamicInputs inputs={inputs} />
            </div>
          </div>
        );
      })}
    </Paginator>
  );
};

export default Projects;
