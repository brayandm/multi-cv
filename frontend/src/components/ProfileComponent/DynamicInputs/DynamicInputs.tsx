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

const DynamicInputs = <T,>({ inputs, isPresentJob }: DynamicInputsProps<T>) => {
  const validateEmail = (email: string): boolean => {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
  };
  const getSelectedCountry = (
    inputs: IDynamicInputArray<T>
  ): IDynamicInput<T> => {
    return inputs.find((input) => {
      if (Array.isArray(input)) {
        return getSelectedCountry(input); // <- Aquí hay un problema
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
    <>
      {inputs.map((input, index) => {
        if (Array.isArray(input)) {
          return (
            <div key={index} className="flex gap-2">
              <DynamicInputs isPresentJob={isPresentJob} inputs={input} />
            </div>
          );
        }

        let isInvalid = false;
        let errorMessage = "";
        let color: "default" | "danger" = "default";

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
              label={input.label}
              onSelectionChange={
                input.onValueChange as IDynamicOnValueChange<Key | null>
              }
              selectedKey={input.value as string}
              className="mb-2 "
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
              className="mb-2"
              startContent={PhoneNumberStartContent()}
            />
          );
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
              isSelected={input.value as boolean}
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
            startContent={input.startContent}
          />
        );
      })}
    </>
  );
};

export default DynamicInputs;
