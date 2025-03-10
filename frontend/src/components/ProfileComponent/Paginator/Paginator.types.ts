import { IProfile } from "@/lib/ProfileContext";
export interface IPaginatorProps {
  width: number;
  formData: IProfile;
  setFormData: React.Dispatch<React.SetStateAction<IProfile>>;
}
