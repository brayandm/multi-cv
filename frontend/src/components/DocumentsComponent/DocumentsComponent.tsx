import { documentDownloadEngine, fetcherEngine } from "@/lib/backendService";
import { documentsEngineLink } from "@/lib/links";
import { Document } from "@/lib/types";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { addToast, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { saveAs } from "file-saver";
import { useState } from "react";

export default function DocumentsComponent() {
  const { data: documents, isLoading } = useSWR<Document[]>(
    documentsEngineLink,
    fetcherEngine
  );

  const t = useTranslations();
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  const handleDownload = async (doc: Document) => {
    setDownloading((prev) => ({ ...prev, [doc.document_id]: true }));

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
      setDownloading((prev) => ({ ...prev, [doc.document_id]: false }));
    }
  };

  const groupByDate = (docs: Document[]) => {
    const grouped: Record<string, Document[]> = {};
    docs.forEach((doc) => {
      const date = new Date(doc.created_at).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(doc);
    });
    return grouped;
  };

  const groupedDocuments = documents ? groupByDate(documents) : {};

  const sortedDates = Object.keys(groupedDocuments).sort((a, b) => {
    const dateA = new Date(a.split("/").reverse().join("-")).getTime();
    const dateB = new Date(b.split("/").reverse().join("-")).getTime();
    return dateB - dateA;
  });

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
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date} className="w-full">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4 border-b pb-1 border-gray-300 dark:border-gray-600">
                {date}
              </h3>
              <ul className="flex flex-col items-center space-y-4">
                {groupedDocuments[date]
                  .slice()
                  .reverse()
                  .map((doc) => (
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
                            {doc.type === "cv"
                              ? t("common.texts.cv")
                              : t("common.texts.cover_letter")}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
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
                        onClick={() => handleDownload(doc)}
                        className="flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                        disabled={downloading[doc.document_id]}
                      >
                        {downloading[doc.document_id] ? (
                          <Spinner size="sm" />
                        ) : (
                          <ArrowDownTrayIcon className="w-6 h-6" />
                        )}
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
