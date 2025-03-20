"use client";
import React from "react";
import {
  IDynamicInput,
  IDynamicInputArray,
} from "../DynamicInputs/DynamicInputs.types";
import { IProject, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";

const Projects: React.FC = () => {
  const { profile, updateProfile, syncProfile } = useProfile();
  const t = useTranslations();
  function onProjectChange(
    index: number,
    key: keyof IProject,
    value: string | boolean
  ) {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };

    if (key === "is_present" && value === true) {
      updatedProjects[index].end_date = "";
    }

    updateProfile({
      ...profile,
      projects: updatedProjects,
    });
  }

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

    updateProfile({
      ...profile,
      projects: [...profile.projects, project],
    });
  }

  function onRemovePage(index: number) {
    const updatedProjects = profile.projects.filter(
      (_, projectsIndex) => projectsIndex !== index
    );

    updateProfile({
      ...profile,
      projects: updatedProjects,
    });
  }

  return (
    <Paginator
      total={profile.projects.length}
      onNewPage={addNewProject}
      onRemovePage={onRemovePage}
      buttonLabel={t("pages.profile.sections.projects.add_project")}
    >
      {profile.projects.map((project, index) => {
        const isPresent = (): IDynamicInput<boolean> => {
          return {
            label: t("pages.profile.sections.projects.is_present"),
            type: "is_present",
            onValueChange: (value: boolean) => {
              onProjectChange(index, "is_present", value);
              syncProfile();
            },
            value: project?.is_present || "",
          };
        };

        const inputs: IDynamicInputArray<string & boolean> = [
          {
            label: t("common.form.project_name"),
            type: "text",
            placeholder: t("common.placeholders.enter_project_name"),
            onValueChange: (value: string) =>
              onProjectChange(index, "name", value),
            value: project?.name || "",
            isRequired: true,
            onBlur: syncProfile,
          },
          {
            label: t("common.form.link"),
            type: "text",
            placeholder: t("common.placeholders.enter_project_link"),
            onValueChange: (value: string) =>
              onProjectChange(index, "link", value),
            value: project?.link || "",
            onBlur: syncProfile,
          },
          {
            label: t("common.form.project_description"),
            type: "textarea",
            placeholder: t("common.placeholders.enter_project_description"),
            onValueChange: (value: string) =>
              onProjectChange(index, "description", value),
            value: project?.description || "",
            isRequired: true,
            description: `${project?.description.length} / 50`,
            onBlur: syncProfile,
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
          },
          [
            {
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) => {
                onProjectChange(index, "start_date", value);
                syncProfile();
              },
              value: project?.start_date || "",
              isRequired: true,
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) => {
                onProjectChange(index, "end_date", value);
                syncProfile();
              },
              value: project?.end_date || "",
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

export default Projects;
