export type BasicInfoKeys = "full_name" | "email" | "about";
export type BasicInfo = {
  full_name: string;
  email: string;
  about: string;
  country_code: string;
  phone_number: string;
  location: string;
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
export interface IEducation {
  institution: string;
  end_date: string;
  start_date: string;
  location: string;
  career: string;
  is_present: boolean;
}
export interface IProject {
  name: string;
  end_date: string;
  start_date: string;
  description: string;
  link: string;
}
export interface ISocial {
  name: string;
  link: string;
}

export interface IProfileFrom {
  basicInfo: BasicInfo;
  socials: ISocial[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  skills: string[];
}

export interface IExperienceProps {
  width: number;
  formData: IProfileFrom;
  setFormData: React.Dispatch<React.SetStateAction<IProfileFrom>>;
}

/* --------------------------------------------------------------- */
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
    | "country_code"
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
}

export type IDynamicInputArray<T> = Array<
  IDynamicInput<T> | IDynamicInputArray<T>
>;

export interface DynamicInputsProps<T> {
  inputs: IDynamicInputArray<T>;
  isPresentJob?: IDynamicInput<T>;
  horizontal?: boolean;
}
