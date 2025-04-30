import { capitalizeWords } from "@/lib/strings";
import { Select, SelectItem } from "@heroui/react";
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
  return (
    <Select
      aria-label="Application status"
      className={`sm:w-[200px] w-[100px] text-[10px]`}
      size="sm"
      selectedKeys={[status]}
      renderValue={(items) => {
        return items.map((item) => capitalizeWords(item.textValue!));
      }}
      onChange={(event) => onChange(event.target.value as string)}
      classNames={{
        label: "hidden",
        popoverContent: "sm:w-[200px] w-[100px]",
        listboxWrapper: "sm:w-[200px] w-[100px]",
        listbox: "sm:w-[200px] w-[100px] text-center",
        selectorIcon: "hidden",
        trigger: `flex  
    items-center justify-center p-0
  ${statusToClass[status]}`,
        value: "text-center",
      }}
      popoverProps={{}}
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
            className={`flex justify-center items-center ${statusToClass[status]} rounded-md text-center w-full h-12 sm:h-8`}
          >
            {capitalizeWords(status)}
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};

export default ApplicationStatusComponent;
