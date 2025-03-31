"use client";

import {
  Input,
  type InputProps,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Checkbox,
} from "@heroui/react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const years = Array.from({ length: 200 }, (_, i) => 1900 + i);

type ISelectDateProps = Omit<InputProps, "value" | "onValueChange"> & {
  value?: string; // "YYYY-MM" or "YYYY"
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
};

export default function SelectDate({
  value,
  onValueChange,
  onBlur,
  ...props
}: ISelectDateProps) {
  const t = useTranslations();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [draftMonth, setDraftMonth] = useState<string | null>(null);
  const [draftYear, setDraftYear] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [firstInteraction, setFirstInteraction] = useState(true);
  const [forceOnlyYear, setForceOnlyYear] = useState<boolean | null>(null);

  const yearsContainerRef = useRef<HTMLDivElement>(null);
  const monthsContainerRef = useRef<HTMLDivElement>(null);

  const months = useMemo(
    () => [
      t("common.months.january"),
      t("common.months.february"),
      t("common.months.march"),
      t("common.months.april"),
      t("common.months.may"),
      t("common.months.june"),
      t("common.months.july"),
      t("common.months.august"),
      t("common.months.september"),
      t("common.months.october"),
      t("common.months.november"),
      t("common.months.december"),
    ],
    [t]
  );

  const isOnlyYear = useMemo(() => {
    if (forceOnlyYear !== null) return forceOnlyYear;
    return value != null && /^\d{4}$/.test(value);
  }, [forceOnlyYear, value]);

  useEffect(() => {
    if (!value) {
      setSelectedYear(null);
      setSelectedMonth(null);
      return;
    }

    if (isOnlyYear) {
      const year = parseInt(value);
      if (!isNaN(year)) {
        setSelectedYear(year);
        setSelectedMonth(null);
      }
    } else if (/^\d{4}-\d{2}$/.test(value)) {
      const [yearStr, monthStr] = value.split("-");
      const year = parseInt(yearStr);
      const monthIndex = parseInt(monthStr) - 1;
      if (!isNaN(year) && months[monthIndex]) {
        setSelectedYear(year);
        setSelectedMonth(months[monthIndex]);
      }
    }
  }, [value, months, isOnlyYear]);

  const handleSelectMonth = (month: string) => setDraftMonth(month);
  const handleSelectYear = (year: number) => setDraftYear(year);

  const handleConfirm = useCallback(() => {
    setFirstInteraction(false);
    setSelectedYear(draftYear);
    setSelectedMonth(isOnlyYear ? null : draftMonth);

    if (draftYear !== null) {
      const formatted = isOnlyYear
        ? String(draftYear)
        : draftMonth
        ? `${draftYear}-${String(months.indexOf(draftMonth) + 1).padStart(
            2,
            "0"
          )}`
        : "";
      onValueChange?.(formatted);
    }

    setOpen(false);
    onBlur?.();
  }, [draftYear, draftMonth, onValueChange, onBlur, months, isOnlyYear]);

  const handleClear = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setDraftMonth(null);
    setDraftYear(null);
    onValueChange?.("");
    setOpen(false);
  };

  useEffect(() => {
    if (open && yearsContainerRef.current) {
      const container = yearsContainerRef.current;
      const currentYear = draftYear ?? selectedYear ?? new Date().getFullYear();
      const index = years.findIndex((y) => y === currentYear);
      if (index !== -1) {
        const itemHeight = 32;
        container.scrollTop =
          itemHeight * index - container.clientHeight / 2 + itemHeight / 2 + 4;
      }
    }
  }, [open, draftYear, selectedYear]);

  useEffect(() => {
    if (!isOnlyYear && open && monthsContainerRef.current) {
      const container = monthsContainerRef.current;
      const index = months.findIndex((m) => m === draftMonth);
      if (index !== -1) {
        const itemHeight = 32;
        container.scrollTop =
          itemHeight * index - container.clientHeight / 2 + itemHeight / 2 + 4;
      }
    }
  }, [open, draftMonth, months, isOnlyYear]);

  const [forceUpdate, setForceUpdate] = useState(0);
  useEffect(() => {
    setForceUpdate((prev) => prev + 1);
  }, [props.isRequired, props.isDisabled]);

  return (
    <Popover
      placement="bottom-start"
      onOpenChange={(open) => {
        setOpen(true);
        if (open) {
          setDraftYear(selectedYear);
          setDraftMonth(selectedMonth);
        } else {
          handleConfirm();
        }
      }}
      isOpen={open}
    >
      <PopoverTrigger>
        <div>
          <Input
            key={forceUpdate}
            value={
              selectedYear !== null
                ? isOnlyYear
                  ? `${selectedYear}`
                  : selectedMonth
                  ? `${selectedMonth} ${selectedYear}`
                  : "--------- ----"
                : "--------- ----"
            }
            endContent={
              <CalendarIcon className="ml-[-5px] w-5 h-5 text-gray-500 cursor-pointer" />
            }
            isInvalid={
              props.isInvalid ||
              (firstInteraction || !props.isRequired
                ? undefined
                : !props.isDisabled &&
                  (selectedYear === null || (!isOnlyYear && !selectedMonth)))
            }
            isRequired={props.isRequired}
            errorMessage={
              props.errorMessage ||
              (props.isRequired ? undefined : t("common.errors.select_date"))
            }
            validate={() =>
              props.isDisabled ||
              (selectedYear !== null &&
                (isOnlyYear || (!!selectedMonth && !props.isDisabled))) ||
              !props.isRequired
                ? true
                : t("common.errors.select_date")
            }
            {...props}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="z-[9999] w-52 bg-white dark:bg-default-100 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-default-200">
        <div className="relative mb-2 h-5 w-full">
          <span
            onClick={handleClear}
            className="absolute left-1/2 -translate-x-1/2 text-primary text-sm font-medium cursor-pointer hover:underline"
          >
            {t("common.buttons.clear")}
          </span>
          <XMarkIcon
            className="absolute right-0 w-5 h-5 text-gray-400 hover:text-gray-600 dark:text-gray-300 cursor-pointer"
            onClick={handleConfirm}
          />
        </div>

        <div className="flex gap-2">
          {!isOnlyYear && (
            <div className="relative">
              <div className="absolute z-10 top-0 left-0 right-0 h-6 bg-gradient-to-b from-white dark:from-default-100 to-transparent pointer-events-none" />
              <div
                ref={monthsContainerRef}
                className="flex-1 max-h-52 relative overflow-y-auto space-y-1 scrollbar-none pr-1"
              >
                <div className="h-1" />
                {months.map((month) => (
                  <div
                    key={month}
                    className={`cursor-pointer h-7 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-default-200 ${
                      draftMonth === month
                        ? "bg-gray-200 dark:bg-default-300 font-medium"
                        : ""
                    }`}
                    onClick={() => handleSelectMonth(month)}
                  >
                    {month}
                  </div>
                ))}
                <div className="h-1" />
              </div>
              <div className="absolute z-10 bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-default-100 to-transparent pointer-events-none" />
            </div>
          )}
          <div className="relative">
            <div className="absolute z-10 top-0 left-0 right-0 h-6 bg-gradient-to-b from-white dark:from-default-100 to-transparent pointer-events-none" />
            <div
              ref={yearsContainerRef}
              className="flex-1 max-h-52 overflow-y-auto space-y-1 scrollbar-none pl-1"
            >
              <div className="h-1" />
              {years.map((year) => (
                <div
                  key={year}
                  className={`cursor-pointer h-7 px-2 py-1 rounded-md text-center hover:bg-gray-100 dark:hover:bg-default-200 ${
                    draftYear === year
                      ? "bg-gray-200 dark:bg-default-300 font-medium"
                      : ""
                  }`}
                  onClick={() => handleSelectYear(year)}
                >
                  {year}
                </div>
              ))}
              <div className="h-1" />
            </div>
            <div className="absolute z-10 bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-default-100 to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="mt-4">
          <Checkbox
            isSelected={isOnlyYear}
            onChange={(event) => setForceOnlyYear(event.target.checked)}
            className="text-gray-700 dark:text-gray-200"
            size="sm"
            classNames={{
              label: "text-sm",
            }}
          >
            {t("common.texts.only_year")}
          </Checkbox>
        </div>
      </PopoverContent>
    </Popover>
  );
}
