"use client";
import React from "react";
import { IDynamicInputArray } from "../DynamicInputs/DynamicInputs.types";
import { IProject, useProfile } from "@/contexts/ProfileContext";
import DynamicInputs from "../DynamicInputs/DynamicInputs";
import { useTranslations } from "next-intl";
import Paginator from "../Paginator";

const Projects: React.FC = () => {
  const { profile, updateProfile } = useProfile();
  const t = useTranslations();
  function onProjectChange(
    index: number,
    key: keyof IProject,
    value: string | boolean
  ) {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = { ...updatedProjects[index], [key]: value };

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
    };

    updateProfile({
      ...profile,
      projects: [...profile.projects, project],
    });
  }

  return (
    <Paginator
      total={profile.projects.length}
      onNewPage={addNewProject}
      buttonLabel={t("pages.profile.sections.projects.add_project")}
    >
      {profile.projects.map((project, index) => {
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
            label: t("common.form.link"),
            type: "text",
            placeholder: t("common.placeholders.enter_project_link"),
            onValueChange: (value: string) =>
              onProjectChange(index, "link", value),
            value: project?.link || "",
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
              label: t("common.form.start_date"),
              type: "start_date",
              onValueChange: (value: string) =>
                onProjectChange(index, "start_date", value),
              value: project?.start_date || "",
            },
            {
              label: t("common.form.end_date"),
              type: "end_date",
              onValueChange: (value: string) =>
                onProjectChange(index, "end_date", value),
              value: project?.end_date || "",
            },
          ],
        ];

        return (
          <div key={index} className={`mb-4 px-1 snap-center`}>
            <DynamicInputs inputs={inputs} />
          </div>
        );
      })}
    </Paginator>
  );
};

export default Projects;
