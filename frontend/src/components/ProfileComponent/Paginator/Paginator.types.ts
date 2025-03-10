import { IProfile } from "@/lib/profileContext";
export interface IPaginatorProps {
  width: number;
  formData: IProfile;
  setFormData: React.Dispatch<React.SetStateAction<IProfile>>;
}
