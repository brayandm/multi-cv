import React from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@heroui/react";
import Flag from "react-world-flags";
import CountryList from "country-list";

type AutocompleteCountryProps = Omit<AutocompleteProps, "children">;

const countries = CountryList.getData();

const SelectCountry: React.FC<AutocompleteCountryProps> = (props) => {
  return (
    <Autocomplete allowsCustomValue={false} {...props}>
      {countries.map((country) => (
        <AutocompleteItem
          key={country.code}
          startContent={
            <Flag
              alt={country.name}
              className="w-6 h-6"
              code={country.code}
            ></Flag>
          }
        >
          {country.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default SelectCountry;
