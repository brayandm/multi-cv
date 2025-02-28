"use client";
import { CalendarDate, Input, Textarea } from "@heroui/react";
import React from "react";

/* --------------------------------------------------------------- */

export interface IDynamicInput {
  label: string;
  placeholder?: string;
  type: "text" | "email" | "number" | "password" | "textarea" | "date";
  value: unknown;
  onValueChange: (value: string) => void;
  onChangeDate?: ((value: CalendarDate) => void) | undefined;
}

interface DynamicInputsProps {
  inputs: IDynamicInput[];
}

const DynamicInputs: React.FC<DynamicInputsProps> = ({ inputs }) => {
  const validateEmail = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  return (
    <section className="dynamic-form flex flex-col gap-2">
      {inputs.map((input, index) => {
        let isInvalid = false;
        let errorMessage = "";
        let color: "default" | "danger" = "default";

        if (input.type === "email") {
          isInvalid =
            input.value !== "" && !validateEmail(input.value as string);
          errorMessage = isInvalid ? "Please enter a valid email" : "";
          if (isInvalid) color = "danger";
        }

        if (input.type === "textarea") {
          return (
            <Textarea
              key={index}
              label={input.label}
              placeholder={input.placeholder}
              value={input.value}
              onValueChange={input.onValueChange}
              color={color}
              errorMessage={errorMessage}
            />
          );
        }
        /*      if (input.type === "date") {
          return (
            <DatePicker
              className="max-w-[284px]"
              label={input.label}
              labelPlacement={"inside"}
              value={input.value}
              
            />
          );
        } */

        return (
          <Input
            key={index}
            label={input.label}
            placeholder={input.placeholder}
            type={input.type}
            value={input.value}
            onValueChange={input.onValueChange}
            color={color}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
          />
        );
      })}
    </section>
  );
};

export default DynamicInputs;
