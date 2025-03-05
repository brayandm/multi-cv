export type BasicInfoKeys = "full_name" | "email" | "about";
export type BasicInfo = {
  full_name: string;
  email: string;
  about: string;
  country_code: string;
  phone_number: string;
};
export interface IExperience {
  company: string;
  end_date: string;
  start_date: string;
  location: string;
  description: string;
  role: string;
  is_present: boolean;
}

export interface IProfileFrom {
  basicInfo: BasicInfo;
  experience: IExperience[];
}

export interface IExperienceProps {
  width: number;
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
}

/* --------------------------------------------------------------- */
export type IDynamicOnValueChange<T> = (value: T) => void;

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
    | "country_code";
  value: unknown;
  selected?: boolean;
  startContent?: React.ReactNode;
  onValueChange: IDynamicOnValueChange<T>;
}

export type IDynamicInputArray<T> = Array<
  IDynamicInput<T> | IDynamicInputArray<T>
>;

export interface DynamicInputsProps<T> {
  inputs: IDynamicInputArray<T>;
  isPresentJob?: IDynamicInput<T>;
  horizontal?: boolean;
}
