import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emailValidator = (t: any, value: string): string | true => {
  t = t as (key: string, values?: Record<string, string>) => string;

  if (value.length === 0) {
    return t("common.errors.required");
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,}$/;

  if (!emailRegex.test(value)) {
    return t("common.errors.invalid_email", {
      email: value,
    });
  }

  return true;
};

export const phoneValidator = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any,
  country_code: string,
  number: string
): string | true => {
  t = t as (key: string, values?: Record<string, string>) => string;

  if (!number || number.trim().length === 0) {
    return t("common.errors.required");
  }

  try {
    const phoneNumber = parsePhoneNumberFromString(
      number,
      country_code as CountryCode
    );

    if (!phoneNumber || !phoneNumber.isValid()) {
      return t("common.errors.invalid_phone");
    }

    return true;
  } catch {
    return t("common.errors.invalid_phone");
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const passwordValidator = (t: any, value: string): string | true => {
  t = t as (key: string, values?: Record<string, string>) => string;

  if (value.length === 0) {
    return t("common.errors.required");
  }

  if (value.length < 8) {
    return t("common.errors.password_too_short", {
      min: 8,
    });
  }

  return true;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const requiredValidator = (t: any, value: string): string | true => {
  t = t as (key: string, values?: Record<string, string>) => string;

  if (value.length === 0) {
    return t("common.errors.required");
  }

  return true;
};
