"use client";
import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import BasicUserInfo from "./BasicUserInfo";
import { IProfileFrom } from "./ProfileComponent.types";
import Experience from "./Experience";
import { useTranslations } from "next-intl";
import Skills from "./Skills";
import Projects from "./Projects";
import Socials from "./Socials";

const ProfileComponent: React.FC = () => {
  const width = 350;

  const [selectedSocials, setSelectedSocials] = useState<Array<string>>([]);
  const [formData, setFormData] = useState<IProfileFrom>({
    basicInfo: {
      about: "",
      email: "",
      full_name: "",
      country_code: "",
      phone_number: "",
    },
    socials: [],
    projects: [],
    experience: [],
    skills: [],
  });
  useEffect(() => {
    {
      console.log(formData);
    }
  }, [formData]);

  const t = useTranslations();

  return (
    <main className="flex justify-center">
      <div className={`max-w-[${width}px]`}>
        <form className="flex flex-col gap-2">
          <Card>
            <CardHeader className="pb-0 flex flex-col items-start">
              <div className="px-1 py-1">
                <h1>{t("common.menu.profile")}</h1>
                <p>{t("pages.profile.subtitle")}</p>
              </div>
            </CardHeader>
            <CardBody>
              <Tabs
                aria-label="Options"
                color="primary"
                classNames={{ base: "p-2" }}
              >
                <Tab
                  key="basic-user-info"
                  title={t("pages.profile.sections.basic_info.title")}
                >
                  <BasicUserInfo
                    formData={formData}
                    setFormData={setFormData}
                    width={width}
                  ></BasicUserInfo>
                </Tab>
                <Tab
                  key="socials"
                  title={t("pages.profile.sections.socials.title")}
                >
                  <Socials
                    formData={formData}
                    setFormData={setFormData}
                    width={width}
                    selectedSocials={selectedSocials}
                    setSelectedSocials={setSelectedSocials}
                  ></Socials>
                </Tab>
                <Tab
                  key="experiences"
                  title={t("pages.profile.sections.experience.title")}
                >
                  <Experience
                    width={width}
                    formData={formData}
                    setFormData={setFormData}
                  ></Experience>
                </Tab>
                <Tab
                  key="projects"
                  title={t("pages.profile.sections.projects.title")}
                >
                  <Projects
                    width={width}
                    formData={formData}
                    setFormData={setFormData}
                  ></Projects>
                </Tab>
                <Tab
                  key="skills"
                  title={t("pages.profile.sections.skills.title")}
                >
                  <Skills
                    width={width}
                    formData={formData}
                    setFormData={setFormData}
                  ></Skills>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          <Card className="mb-3">
            <Button color="primary">{t("common.buttons.next")}</Button>
          </Card>
        </form>
      </div>
    </main>
  );
};

export default ProfileComponent;
