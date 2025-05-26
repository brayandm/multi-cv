"use client";

// import CvList from "../../shared/components/CvList";
// import { CV } from "@/lib/types";
import { Tab, Tabs } from "@heroui/react";

import DocumentsComponent from "../DocumentsComponent";
import { useTranslations } from "next-intl";
import GenerateDocumentComponentWrapper from "../GenerateDocumentComponentWrapper";
import ApplicationsComponent from "../ApplicationsComponent";
import { useWindowSize } from "@/hooks/useWindowSize";
import { SCREEN_SIZES } from "@/lib/consts";

export default function HomeComponent() {
  const t = useTranslations();

  const { width } = useWindowSize();

  const tabsContent = (
    <>
      <Tab
        key="builder"
        title={
          <div className="flex items-center space-x-2">
            <span>{t("pages.home.tabs.builder.title")}</span>
          </div>
        }
      >
        <div className="w-full xl:pr-48 items-center overflow-y-auto h-[calc(100vh-113px)] md:h-[calc(100vh-64px)]">
          <GenerateDocumentComponentWrapper />
        </div>
      </Tab>
      <Tab
        key="applications"
        title={
          <div className="flex items-center space-x-2">
            <span>{t("pages.home.tabs.applications.title")}</span>
          </div>
        }
      >
        <div className="w-full xl:pr-48 items-center overflow-y-auto h-[calc(100vh-113px)] md:h-[calc(100vh-64px)]">
          <ApplicationsComponent />
        </div>
      </Tab>
      <Tab
        key="documents"
        title={
          <div className="flex items-center space-x-2">
            <span>{t("pages.home.tabs.documents.title")}</span>
          </div>
        }
      >
        <div className="w-full xl:pr-48 items-center overflow-y-auto h-[calc(100vh-113px)] md:h-[calc(100vh-64px)]">
          <DocumentsComponent />
        </div>
      </Tab>
    </>
  );

  return (
    <main className="">
      <div className="flex justify-center"></div>
      <div className="flex w-full flex-col">
        {width < SCREEN_SIZES.md ? (
          <Tabs
            aria-label="Options"
            classNames={{
              tabList:
                "flex justify-evenly flex-row mt-16 gap-x-0 sm:justify-center sm:gap-x-16 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-primary",
              tab: "w-full sm:max-w-fit h-12 flex justify-center items-center",
              tabContent: "group-data-[selected=true]:text-primary",
              panel: "pt-0 pb-0",
            }}
            color="primary"
            variant="underlined"
          >
            {tabsContent}
          </Tabs>
        ) : (
          <Tabs
            aria-label="Options"
            classNames={{
              tabList:
                "flex justify-start align-start dark:bg-default-100 bg-default-100 h-screen w-48 gap-x-0 relative rounded-none p-0 pt-20 border-b border-divider",
              cursor: "w-40 bg-primary",
              tab: "w-full sm:max-w-fit h-12 flex justify-center items-center",
              tabContent: "group-data-[selected=true]:text-primary",
              panel: "w-full pt-16",
            }}
            color="primary"
            variant="underlined"
            isVertical={true}
          >
            {tabsContent}
          </Tabs>
        )}
      </div>
    </main>
  );
}
