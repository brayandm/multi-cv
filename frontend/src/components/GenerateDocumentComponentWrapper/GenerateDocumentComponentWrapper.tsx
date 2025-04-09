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
          tab: "h-12 sm:h-8 w-full",
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
          <div className="flex w-full h-96 flex-col items-center">
            <GenerateDocumentComponent />
          </div>
        </Tab>
        <Tab
          key="music"
          title={
            <div className="flex items-center space-x-2">
              <span>
                {t("pages.home.tabs.builder.tabs.optimized_role.title")}
              </span>
            </div>
          }
        >
          {" "}
          <div className="flex w-full h-96 flex-col items-center"></div>
        </Tab>
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <span>
                {t("pages.home.tabs.builder.tabs.based_on_offer.title")}
              </span>
            </div>
          }
        >
          {" "}
          <div className="flex w-full h-96 flex-col items-center"></div>
        </Tab>
      </Tabs>
    </div>
  );
}
