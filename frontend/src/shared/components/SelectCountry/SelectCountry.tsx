import React from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/react";
import Flag from "react-world-flags";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

type AutocompleteCountryProps = Omit<AutocompleteProps, "children">;

const countries = getCountries();

countries.sort((a, b) => {
  const callingCodeA = getCountryCallingCode(a);
  const callingCodeB = getCountryCallingCode(b);

  return Number(callingCodeA) - Number(callingCodeB);
});

interface SelectCountryProps extends AutocompleteCountryProps {
  selectedKey: string;
}

const SelectCountry: React.FC<SelectCountryProps> = ({
  selectedKey,
  ...props
}) => {
  return (
    <Autocomplete
      allowsCustomValue={false}
      {...props}
      selectedKey={selectedKey ? `${selectedKey}` : ""}
      classNames={{
        base: "w-[200px]",
      }}
    >
      {countries.map((countryCode) => {
        const callingCode = getCountryCallingCode(countryCode);

        return (
          <AutocompleteItem
            key={`${countryCode}`}
            textValue={`+${callingCode}`}
            startContent={
              <Flag alt={countryCode} className="w-6 h-6" code={countryCode} />
            }
          >
            {`+${callingCode}`}
          </AutocompleteItem>
        );
      })}
    </Autocomplete>
  );
};

export default SelectCountry;
