"use client";
import { Input, Tab, Tabs } from "@heroui/react";
import React, { useState } from "react";
import MailIcon from "../shared/icons/MailIcon/MailIcon";
import BasicUserInfo from "./BasicUserInfo";
import { IProfileFrom } from "./ProfileComponent.types";
import Experience from "./Experience";

const ProfileComponent: React.FC = () => {
  const [formData, setFormData] = useState<IProfileFrom>({
    basicInfo: { about: "", email: "", full_name: "" },
    experience: [],
  });
  return (
    <main className="flex justify-center">
      <div className="w-full max-w-[450px] px-5">
        <form>
          <Tabs aria-label="Options">
            <Tab key="basic-user-info" title="Personal">
              <BasicUserInfo
                formData={formData}
                setFormData={setFormData}
              ></BasicUserInfo>
            </Tab>
            <Tab key="experiences" title="Experience">
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
