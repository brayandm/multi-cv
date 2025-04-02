"use client";

import { documentsEngine } from "@/lib/backendService";
import { Document } from "@/lib/types";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function DocumentsComponent() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    documentsEngine()
      .then((response: AxiosResponse<Document[]>) => {
        setDocuments(response.data);
      })
      .catch((error: unknown) => {
        console.error("Error while fetching documents", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const t = useTranslations();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          <Spinner variant="dots" />
        </p>
      ) : documents.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          {t("pages.home.tabs.documents.empty")}
        </p>
      ) : (
        <ul className="space-y-4">
          {documents.map((doc) => (
            <li
              key={doc.document_id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary dark:bg-primary/20 p-2 rounded-full">
                  <DocumentTextIcon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {doc.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {doc.type === "cv" ? "CV" : "Cover Letter"} ·{" "}
                    {(doc.size / 1024).toFixed(1)} KB ·{" "}
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <button
                // onClick={() => handleDownload(doc)}
                className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                {t("common.buttons.download")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
