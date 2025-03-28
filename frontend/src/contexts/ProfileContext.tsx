"use client";

import { getProfileEngine, profileSyncEngine } from "@/lib/backendService";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useUserStatus } from "./UserStatusContext";

export type IBasicInfo = {
  first_name: string;
  last_name: string;
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

export interface ICertificate {
  id: string;
  name: string;
  issuer: string;
  certificate_id: string;
  verification_url: string;
  description: string;
  issue_date: string;
  expiration_date: string;
  hasnt_expiration_date: boolean;
}

export interface IProfessionalLinks {
  name: string;
  link: string;
}
export interface ILanguage {
  name: string;
  level: string;
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
  certifications: ICertificate[];
  languages: ILanguage[];
  skills: ISkills;
}

interface ProfileContextType {
  isLoaded: boolean;
  syncProfile: () => void;
  syncProfileOnFirstLogin: () => void;
  pullProfile: () => void;
  checkArePendingChanges: () => boolean;
  basicInfo: IBasicInfo;
  professionalLinks: IProfessionalLinks[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  certifications: ICertificate[];
  languages: ILanguage[];
  skills: ISkills;
  updateBasicInfo: (newBasicInfo: IBasicInfo) => void;
  updateProfessionalLinks: (newProfessionalLinks: IProfessionalLinks[]) => void;
  updateExperience: (newExperience: IExperience[]) => void;
  updateEducation: (newEducation: IEducation[]) => void;
  updateProjects: (newProjects: IProject[]) => void;
  updateCertifications: (newCertifications: ICertificate[]) => void;
  updateLanguages: (newLanguages: ILanguage[]) => void;
  updateSkills: (newSkills: ISkills) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { userStatus } = useUserStatus();

  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({
    first_name: "",
    last_name: "",
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
  const [certifications, setCertifications] = useState<ICertificate[]>([]);
  const [languages, setLanguages] = useState<ILanguage[]>([]);
  const [skills, setSkills] = useState<ISkills>({ list: [] });

  const [onLoadedError, setOnLoadedError] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  const [profileEngine, setProfileEngine] = useState<IProfile | null>(null);

  const getJoinedProfile = () => {
    return {
      basic_info: basicInfo,
      professional_links: professionalLinks,
      experience: experience,
      education: education,
      projects: projects,
      certifications: certifications,
      languages: languages,
      skills: skills,
    };
  };

  const checkArePendingChanges = () => {
    const profileEngineData = JSON.stringify(profileEngine);
    const profileData = JSON.stringify(getJoinedProfile());

    return profileEngineData !== profileData;
  };

  const pullProfile = useCallback(async () => {
    if (userStatus.authenticated) {
      try {
        const response = await getProfileEngine();
        if (response.data) {
          const profile: IProfile = response.data;
          setBasicInfo(profile.basic_info);
          setProfessionalLinks(profile.professional_links);
          setExperience(profile.experience);
          setEducation(profile.education);
          setProjects(profile.projects);
          setCertifications(profile.certifications);
          setLanguages(profile.languages);
          setSkills(profile.skills);
          setProfileEngine(profile);
        } else {
          setBasicInfo({
            first_name: userStatus.first_name || "",
            last_name: userStatus.last_name || "",
            email: userStatus.email || "",
            about: "",
            phone_country_code: "",
            phone_number: "",
            location: "",
          });
        }
        setIsLoaded(true);
      } catch (error) {
        console.error(error);
        setOnLoadedError(true);
      }
    }
  }, [userStatus]);

  useEffect(() => {
    pullProfile();
  }, [pullProfile]);

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

  const updateCertifications = (newCertifications: ICertificate[]) => {
    setCertifications(newCertifications);
  };

  const updateLanguages = (newLanguages: ILanguage[]) => {
    setLanguages(newLanguages);
  };

  const updateSkills = (newSkills: ISkills) => {
    setSkills(newSkills);
  };

  const syncProfile = async () => {
    if (!isLoaded || onLoadedError) return;
    try {
      await profileSyncEngine(getJoinedProfile());
      setProfileEngine(getJoinedProfile());
    } catch (error) {
      console.error(error);
    }
  };

  const syncProfileOnFirstLogin = async () => {
    if (!isLoaded || onLoadedError) return;
    if (!userStatus.is_first_login) return;
    try {
      await profileSyncEngine(getJoinedProfile());
      setProfileEngine(getJoinedProfile());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        isLoaded,
        syncProfile,
        syncProfileOnFirstLogin,
        pullProfile,
        checkArePendingChanges,
        basicInfo,
        professionalLinks,
        experience,
        education,
        projects,
        certifications,
        languages,
        skills,
        updateBasicInfo,
        updateProfessionalLinks,
        updateExperience,
        updateEducation,
        updateProjects,
        updateCertifications,
        updateLanguages,
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
