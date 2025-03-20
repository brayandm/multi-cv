"use client";

import { getProfileEngine, profileSyncEngine } from "@/lib/backendService";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useUserStatus } from "./UserStatusContext";

export type IBasicInfo = {
  full_name: string;
  email: string;
  about: string;
  phone_country_code: string;
  phone_number: string;
  location: string;
};

export interface IExperience {
  id: string;
  company: string;
  link: string;
  role: string;
  location: string;
  description: string;
  start_date: string;
  end_date: string;
  is_present: boolean;
}

export interface IEducation {
  id: string;
  institution: string;
  link: string;
  career: string;
  location: string;
  start_date: string;
  end_date: string;
  is_present: boolean;
}

export interface IProject {
  id: string;
  name: string;
  link: string;
  description: string;
  start_date: string;
  end_date: string;
  is_present: boolean;
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
  isLoaded: boolean;
  syncProfile: () => void;
  basicInfo: IBasicInfo;
  professionalLinks: IProfessionalLinks[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  skills: ISkills;
  updateBasicInfo: (newBasicInfo: IBasicInfo) => void;
  updateProfessionalLinks: (newProfessionalLinks: IProfessionalLinks[]) => void;
  updateExperience: (newExperience: IExperience[]) => void;
  updateEducation: (newEducation: IEducation[]) => void;
  updateProjects: (newProjects: IProject[]) => void;
  updateSkills: (newSkills: ISkills) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { userStatus } = useUserStatus();

  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({
    full_name: "",
    email: "",
    about: "",
    phone_country_code: "",
    phone_number: "",
    location: "",
  });

  const [professionalLinks, setProfessionalLinks] = useState<
    IProfessionalLinks[]
  >([]);

  const [experience, setExperience] = useState<IExperience[]>([]);
  const [education, setEducation] = useState<IEducation[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [skills, setSkills] = useState<ISkills>({ list: [] });

  const [onLoadedError, setOnLoadedError] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (userStatus.authenticated) {
      getProfileEngine()
        .then((response) => {
          if (response.data) {
            const profile: IProfile = response.data;
            setBasicInfo(profile.basic_info);
            setProfessionalLinks(profile.professional_links);
            setExperience(profile.experience);
            setEducation(profile.education);
            setProjects(profile.projects);
            setSkills(profile.skills);
          } else {
            setBasicInfo({
              full_name: userStatus.name || "",
              email: userStatus.email || "",
              about: "",
              phone_country_code: "",
              phone_number: "",
              location: "",
            });
          }
          setIsLoaded(true);
        })
        .catch((error) => {
          console.error(error);
          setOnLoadedError(true);
        });
    }
  }, [userStatus]);

  const updateBasicInfo = (newBasicInfo: IBasicInfo) => {
    setBasicInfo(newBasicInfo);
  };

  const updateProfessionalLinks = (
    newProfessionalLinks: IProfessionalLinks[]
  ) => {
    setProfessionalLinks(newProfessionalLinks);
  };

  const updateExperience = (newExperience: IExperience[]) => {
    setExperience(newExperience);
  };

  const updateEducation = (newEducation: IEducation[]) => {
    setEducation(newEducation);
  };

  const updateProjects = (newProjects: IProject[]) => {
    setProjects(newProjects);
  };

  const updateSkills = (newSkills: ISkills) => {
    setSkills(newSkills);
  };

  const syncProfile = async () => {
    if (onLoadedError) return;
    await profileSyncEngine({
      basic_info: basicInfo,
      professional_links: professionalLinks,
      experience: experience,
      education: education,
      projects: projects,
      skills: skills,
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        isLoaded,
        syncProfile,
        basicInfo,
        professionalLinks,
        experience,
        education,
        projects,
        skills,
        updateBasicInfo,
        updateProfessionalLinks,
        updateExperience,
        updateEducation,
        updateProjects,
        updateSkills,
      }}
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
