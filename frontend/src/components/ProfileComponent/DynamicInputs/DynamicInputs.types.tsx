export type IDynamicOnValueChange<T> = (value: T) => void;
export type IDynamicOnPress = () => void;

export type ValidationError = string | string[];

export interface IDynamicInput<T> {
  label?: string;
  placeholder?: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "textarea"
    | "date"
    | "month_selector"
    | "selector"
    | "checkbox"
    | "phone_number"
    | "phone_country_code"
    | "button";
  value?: unknown;
  selected?: boolean;
  color?:
    | "default"
    | "danger"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | undefined;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  onValueChange?: IDynamicOnValueChange<T>;
  onPress?: IDynamicOnPress;
  isRequired?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  description?: string;
  onBlur?: () => void;
  validate?: (value: string) => ValidationError | true | null | undefined;
  isDisabled?: boolean;
  customStyles?: string;
  selectItems?: Array<{
    label: string;
    key: string;
    description?: string;
  }>;
  text?: string;
}

export type IDynamicInputArray<T> = Array<
  IDynamicInput<T> | IDynamicInputArray<T>
>;

export interface DynamicInputsProps<T> {
  inputs: IDynamicInputArray<T>;

  horizontal?: boolean;
}
