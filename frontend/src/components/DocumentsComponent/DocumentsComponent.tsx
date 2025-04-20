import { fetcherEngine } from "@/lib/backendService";
import { documentsEngineLink } from "@/lib/links";
import { Document } from "@/lib/types";
import DocumentComponent from "@/shared/components/DocumentComponent";
import { Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

export default function DocumentsComponent() {
  const { data: documents, isLoading } = useSWR<Document[]>(
    documentsEngineLink,
    fetcherEngine
  );

  const t = useTranslations();

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

  const parseDDMMYYYY = (dateStr: string): Date => {
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  };

  const sortedDates = Object.keys(groupedDocuments).sort((a, b) => {
    const dateA = parseDDMMYYYY(a);
    const dateB = parseDDMMYYYY(b);
    return dateB.getTime() - dateA.getTime();
  });

  const formatFullDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
                {formatFullDate(date)}
              </h3>
              <ul className="flex flex-col items-center space-y-4">
                {groupedDocuments[date]
                  .slice()
                  .reverse()
                  .map((doc) => (
                    <li key={doc.document_id}>
                      <DocumentComponent document={doc} />
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
