"use client";

import { Tab, Tabs } from "@heroui/react";
import GenerateDocumentComponent from "../GenerateDocumentComponent/GenerateDocumentComponent";
import { useTranslations } from "next-intl";
import { useWindowSize } from "@/hooks/useWindowSize";
import { SCREEN_SIZES } from "@/lib/consts";

export default function GenerateDocumentComponentWrapper() {
  const t = useTranslations();

  const { width } = useWindowSize();

  const tabsContent = (
    <>
      <Tab
        key="simple"
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
        key="role"
        title={
          <div className="flex items-center space-x-2">
            <span>{t("pages.home.tabs.builder.tabs.based_on_role.title")}</span>
          </div>
        }
      >
        <div className="flex w-full h-[420px] flex-col items-center align-middle justify-center">
          <GenerateDocumentComponent key="role" type="role" />
        </div>
      </Tab>
      <Tab
        key="job"
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
    </>
  );

  return (
    <div className="flex w-full flex-col items-center">
      {width < SCREEN_SIZES.tablet ? (
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          placement={"bottom"}
          classNames={{
            tabWrapper: "w-full",
            base: "self-center w-full sm:w-auto",
            tabList: "flex flex-wrap sm:flex-nowrap w-full border-none",
            tab: "h-12 sm:h-8 w-full bg-white dark:bg-default-100 shadow-md",
            panel: "pt-0 py-0",
          }}
        >
          {tabsContent}
        </Tabs>
      ) : (
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          placement={"top"}
          classNames={{
            tabWrapper: "w-full",
            base: "self-center w-full flex items-center justify-center pt-16",
            tabList: "flex flex-wrap sm:flex-nowrap border-none gap-3",
            tab: "h-12 sm:h-8 w-full bg-white dark:bg-default-100 shadow-md",
            panel: "py-0 pt-12",
          }}
        >
          {tabsContent}
        </Tabs>
      )}
    </div>
  );
}
