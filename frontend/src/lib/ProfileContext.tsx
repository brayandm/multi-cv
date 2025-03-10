"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type IBasicInfo = {
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

export interface IProfile {
  basic_info: IBasicInfo;
  socials: ISocial[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  skills: string[];
}

interface ProfileContextType {
  profile: IProfile;
  updateProfile: (newProfile: Partial<IProfile>) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<IProfile>({
    basic_info: {
      full_name: "",
      email: "",
      about: "",
      country_code: "",
      phone_number: "",
      location: "",
    },
    socials: [],
    experience: [],
    education: [],
    projects: [],
    skills: [],
  });

  const updateProfile = (newProfile: Partial<IProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};
