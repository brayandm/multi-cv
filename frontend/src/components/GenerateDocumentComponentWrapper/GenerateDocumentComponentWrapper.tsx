"use client";

import { Tab, Tabs } from "@heroui/react";
import GenerateDocumentComponent from "../GenerateDocumentComponent/GenerateDocumentComponent";
import { useTranslations } from "next-intl";

export default function GenerateDocumentComponentWrapper() {
  const t = useTranslations();

  return (
    <div className="flex w-full flex-col items-center">
      <Tabs
        aria-label="Options"
        color="primary"
        variant="bordered"
        placement="bottom"
        classNames={{
          tabWrapper: "w-full",
          base: "self-center w-full sm:w-auto",
          tabList: "flex flex-wrap sm:flex-nowrap w-full",
          tab: "h-12 sm:h-8 w-full dark:bg-default-100",
          panel: "pt-0",
        }}
      >
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <span>{t("pages.home.tabs.builder.tabs.simple_cv.title")}</span>
            </div>
          }
        >
          <div className="flex w-full h-[420px] flex-col items-center align-middle justify-center">
            <GenerateDocumentComponent key="simple" />
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>
                {t("pages.home.tabs.builder.tabs.based_on_role.title")}
              </span>
            </div>
          }
        >
          <div className="flex w-full h-[420px] flex-col items-center align-middle justify-center">
            <GenerateDocumentComponent key="role" type="role" />
          </div>
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>
                {t("pages.home.tabs.builder.tabs.based_on_job_post.title")}
              </span>
            </div>
          }
        >
          <div className="flex w-full h-[420px] flex-col items-center align-middle justify-center">
            <GenerateDocumentComponent key="job" type="job" />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
