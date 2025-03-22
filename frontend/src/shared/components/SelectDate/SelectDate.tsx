import { Input, type InputProps } from "@heroui/react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const years = Array.from({ length: 10 }, (_, i) => 2022 + i);

type ISelectDateProps = Omit<InputProps, "value" | "onValueChange"> & {
  value?: string;
  onValueChange?: (value: string) => void;
};

export default function SelectDate({
  value,
  onValueChange,
  ...props
}: ISelectDateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [month, year] = value.split(" ");
      if (months.includes(month)) setSelectedMonth(month);
      const yearNum = parseInt(year);
      if (!isNaN(yearNum)) setSelectedYear(yearNum);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !inputWrapperRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectMonth = (month: string) => {
    setSelectedMonth(month);
    if (selectedYear !== null) {
      onValueChange?.(`${month} ${selectedYear}`);
    }
  };

  const handleSelectYear = (year: number) => {
    setSelectedYear(year);
    if (selectedMonth !== null) {
      onValueChange?.(`${selectedMonth} ${year}`);
    }
  };

  const handleToggle = () => {
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect();
      setInputRect(rect);
    }
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => setIsOpen(false);

  const handleClear = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    onValueChange?.("");
  };

  return (
    <>
      <div ref={inputWrapperRef} className="inline-block">
        <Input
          value={`${selectedMonth ?? "---------"} ${selectedYear ?? "----"}`}
          endContent={
            <CalendarIcon
              className="w-5 h-5 text-gray-500 cursor-pointer"
              onClick={handleToggle}
            />
          }
          validate={() => {
            return selectedMonth !== null && selectedYear !== null
              ? true
              : "Please select a date";
          }}
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
              left: inputRect.left,
            }}
          >
            <div className="relative mb-2 h-5">
              <span
                onClick={handleClear}
                className="absolute left-1/2 -translate-x-1/2 text-primary text-sm font-medium cursor-pointer hover:underline"
              >
                Clear
              </span>

              <XMarkIcon
                className="absolute right-0 w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={handleClose}
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1 max-h-40 overflow-y-scroll space-y-1 scrollbar-none pr-1">
                {months.map((month) => (
                  <div
                    key={month}
                    className={`cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100 ${
                      selectedMonth === month ? "bg-gray-200 font-medium" : ""
                    }`}
                    onClick={() => handleSelectMonth(month)}
                  >
                    {month}
                  </div>
                ))}
              </div>

              <div className="flex-1 max-h-40 overflow-y-scroll space-y-1 scrollbar-none pl-1">
                {years.map((year) => (
                  <div
                    key={year}
                    className={`cursor-pointer px-2 py-1 rounded-md text-center hover:bg-gray-100 ${
                      selectedYear === year ? "bg-gray-200 font-medium" : ""
                    }`}
                    onClick={() => handleSelectYear(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
