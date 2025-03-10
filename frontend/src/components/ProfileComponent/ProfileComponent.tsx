"use client";
import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useRef, useState } from "react";
import BasicUserInfo from "./BasicUserInfo";
import { useProfile } from "@/lib/ProfileContext";
import Experience from "./Experience";
import { useTranslations } from "next-intl";
import Skills from "./Skills";
import Projects from "./Projects";
import Socials from "./Socials";
import Education from "./Education";

const ProfileComponent: React.FC = () => {
  const width = 350;
  const [selectedSocials, setSelectedSocials] = useState<Array<string>>([]);

  const { profile, updateProfile } = useProfile();

  const t = useTranslations();

  const [selectedTab, setSelectedTab] =
    useState<keyof typeof mapPosition>("basic-user-info");

  const mapPosition = React.useMemo(
    () => ({
      "basic-user-info": 0,
      socials: 1,
      experiences: 2,
      educations: 3,
      projects: 4,
      skills: 5,
    }),
    []
  );
  const positions = Object.keys(mapPosition) as Array<keyof typeof mapPosition>;
  const nextPositionIsAvailable = () => {
    return mapPosition[selectedTab] + 1 < positions.length;
  };

  const ref = useRef<HTMLDivElement>(null);

  const smoothScroll = (start: number, end: number, duration: number) => {
    let startTime: number | null = null;

    function animationStep(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeInOutQuad =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      if (ref.current) {
        ref.current.scrollLeft = start + (end - start) * easeInOutQuad;
      }

      if (progress < 1) {
        requestAnimationFrame(animationStep);
      }
    }

    requestAnimationFrame(animationStep);
  };

  useEffect(() => {
    if (!ref.current) return;

    const index = mapPosition[selectedTab] - 1;
    if (index < 0) return;

    const positionChild =
      ref.current.children[index].getBoundingClientRect().left;
    const positionParent = ref.current.getBoundingClientRect().left;
    const targetScroll =
      ref.current.scrollLeft + (positionChild - positionParent - 4);

    smoothScroll(ref.current.scrollLeft, targetScroll, 700);
  }, [selectedTab, mapPosition]);

  return (
    <main className="flex justify-center">
      <div className={`max-w-[${width}px]`}>
        <form className="flex flex-col gap-2">
          <Card className="min-h-[75vh]">
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
                classNames={{ base: "p-2", tabList: "" }}
                selectedKey={selectedTab}
                onSelectionChange={(key) => {
                  setSelectedTab(key as keyof typeof mapPosition);
                }}
                ref={ref}
              >
                <Tab
                  key="basic-user-info"
                  title={t("pages.profile.sections.basic_info.title")}
                >
                  <BasicUserInfo
                    formData={profile}
                    setFormData={updateProfile}
                    width={width}
                  ></BasicUserInfo>
                </Tab>
                <Tab
                  key="socials"
                  title={t("pages.profile.sections.socials.title")}
                >
                  <Socials
                    formData={profile}
                    setFormData={updateProfile}
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
                    formData={profile}
                    setFormData={updateProfile}
                  ></Experience>
                </Tab>
                <Tab
                  key="educations"
                  title={t("pages.profile.sections.education.title")}
                >
                  <Education
                    width={width}
                    formData={profile}
                    setFormData={updateProfile}
                  ></Education>
                </Tab>
                <Tab
                  key="projects"
                  title={t("pages.profile.sections.projects.title")}
                >
                  <Projects
                    width={width}
                    formData={profile}
                    setFormData={updateProfile}
                  ></Projects>
                </Tab>
                <Tab
                  key="skills"
                  title={t("pages.profile.sections.skills.title")}
                >
                  <Skills
                    width={width}
                    formData={profile}
                    setFormData={updateProfile}
                  ></Skills>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          <Card className="mb-3">
            {nextPositionIsAvailable() && (
              <Button
                onPress={() =>
                  setSelectedTab(positions[mapPosition[selectedTab] + 1])
                }
                color="primary"
              >
                {t("common.buttons.next")}
              </Button>
            )}
          </Card>
        </form>
      </div>
    </main>
  );
};

export default ProfileComponent;
