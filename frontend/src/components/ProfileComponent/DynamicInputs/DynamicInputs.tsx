"use client";
import { Button, Checkbox, Input, Textarea } from "@heroui/react";
import React, { Key } from "react";
import {
  DynamicInputsProps,
  IDynamicOnValueChange,
  ValidationError,
} from "./DynamicInputs.types";
import SelectCountry from "@/shared/components/SelectCountry";
import Flag from "react-world-flags";
import { dynamicInputsStyles } from "@/lib/customStyles";
import { MAX_LONG_TEXT_LENGTH, MAX_SHORT_TEXT_LENGTH } from "@/lib/consts";
import SelectDate from "@/shared/components/SelectDate";
import { emailValidator, requiredValidator } from "@/lib/validator";
import { useTranslations } from "next-intl";

const DynamicInputs = <T,>({
  inputs,
  horizontal = false,
}: DynamicInputsProps<T>) => {
  const t = useTranslations();

  return (
    <div
      className={`flex ${horizontal ? "flex-row" : "flex-col"} gap-2 w-full`}
    >
      {inputs.map((input, index) => {
        if (Array.isArray(input)) {
          return (
            <div key={index} className="flex gap-2">
              <DynamicInputs inputs={input} horizontal={true} />
            </div>
          );
        }

        const variant: "flat" | "bordered" | "underlined" | "faded" = "flat";

        const customStyles = dynamicInputsStyles;

        if (input.type === "button") {
          return (
            <Button
              key={index}
              variant={variant}
              isDisabled={input.isDisabled}
              onPress={input.onPress}
              color={input.color}
            >
              {input.label}
            </Button>
          );
        }
        if (input.type === "phone_country_code") {
          return (
            <SelectCountry
              key={index}
              variant={variant}
              label={input.label}
              onSelectionChange={(value) => {
                (input.onValueChange as IDynamicOnValueChange<Key | null>)(
                  value
                );
              }}
              selectedKey={input.value as string}
              inputProps={{
                classNames: customStyles,
              }}
              isDisabled={input.isDisabled}
              color={input.color}
              startContent={
                <Flag className="w-6 h-6" code={input.value as string}></Flag>
              }
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
              isClearable={false}
              validate={
                input.validate as
                  | ((
                      value: unknown
                    ) => true | ValidationError | null | undefined)
                  | undefined
              }
            ></SelectCountry>
          );
        }
        if (input.type === "phone_number") {
          return (
            <Input
              key={index}
              variant={variant}
              label={input.label}
              placeholder={input.placeholder}
              type={"text"}
              value={input.value as string}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              color={input.color}
              isDisabled={input.isDisabled}
              classNames={customStyles}
              onBlur={input.onBlur}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
              description={input.description}
              validate={input.validate}
              maxLength={MAX_SHORT_TEXT_LENGTH}
              onKeyDown={(e) => {
                const allowedControlKeys = [
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                  "Home",
                  "End",
                ];

                const isControlCombo =
                  (e.ctrlKey || e.metaKey) &&
                  ["a", "c", "v", "x"].includes(e.key.toLowerCase());

                const isDigit = /^[0-9]$/.test(e.key);

                if (
                  !isDigit &&
                  !allowedControlKeys.includes(e.key) &&
                  !isControlCombo
                ) {
                  e.preventDefault();
                }
              }}
            />
          );
        }

        if (input.type === "textarea") {
          return (
            <Textarea
              key={index}
              variant={variant}
              label={input.label}
              placeholder={input.placeholder}
              value={input.value as string}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              color={input.color}
              isDisabled={input.isDisabled}
              classNames={customStyles}
              onBlur={input.onBlur}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
              description={input.description}
              validate={input.validate}
              maxLength={MAX_LONG_TEXT_LENGTH}
            />
          );
        }

        if (input.type === "checkbox") {
          return (
            <Checkbox
              key={index}
              isSelected={input.value as boolean}
              isDisabled={input.isDisabled}
              onChange={(event) =>
                (input.onValueChange as IDynamicOnValueChange<boolean>)(
                  event.target.checked
                )
              }
              value={input.value as string}
            >
              {input.label}
            </Checkbox>
          );
        }

        if (input.type === "month_selector") {
          return (
            <SelectDate
              key={index}
              variant={variant}
              label={input.label}
              placeholder={input.placeholder}
              value={input.value as string}
              color={input.color}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              isDisabled={input.isDisabled}
              classNames={{ ...customStyles, base: "w-[150px]" }}
              onBlur={input.onBlur}
              isRequired={input.isRequired}
              description={input.description}
              maxLength={MAX_SHORT_TEXT_LENGTH}
            />
          );
        }

        return (
          <Input
            key={index}
            variant={variant}
            label={input.label}
            placeholder={input.placeholder}
            type={input.type}
            value={input.value as string}
            onValueChange={input.onValueChange as IDynamicOnValueChange<string>}
            color={input.color}
            isDisabled={input.isDisabled}
            classNames={{ ...customStyles, base: input.customStyles }}
            startContent={input.startContent}
            endContent={input.endContent}
            onBlur={input.onBlur}
            isRequired={input.isRequired}
            isInvalid={input.isInvalid}
            errorMessage={input.errorMessage}
            description={input.description}
            validate={(value) => {
              if (input.validate) {
                return input.validate(value);
              }
              if (input.type === "email") {
                return emailValidator(t, value);
              }
              if (input.isRequired) {
                return requiredValidator(t, value);
              }
              return true;
            }}
            maxLength={MAX_SHORT_TEXT_LENGTH}
          />
        );
      })}
    </div>
  );
};

export default DynamicInputs;
