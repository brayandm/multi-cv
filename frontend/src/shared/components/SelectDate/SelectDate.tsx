import { Input, type InputProps } from "@heroui/react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

const years = Array.from({ length: 200 }, (_, i) => 1900 + i);

type ISelectDateProps = Omit<InputProps, "value" | "onValueChange"> & {
  value?: string; // expected format: "YYYY-MM"
  onValueChange?: (value: string) => void;
  onBlur?: () => void;
};

export default function SelectDate({
  value,
  onValueChange,
  onBlur,
  ...props
}: ISelectDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);

  const [draftMonth, setDraftMonth] = useState<string | null>(null);
  const [draftYear, setDraftYear] = useState<number | null>(null);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const yearsContainerRef = useRef<HTMLDivElement>(null);

  const t = useTranslations();

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

  useEffect(() => {
    if (value && /^\d{4}-\d{2}$/.test(value)) {
      const [yearStr, monthStr] = value.split("-");
      const yearNum = parseInt(yearStr);
      const monthIndex = parseInt(monthStr) - 1;
      if (!isNaN(yearNum) && months[monthIndex]) {
        setSelectedYear(yearNum);
        setSelectedMonth(months[monthIndex]);
      }
    } else {
      setSelectedYear(null);
      setSelectedMonth(null);
    }
  }, [value, months]);

  const handleSelectMonth = (month: string) => {
    setDraftMonth(month);
  };

  const handleSelectYear = (year: number) => {
    setDraftYear(year);
  };

  const handleToggle = () => {
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setInputRect(rect);
    }

    setDraftMonth(selectedMonth);
    setDraftYear(selectedYear);
    setIsOpen((prev) => !prev);
  };

  const handleConfirm = useCallback(() => {
    setSelectedMonth(draftMonth);
    setSelectedYear(draftYear);

    if (draftMonth && draftYear !== null) {
      const monthIndex = months.indexOf(draftMonth) + 1;
      const formatted = `${draftYear}-${String(monthIndex).padStart(2, "0")}`;
      onValueChange?.(formatted);
      setFirstInteraction(false);
    }

    setIsOpen(false);
    onBlur?.();
  }, [draftMonth, draftYear, onValueChange, onBlur, months]);

  const handleClear = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setDraftMonth(null);
    setDraftYear(null);
    onValueChange?.("");
    setFirstInteraction(false);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !inputWrapperRef.current?.contains(event.target as Node)
      ) {
        handleConfirm();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [draftMonth, draftYear, handleConfirm]);

  useEffect(() => {
    if (isOpen && yearsContainerRef.current) {
      const container = yearsContainerRef.current;
      const currentYear = draftYear ?? new Date().getFullYear();
      const index = years.findIndex((y) => y === currentYear);
      const itemHeight = 36;
      container.scrollTop =
        itemHeight * index - container.clientHeight / 2 + itemHeight / 2;
    }
  }, [isOpen, draftYear]);

  const POPUP_WIDTH = 256; // w-64 = 16rem = 256px
  const adjustedLeft =
    inputRect && inputRect.left + POPUP_WIDTH > window.innerWidth
      ? Math.max(0, window.innerWidth - POPUP_WIDTH - 16)
      : (inputRect?.left ?? 0);

  const [firstInteraction, setFirstInteraction] = useState(true);

  return (
    <>
      <div ref={inputWrapperRef} className="inline-block">
        <Input
          value={
            selectedMonth && selectedYear !== null
              ? `${selectedMonth} ${selectedYear}`
              : "--------- ----"
          }
          endContent={
            <CalendarIcon
              className="ml-[-5px] w-5 h-5 text-gray-500 cursor-pointer"
              onClick={handleToggle}
            />
          }
          isInvalid={
            firstInteraction
              ? undefined
              : !props.isDisabled && (!selectedMonth || selectedYear === null)
          }
          errorMessage={t("common.errors.select_date")}
          validate={() =>
            props.isDisabled || (selectedMonth && selectedYear !== null)
              ? true
              : t("common.errors.select_date")
          }
          {...props}
        />
      </div>

      {isOpen &&
        inputRect &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[9999] w-64 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
            style={{
              top: inputRect.top - 200,
              left: adjustedLeft,
            }}
          >
            <div className="relative mb-2 h-5">
              <span
                onClick={handleClear}
                className="absolute left-1/2 -translate-x-1/2 text-primary text-sm font-medium cursor-pointer hover:underline"
              >
                {t("common.buttons.clear")}
              </span>
              <XMarkIcon
                className="absolute right-0 w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={handleConfirm}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <div className="absolute z-10 top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                <div className="flex-1 max-h-52 relative overflow-y-auto space-y-1 scrollbar-none pr-1">
                  <div className="h-1" />
                  {months.map((month) => (
                    <div
                      key={month}
                      className={`cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
                        draftMonth === month ? "bg-gray-200 font-medium" : ""
                      }`}
                      onClick={() => handleSelectMonth(month)}
                    >
                      {month}
                    </div>
                  ))}
                  <div className="h-1" />
                </div>

                <div className="absolute z-10 bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
              <div className="relative">
                <div className="absolute z-10 top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none" />
                <div
                  ref={yearsContainerRef}
                  className="flex-1 max-h-52 overflow-y-auto space-y-1 scrollbar-none pl-1"
                >
                  <div className="h-1" />
                  {years.map((year) => (
                    <div
                      key={year}
                      className={`cursor-pointer px-2 py-1 rounded-md text-center hover:bg-gray-100 ${
                        draftYear === year ? "bg-gray-200 font-medium" : ""
                      }`}
                      onClick={() => handleSelectYear(year)}
                    >
                      {year}
                    </div>
                  ))}
                  <div className="h-1" />
                </div>
                <div className="absolute z-10 bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
