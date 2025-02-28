export type BasicInfoKeys = "full_name" | "email" | "about";
export type BasicInfo = {
  full_name: string;
  email: string;
  about: string;
};
export type Experience = {
  company: string;
  end_date: Date | "present";
  start_date: Date;
  location: string;
};

export interface IProfileFrom {
  basicInfo: BasicInfo;
  experience: Experience[];
}
