import { IProfile } from "@/lib/ProfileContext";
export interface IPaginatorProps {
  width: number;
  formData: IProfile;
  setFormData: (newProfile: Partial<IProfile>) => void;
}
