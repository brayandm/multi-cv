import { fetcherEngine } from "@/lib/backendService";
import { applicationsEngineLink } from "@/lib/links";
import { Application } from "@/lib/types";

import { Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

export default function ApplicationsComponent() {
  const { data: applications, isLoading } = useSWR<Application[]>(
    applicationsEngineLink,
    fetcherEngine
  );

  const t = useTranslations();

  const groupByDate = (applications: Application[]) => {
    const grouped: Record<string, Application[]> = {};
    applications.forEach((application) => {
      const date = new Date(application.application_date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(application);
    });
    return grouped;
  };

  const groupedApplications = applications ? groupByDate(applications) : {};

  const parseDDMMYYYY = (dateStr: string): Date => {
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  };

  const sortedDates = Object.keys(groupedApplications).sort((a, b) => {
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
      {isLoading || !applications ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Spinner variant="dots" />
        </div>
      ) : applications.length === 0 ? (
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
                {groupedApplications[date]
                  .slice()
                  .reverse()
                  .map((application) => (
                    <li
                      key={application.application_id}
                      className="flex items-center w-[300px] justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                            {application.company_name}
                          </h2>
                        </div>
                      </div>
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
