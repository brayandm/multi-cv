"use client";
import { Checkbox, Input, Textarea } from "@heroui/react";
import React from "react";
import {
  DynamicInputsProps,
  IDynamicOnValueChange,
} from "../ProfileComponent.types";

const DynamicInputs = <T,>({ inputs, isPresentJob }: DynamicInputsProps<T>) => {
  const validateEmail = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  return (
    <>
      {inputs.map((input, index) => {
        // ✅ Verificar si `input` es un array (subgrupo de inputs anidados)
        if (Array.isArray(input)) {
          return (
            <div key={index} className="flex gap-2">
              <DynamicInputs isPresentJob={isPresentJob} inputs={input} />
            </div>
          );
        }

        // 🛠 Manejo de validaciones individuales
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
              value={input.value as string}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              color={color}
              errorMessage={errorMessage}
              className="mb-2"
            />
          );
        }

        if (input.type === "is_present") {
          return (
            <Checkbox
              key={index}
              isSelected={input.value as boolean} // Ahora se refleja el valor del estado
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<boolean>
              }
              className="mb-2"
            >
              {input.label}
            </Checkbox>
          );
        }

        if (input.type === "checkbox") {
          return (
            <Checkbox
              key={index}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<boolean>
              }
              value={input.value as string}
              defaultSelected={input.selected}
              className="mb-2"
            >
              {input.label}
            </Checkbox>
          );
        }

        if (input.type === "start_date") {
          return (
            <Input
              key={index}
              label={input.label}
              placeholder={input.placeholder}
              type={"date"}
              value={input.value as string}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              className="mb-2"
            ></Input>
          );
        }
        if (input.type === "end_date") {
          const isDisabled = isPresentJob?.value ? true : false;
          return (
            <Input
              key={index}
              label={input.label}
              placeholder={input.placeholder}
              type={"date"}
              value={input.value as string}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              isDisabled={isDisabled}
              className="mb-2"
            ></Input>
          );
        }

        return (
          <Input
            key={index}
            label={input.label}
            placeholder={input.placeholder}
            type={input.type}
            value={input.value as string}
            onValueChange={input.onValueChange as IDynamicOnValueChange<string>}
            color={color}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            className="mb-2"
          />
        );
      })}
    </>
  );
};

export default DynamicInputs;
