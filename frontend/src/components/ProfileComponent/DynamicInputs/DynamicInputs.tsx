"use client";
import { Button, Checkbox, Input, Textarea } from "@heroui/react";
import React, { Key } from "react";
import {
  DynamicInputsProps,
  IDynamicInput,
  IDynamicInputArray,
  IDynamicOnValueChange,
} from "./DynamicInputs.types";
import SelectCountry from "@/shared/components/SelectCountry";
import Flag from "react-world-flags";
import { CountryCode, getCountryCallingCode } from "libphonenumber-js";
import { dynamicInputsStyles } from "@/lib/customStyles";
import { useProfile } from "@/contexts/ProfileContext";

const DynamicInputs = <T,>({
  inputs,
  isPresent,
  horizontal = false,
}: DynamicInputsProps<T>) => {
  const { syncProfile } = useProfile();

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
              <DynamicInputs
                isPresent={isPresent}
                inputs={input}
                horizontal={true}
              />
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
                syncProfile();
              }}
              selectedKey={input.value as string}
              inputProps={{
                classNames: customStyles,
              }}
              color={input.color}
              startContent={
                <Flag className="w-6 h-6" code={input.value as string}></Flag>
              }
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
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
              classNames={customStyles}
              onBlur={() => syncProfile()}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
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
              classNames={customStyles}
              onBlur={() => syncProfile()}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
              description={input.description}
            />
          );
        }

        if (input.type === "is_present") {
          return (
            <Checkbox
              key={index}
              isSelected={input.value as boolean}
              onValueChange={(value) => {
                (input.onValueChange as IDynamicOnValueChange<boolean>)(value);
                syncProfile();
              }}
            >
              {input.label}
            </Checkbox>
          );
        }

        if (input.type === "checkbox") {
          return (
            <Checkbox
              key={index}
              onValueChange={(value) => {
                (input.onValueChange as IDynamicOnValueChange<boolean>)(value);
                syncProfile();
              }}
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
              type={"month"}
              value={input.value as string}
              color={input.color}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              classNames={{ ...customStyles, base: "w-[150px]" }}
              onBlur={() => syncProfile()}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
            ></Input>
          );
        }
        if (input.type === "end_date") {
          const isDisabled = isPresent?.value ? true : false;
          return (
            <Input
              key={index}
              variant={variant}
              label={input.label}
              placeholder={input.placeholder}
              type={"month"}
              value={input.value as string}
              color={input.color}
              onValueChange={
                input.onValueChange as IDynamicOnValueChange<string>
              }
              isDisabled={isDisabled}
              classNames={{ ...customStyles, base: "w-[150px]" }}
              onBlur={() => syncProfile()}
              isRequired={input.isRequired}
              isInvalid={input.isInvalid}
              errorMessage={input.errorMessage}
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
            color={input.color}
            classNames={customStyles}
            startContent={input.startContent}
            endContent={input.endContent}
            onBlur={() => syncProfile()}
            isRequired={input.isRequired}
            isInvalid={input.isInvalid}
            errorMessage={input.errorMessage}
          />
        );
      })}
    </div>
  );
};

export default DynamicInputs;
