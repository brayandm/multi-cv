import { fetcherEngine } from "@/lib/backendService";
import { applicationsEngineLink } from "@/lib/links";
import { Application } from "@/lib/types";

import { Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import useSWR from "swr";

function getStatusColor(status: string): string {
  switch (status) {
    case "Applied":
      return "bg-gray-200 text-gray-800";
    case "Interview":
      return "bg-yellow-200 text-yellow-800";
    case "Offer":
      return "bg-green-200 text-green-800";
    case "Rejected":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

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

  function getPastelColor(seed: string): string {
    const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 80%)`;
  }

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
                      <div className="flex items-center gap-4 w-full">
                        {/* Logo o inicial */}
                        {application.company_logo_link ? (
                          // eslint-disable-next-line
                          <img
                            src={application.company_logo_link}
                            alt={application.company_name ?? "Logo"}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-black font-bold text-sm"
                            style={{
                              backgroundColor: getPastelColor(
                                application.company_name || "?"
                              ),
                            }}
                          >
                            {(application.company_name || "?")[0].toUpperCase()}
                          </div>
                        )}

                        <div className="flex flex-col flex-grow">
                          <div className="flex flex-row justify-between items-start w-full">
                            <div>
                              <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                                {application.company_name || "Unknown Company"}
                              </h2>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {application.role || "Unknown Role"}
                              </p>
                            </div>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {application.status}
                            </span>
                          </div>

                          {application.location_type && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                              {application.location_type}
                            </p>
                          )}
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
