"use client";

import { getProfileEngine, profileSyncEngine } from "@/lib/backendService";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type IBasicInfo = {
  full_name: string;
  email: string;
  about: string;
  phone_country_code: string;
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

export interface IProfessionalLinks {
  name: string;
  link: string;
}

export interface ISkills {
  list: string[];
}

export interface IProfile {
  basic_info: IBasicInfo;
  professional_links: IProfessionalLinks[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  skills: ISkills;
}

interface ProfileContextType {
  profile: IProfile;
  isLoaded: boolean;
  updateProfile: (newProfile: Partial<IProfile>) => void;
  syncProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<IProfile>({
    basic_info: {
      full_name: "",
      email: "",
      about: "",
      phone_country_code: "",
      phone_number: "",
      location: "",
    },
    professional_links: [],
    experience: [],
    education: [],
    projects: [],
    skills: {
      list: [],
    },
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getProfileEngine()
      .then((response) => {
        setProfile(response.data);
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error(error);
        setIsLoaded(true);
      });
  }, []);

  const updateProfile = (newProfile: Partial<IProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const syncProfile = () => {
    profileSyncEngine(profile);
  };

  return (
    <ProfileContext.Provider
      value={{ profile, isLoaded, updateProfile, syncProfile }}
    >
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
