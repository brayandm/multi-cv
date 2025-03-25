"use client";
import { Button, Checkbox, Input, Textarea } from "@heroui/react";
import React, { Key } from "react";
import {
  DynamicInputsProps,
  IDynamicInput,
  IDynamicInputArray,
  IDynamicOnValueChange,
  ValidationError,
} from "./DynamicInputs.types";
import SelectCountry from "@/shared/components/SelectCountry";
import Flag from "react-world-flags";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
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

  const getSelectedCountry = (
    inputs: IDynamicInputArray<T>
  ): IDynamicInput<T> => {
    return inputs.find((input) => {
      if (Array.isArray(input)) {
        return getSelectedCountry(input); // <- There is a problem here
      } else {
        return input.type === "phone_country_code" && input.value !== null;
      }
    }) as IDynamicInput<T>;
  };

  const PhoneNumberStartContent = () => {
    try {
      const Component = (
        <>
          {getSelectedCountry(inputs) &&
            (getSelectedCountry(inputs).value as string) && (
              <>
                +
                {getCountryCallingCode(
                  getSelectedCountry(inputs).value as CountryCode
                )}
              </>
            )}
        </>
      );
      return Component;
    } catch (e) {
      console.log(e);

      return <></>;
    }
  };

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
              startContent={PhoneNumberStartContent()}
              isDisabled={input.isDisabled}
              classNames={customStyles}
              onBlur={input.onBlur}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
              description={input.description}
              validate={(value) => {
                if (input.validate) {
                  return input.validate(value);
                }
                if (input.isRequired) {
                  return requiredValidator(t, value);
                }
                return true;
              }}
              maxLength={MAX_SHORT_TEXT_LENGTH}
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

        if (input.type === "is_present") {
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

        if (input.type === "checkbox") {
          return (
            <Checkbox
              key={index}
              onChange={(event) =>
                (input.onValueChange as IDynamicOnValueChange<boolean>)(
                  event.target.checked
                )
              }
              isDisabled={input.isDisabled}
              value={input.value as string}
              defaultSelected={input.selected}
            >
              {input.label}
            </Checkbox>
          );
        }

        if (input.type === "start_date" || input.type === "end_date") {
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
