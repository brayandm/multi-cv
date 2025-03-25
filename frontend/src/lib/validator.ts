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
