"use client";
import { Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import BasicUserInfo from "./BasicUserInfo";
import { IProfileFrom } from "./ProfileComponent.types";
import Experience from "./Experience";
import { useTranslations } from "next-intl";

const ProfileComponent: React.FC = () => {
  const [formData, setFormData] = useState<IProfileFrom>({
    basicInfo: {
      about: "",
      email: "",
      full_name: "",
      country_code: "",
      phone_number: "",
    },
    experience: [],
  });
  useEffect(() => {
    {
      console.log(formData);
    }
  }, [formData]);

  const t = useTranslations();

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-[450px] px-5">
        <form>
          <Tabs aria-label="Options">
            <Tab
              key="basic-user-info"
              title={t("pages.profile.sections.basic_info.title")}
            >
              <BasicUserInfo
                formData={formData}
                setFormData={setFormData}
              ></BasicUserInfo>
            </Tab>
            <Tab
              key="experiences"
              title={t("pages.profile.sections.experience.title")}
            >
              <Experience
                formData={formData}
                setFormData={setFormData}
              ></Experience>
            </Tab>
          </Tabs>
        </form>
      </div>
    </main>
  );
};

export default ProfileComponent;
