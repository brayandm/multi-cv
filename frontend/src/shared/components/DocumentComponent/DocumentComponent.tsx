"use client";

import {
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { addToast, Spinner } from "@heroui/react";
import { useState } from "react";
import { saveAs } from "file-saver";
import { documentDownloadEngine } from "@/lib/backendService";
import { useTranslations } from "next-intl";
import { Document } from "@/lib/types";

interface IDocumentComponentProps {
  document: Document;
}
export default function DocumentComponent({
  document,
}: IDocumentComponentProps) {
  const [downloading, setDownloading] = useState(false);

  const t = useTranslations();

  const handleDownload = async (doc: Document) => {
    setDownloading(true);

    try {
      const response = await documentDownloadEngine(doc.document_id);
      const blob = new Blob([response.data], { type: "application/pdf" });

      const contentDisposition = response.headers["content-disposition"];
      let filename = "cv.pdf";

      if (contentDisposition) {
        const utf8FilenameMatch = contentDisposition.match(
          /filename\*\=UTF-8''([^;]+)/
        );
        if (utf8FilenameMatch && utf8FilenameMatch[1]) {
          filename = decodeURIComponent(utf8FilenameMatch[1]);
        } else {
          const fallbackMatch = contentDisposition.match(/filename="(.+?)"/);
          if (fallbackMatch && fallbackMatch[1]) {
            filename = fallbackMatch[1];
          }
        }
      }

      saveAs(blob, filename);
    } catch (error) {
      console.error("Error while generating CV", error);
      addToast({
        title: t("common.errors.download_document"),
        description: t("common.errors.server"),
        color: "danger",
        timeout: 5000,
      });
    } finally {
      setDownloading(false);
    }
  };
  return (
    <>
      <div className="flex items-center w-[300px] justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 p-2 rounded-full">
            <DocumentTextIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
              {document.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {document.type === "cv"
                ? t("common.texts.cv")
                : t("common.texts.cover_letter")}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {(document.size / 1024).toFixed(1)} KB ·{" "}
              {new Date(document.created_at).toLocaleDateString()}{" "}
              {new Date(document.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleDownload(document)}
          className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
          disabled={downloading}
        >
          {downloading ? (
            <Spinner size="sm" />
          ) : (
            <ArrowDownTrayIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
}
