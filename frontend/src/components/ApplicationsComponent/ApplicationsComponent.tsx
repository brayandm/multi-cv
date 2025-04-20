import { fetcherEngine } from "@/lib/backendService";
import { applicationsEngineLink } from "@/lib/links";
import { Application } from "@/lib/types";

import { Select, SelectItem, Spinner } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import useSWR from "swr";

const statusOptions = ["Applied", "Interview", "Offer", "Rejected"];

const statusToClass: Record<string, string> = {
  Applied:
    "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus:bg-gray-600",
  Interview:
    "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 focus:bg-yellow-300 dark:bg-yellow-500 dark:text-yellow-100 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400",
  Offer:
    "bg-green-200 text-green-800 hover:bg-green-300 focus:bg-green-300 dark:bg-green-500 dark:text-green-100 dark:hover:bg-green-400 dark:focus:bg-green-400",
  Rejected:
    "bg-red-200 text-red-800 hover:bg-red-300 focus:bg-red-300 dark:bg-red-500 dark:text-red-100 dark:hover:bg-red-400 dark:focus:bg-red-400",
};

export default function ApplicationsComponent() {
  const { data: applications, isLoading } = useSWR<Application[]>(
    applicationsEngineLink,
    fetcherEngine
  );

  const t = useTranslations();

  const [statuses, setStatuses] = useState<Record<string, string>>({});

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

  const handleStatusChange = (id: string, newStatus: string) => {
    console.log(`Status changed for ${id} to ${newStatus}`);
    setStatuses((prev) => ({
      ...prev,
      [id]: newStatus,
    }));
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
                      className="flex items-center w-[300px] sm:w-[600px] justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-4 w-full">
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
                            <Select
                              aria-label="Application status"
                              className={`sm:w-[140px] w-[100px] text-[10px]`}
                              size="sm"
                              selectedKeys={[
                                statuses[application.application_id] ||
                                  application.status,
                              ]}
                              onChange={(event) =>
                                handleStatusChange(
                                  application.application_id,
                                  event.target.value
                                )
                              }
                              classNames={{
                                label: "hidden",
                                popoverContent: "w-32",
                                listboxWrapper: "w-32",
                                listbox: "w-32 text-center",
                                selectorIcon: "hidden",
                                trigger: `flex  
                                  items-center justify-center p-0
                                ${
                                  statusToClass[
                                    statuses[application.application_id] ||
                                      application.status
                                  ]
                                }`,
                                value: "text-center",
                              }}
                            >
                              {statusOptions.map((status) => (
                                <SelectItem
                                  key={status}
                                  classNames={{
                                    selectedIcon: "hidden",
                                    base: "p-0",
                                  }}
                                  textValue={status}
                                >
                                  <div
                                    className={`flex justify-center items-center ${statusToClass[status]} rounded-md text-center w-full h-8`}
                                  >
                                    {status}
                                  </div>
                                </SelectItem>
                              ))}
                            </Select>
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
