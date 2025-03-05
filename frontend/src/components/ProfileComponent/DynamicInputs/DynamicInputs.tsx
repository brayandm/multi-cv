"use client";
import { Checkbox, Input, Textarea } from "@heroui/react";
import React, { Key } from "react";
import {
  DynamicInputsProps,
  IDynamicInput,
  IDynamicInputArray,
  IDynamicOnValueChange,
} from "../ProfileComponent.types";
import SelectCountry from "@/shared/components/SelectCountry";
import Flag from "react-world-flags";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
import { dynamicInputsStyles } from "@/lib/customStyles";

const DynamicInputs = <T,>({
  inputs,
  isPresentJob,
  horizontal = false,
}: DynamicInputsProps<T>) => {
  const validateEmail = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };
  const getSelectedCountry = (
    inputs: IDynamicInputArray<T>
  ): IDynamicInput<T> => {
    return inputs.find((input) => {
      if (Array.isArray(input)) {
        return getSelectedCountry(input); // <- There is a problem here
      } else {
        return input.type === "country_code" && input.value !== null;
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
              <DynamicInputs
                isPresentJob={isPresentJob}
                inputs={input}
                horizontal={true}
              />
            </div>
          );
        }

        let isInvalid = false;
        let errorMessage = "";
        let color: "default" | "danger" = "default";
        const variant: "flat" | "bordered" | "underlined" | "faded" = "flat";

        const customStyles = dynamicInputsStyles;

        if (input.type === "email") {
          isInvalid =
            input.value !== "" && !validateEmail(input.value as string);
          errorMessage = isInvalid ? "Please enter a valid email" : "";
          if (isInvalid) color = "danger";
        }

        if (input.type === "country_code") {
          return (
            <SelectCountry
              key={index}
              variant={variant}
              label={input.label}
              onSelectionChange={
                input.onValueChange as IDynamicOnValueChange<Key | null>
              }
              selectedKey={input.value as string}
              inputProps={{
                classNames: customStyles,
              }}
              color={color}
              startContent={
                <Flag className="w-6 h-6" code={input.value as string}></Flag>
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
              color={color}
              isInvalid={isInvalid}
              errorMessage={errorMessage}
              startContent={PhoneNumberStartContent()}
              classNames={customStyles}
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
              color={color}
              errorMessage={errorMessage}
              classNames={customStyles}
            />
          );
        }

        if (input.type === "is_present") {
          return (
            <Checkbox
              key={index}
              isSelected={input.value as boolean}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<boolean>
              }
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
            >
              {input.label}
            </Checkbox>
          );
        }

        if (input.type === "start_date") {
          return (
            <Input
              key={index}
              variant={variant}
              label={input.label}
              placeholder={input.placeholder}
              type={"date"}
              value={input.value as string}
              color={color}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              classNames={{ ...customStyles, input: "w-[100px]" }}
            ></Input>
          );
        }
        if (input.type === "end_date") {
          const isDisabled = isPresentJob?.value ? true : false;
          return (
            <Input
              key={index}
              variant={variant}
              label={input.label}
              placeholder={input.placeholder}
              type={"date"}
              value={input.value as string}
              color={color}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              isDisabled={isDisabled}
              classNames={{ ...customStyles, input: "w-[100px]" }}
            ></Input>
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
            color={color}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            classNames={customStyles}
            startContent={input.startContent}
          />
        );
      })}
    </div>
  );
};

export default DynamicInputs;
