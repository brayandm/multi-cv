"use client";
import { CalendarDate, DatePicker, Input, Textarea } from "@heroui/react";
import React from "react";

/* --------------------------------------------------------------- */

export interface IDynamicInput {
  label: string;
  placeholder?: string;
  type: "text" | "email" | "number" | "password" | "textarea" | "date";
  value: any;
  onValueChange: (value: string) => void;
  onChangeDate?: ((value: CalendarDate) => void) | undefined;
}

interface DynamicInputsProps {
  inputs: IDynamicInput[];
}

const DynamicInputs: React.FC<DynamicInputsProps> = ({ inputs }) => {
  // Función simple para validar emails.
  const validateEmail = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };

  return (
    <section className="dynamic-form flex flex-col gap-2">
      {inputs.map((input, index) => {
        // Propiedades por defecto
        let isInvalid = false;
        let errorMessage = "";
        let color: "default" | "danger" = "default";

        // Validaciones condicionales según el tipo de input
        if (input.type === "email") {
          isInvalid = input.value !== "" && !validateEmail(input.value);
          errorMessage = isInvalid ? "Please enter a valid email" : "";
          if (isInvalid) color = "danger";
        }

        // Aquí se pueden agregar validaciones específicas para otros tipos
        // Ejemplo: if (input.type === "password") { ... }

        // Renderizado condicional según el tipo: Input o Textarea
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
