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
import { useModeration } from "@/hooks/useModeration";
import { useTranslations } from "next-intl";

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

type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONValue[];
type JSONObject = { [key: string]: JSONValue };
export function extractDifferences<T extends JSONObject>(
  local: T,
  remote: T
): Partial<T> {
  if (remote === null || remote === undefined) {
    return local;
  }

  const result: Partial<T> = {};

  for (const key of Object.keys(local) as (keyof T)[]) {
    const localValue = local[key];
    const remoteValue = remote[key];

    if (Array.isArray(localValue)) {
      if (
        localValue.length > 0 &&
        typeof localValue[0] === "object" &&
        localValue[0] !== null &&
        "id" in localValue[0]
      ) {
        const remoteArray = Array.isArray(remoteValue) ? remoteValue : [];
        const remoteMap = new Map<string, JSONObject>(
          remoteArray.map((item) => [
            String((item as JSONObject)["id"]),
            item as JSONObject,
          ])
        );

        const diffArray = (localValue as JSONObject[])
          .map((localItem) => {
            const id = String(localItem["id"]);
            const remoteItem = remoteMap.get(id);
            if (!remoteItem) return localItem;
            const nestedDiff = extractDifferences(localItem, remoteItem);
            return Object.keys(nestedDiff).length > 0 ? nestedDiff : null;
          })
          .filter((item): item is JSONObject => item !== null);

        if (diffArray.length > 0) {
          result[key] = diffArray as T[typeof key];
        }
      } else {
        const remoteArray = Array.isArray(remoteValue) ? remoteValue : [];
        const remoteSet = new Set(
          remoteArray.map((item) => JSON.stringify(item))
        );

        const diffArray = localValue.filter(
          (item) => !remoteSet.has(JSON.stringify(item))
        );

        if (diffArray.length > 0) {
          result[key] = diffArray as T[typeof key];
        }
      }
    } else if (
      typeof localValue === "object" &&
      localValue !== null &&
      !Array.isArray(localValue)
    ) {
      const nestedDiff = extractDifferences(
        localValue as JSONObject,
        (remoteValue as JSONObject) || {}
      );
      if (Object.keys(nestedDiff).length > 0) {
        result[key] = nestedDiff as T[typeof key];
      }
    } else {
      if (localValue !== remoteValue) {
        result[key] = localValue;
      }
    }
  }

  return result;
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    userStatus.authenticated
  );

  const t = useTranslations();

  const moderate = useModeration(t("common.errors.profile"), () => {});

  useEffect(() => {
    setIsAuthenticated(userStatus.authenticated);
  }, [userStatus]);

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
    if (isAuthenticated) {
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
  }, [isAuthenticated]); // eslint-disable-line

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
      const data = extractDifferences(
        getJoinedProfile() as unknown as JSONObject,
        profileEngine as unknown as JSONObject
      );
      if (data && Object.keys(data).length > 0) {
        const result = await moderate(JSON.stringify(data));
        if (!result) return;
      }

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
      const data = extractDifferences(
        getJoinedProfile() as unknown as JSONObject,
        profileEngine as unknown as JSONObject
      );
      if (data && Object.keys(data).length > 0) {
        const result = await moderate(JSON.stringify(data));
        if (!result) return;
      }

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
