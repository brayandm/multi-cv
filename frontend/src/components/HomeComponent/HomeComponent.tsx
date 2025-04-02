"use client";

import { fetcherApi } from "@/lib/backendService";
import { userApiLink } from "@/lib/links";

import useSWR from "swr";
// import CvList from "../../shared/components/CvList";
// import { CV } from "@/lib/types";
import { Tab, Tabs } from "@heroui/react";

import GenerateDocumentComponent from "../GenerateDocumentComponent";
import DocumentsComponent from "../DocumentsComponent";

export default function HomeComponent() {
  const { isLoading: isUserDataLoading } = useSWR(userApiLink, fetcherApi);

  if (isUserDataLoading) {
    return null;
  }

  return (
    <main className="">
      <div className="flex justify-center"></div>
      <div className="flex w-full flex-col">
        <Tabs
          aria-label="Options"
          classNames={{
            tabList:
              "flex justify-evenly flex-row mt-16 gap-x-0 sm:justify-center sm:gap-x-16 w-full relative rounded-none p-0 border-b border-divider",
            cursor: "w-full bg-primary",
            tab: "max-w-fit px-0 h-12",
            tabContent: "group-data-[selected=true]:text-primary",
          }}
          color="primary"
          variant="underlined"
        >
          <Tab
            key="main"
            title={
              <div className="flex items-center space-x-2">
                <span>CV Builder</span>
              </div>
            }
          >
            <GenerateDocumentComponent />
          </Tab>
          <Tab
            key="music"
            title={
              <div className="flex items-center space-x-2">
                <span>Applications</span>
              </div>
            }
          />
          <Tab
            key="videos"
            title={
              <div className="flex items-center space-x-2">
                <span>Documents</span>
              </div>
            }
          >
            <DocumentsComponent />
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
