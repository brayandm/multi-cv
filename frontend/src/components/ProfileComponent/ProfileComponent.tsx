"use client";
import { Button, Card, CardBody, CardHeader, Tab, Tabs } from "@heroui/react";
import React, { useEffect, useState } from "react";
import BasicUserInfo from "./BasicUserInfo";
import { IProfileFrom } from "./ProfileComponent.types";
import Experience from "./Experience";
import { useTranslations } from "next-intl";

const ProfileComponent: React.FC = () => {
  const width = 320;
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
      <div className={`max-w-[${width}px]`}>
        <form className="flex flex-col gap-2">
          <Card>
            <CardHeader className="flex flex-col items-start">
              <h1>{t("common.menu.profile")}</h1>
              <p>{t("pages.profile.subtitle")}</p>
            </CardHeader>
            <CardBody>
              <Tabs aria-label="Options" color="primary">
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
                  key="experiences"
                  title={t("pages.profile.sections.experience.title")}
                >
                  <Experience
                    width={width}
                    formData={formData}
                    setFormData={setFormData}
                  ></Experience>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>
          <Card>
            <Button color="primary">Next</Button>
          </Card>
        </form>
      </div>
    </main>
  );
};

export default ProfileComponent;
