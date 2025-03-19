export type IDynamicOnValueChange<T> = (value: T) => void;
export type IDynamicOnPress = () => void;

export interface IDynamicInput<T> {
  label: string;
  placeholder?: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "textarea"
    | "date"
    | "end_date"
    | "start_date"
    | "checkbox"
    | "is_present"
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
}

export type IDynamicInputArray<T> = Array<
  IDynamicInput<T> | IDynamicInputArray<T>
>;

export interface DynamicInputsProps<T> {
  inputs: IDynamicInputArray<T>;
  isPresent?: IDynamicInput<T>;
  horizontal?: boolean;
}
