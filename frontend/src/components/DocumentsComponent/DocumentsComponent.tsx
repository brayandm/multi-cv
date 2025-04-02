"use client";

import { fetcherEngine } from "@/lib/backendService";
import { documentsEngineLink } from "@/lib/links";
import { Document } from "@/lib/types";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

export default function DocumentsComponent() {
  const { data: documents, isLoading } = useSWR<Document[]>(
    documentsEngineLink,
    fetcherEngine
  );

  const t = useTranslations();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {isLoading || !documents ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Spinner variant="dots" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          {t("pages.home.tabs.documents.empty")}
        </p>
      ) : (
        <ul className="flex flex-col items-center space-y-4">
          {documents.map((doc: Document) => (
            <li
              key={doc.document_id}
              className="flex items-center w-[300px] justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary dark:bg-primary/20 p-2 rounded-full">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                    {doc.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {doc.type === "cv" ? "CV" : "Cover Letter"} ·{" "}
                    {(doc.size / 1024).toFixed(1)} KB ·{" "}
                    {new Date(doc.created_at).toLocaleDateString()}{" "}
                    {new Date(doc.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                </div>
              </div>

              <button
                // onClick={() => handleDownload(doc)}
                className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
              >
                <ArrowDownTrayIcon className="w-6 h-6" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
