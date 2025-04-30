import { Select, SelectItem } from "@heroui/react";
import { useTranslations } from "next-intl";
import React from "react";

export const statusOptions = [
  "none",
  "applied",
  "test_scheduled",
  "test_completed",
  "interview_scheduled",
  "interview_completed",
  "offer_extended",
  "offer_accepted",
  "offer_declined",
  "application_withdrawn",
  "rejected",
] as const;

const baseColors: Record<string, string> = {
  none: "gray",
  applied: "gray",
  test_scheduled: "blue",
  test_completed: "blue",
  interview_scheduled: "yellow",
  interview_completed: "yellow",
  offer_extended: "green",
  offer_accepted: "green",
  offer_declined: "purple",
  application_withdrawn: "purple",
  rejected: "red",
};

export const statusToClass: Record<string, string> = Object.fromEntries(
  Object.entries(baseColors).map(([status, color]) => {
    const isGray = color === "gray";

    const darkBg = isGray ? "gray-700" : `${color}-500`;
    const darkHover = isGray ? "gray-600" : `${color}-400`;

    return [
      status,
      [
        `bg-${color}-200`,
        `text-${color}-800`,
        `hover:bg-${color}-300`,
        `focus:bg-${color}-300`,
        `dark:bg-${darkBg}`,
        `dark:text-${color}-100`,
        `dark:hover:bg-${darkHover}`,
        `dark:focus:bg-${darkHover}`,
      ].join(" "),
    ];
  })
);

interface IApplicationStatusComponentProps {
  status: string;
  onChange: (newStatus: string) => void;
}
const ApplicationStatusComponent = ({
  status,
  onChange,
}: IApplicationStatusComponentProps) => {
  const t = useTranslations();

  const statusTranslations = {
    none: t("common.application_status.none"),
    applied: t("common.application_status.applied"),
    test_scheduled: t("common.application_status.test_scheduled"),
    test_completed: t("common.application_status.test_completed"),
    interview_scheduled: t("common.application_status.interview_scheduled"),
    interview_completed: t("common.application_status.interview_completed"),
    offer_extended: t("common.application_status.offer_extended"),
    offer_accepted: t("common.application_status.offer_accepted"),
    offer_declined: t("common.application_status.offer_declined"),
    application_withdrawn: t("common.application_status.application_withdrawn"),
    rejected: t("common.application_status.rejected"),
  };

  return (
    <Select
      aria-label="Application status"
      className={`w-[100px] sm:w-[200px]  text-[10px]`}
      size="sm"
      selectedKeys={[status]}
      renderValue={(items) => {
        return items.map(
          (item) =>
            statusTranslations[
              item.textValue! as keyof typeof statusTranslations
            ]
        );
      }}
      onChange={(event) => onChange(event.target.value as string)}
      classNames={{
        label: "hidden",
        popoverContent: "w-[200px]",
        listboxWrapper: "w-[200px]",
        listbox: "w-[200px] text-center",
        selectorIcon: "hidden",
        trigger: `flex  
    items-center justify-center p-0
  ${statusToClass[status]}`,
        value: "text-center",
      }}
      popoverProps={{
        classNames: {
          base: "relative right-[100px] sm:right-0 sm:block ",
          content: "w-[200px]",
        },
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
            className={`flex justify-center items-center ${statusToClass[status]} rounded-md text-center w-full h-12`}
          >
            {statusTranslations[status]}
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};

export default ApplicationStatusComponent;
