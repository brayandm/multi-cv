"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export interface Cv {
  full_name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  location: string;
  summary: string;
  experiences: CvExperience[];
}

export interface CvExperience {
  company: string;
  position: string;
  location: string;
  start_date: string;
  end_date: string;
  descriptions: string[];
}
export interface CvTexts {
  locale: string;
  contact_info: string;
  summary: string;
  experience: string;
  education: string;
  projects: string;
  certifications: string;
  languages: string;
  skills: string;
}

interface CvContextType {
  cv: Cv;
  setCv: (cv: Cv) => void;
  cvTexts: CvTexts;
  setCvTexts: (texts: CvTexts) => void;
}

const CvContext = createContext<CvContextType | undefined>(undefined);

export const CvProvider = ({ children }: { children: ReactNode }) => {
  const [cv, setCv] = useState<Cv>({
    full_name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    location: "",
    summary: "",
    experiences: [],
  });

  const [cvTexts, setCvTexts] = useState<CvTexts>({
    locale: "en",
    contact_info: "Contact Information",
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    certifications: "Certifications",
    languages: "Languages",
    skills: "Skills",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("cv");
    if (stored) {
      try {
        setCv(JSON.parse(stored));
      } catch {
        console.warn("Invalid CV in sessionStorage");
      }
    }
  }, []);

  useEffect(() => {
    if (cv) {
      sessionStorage.setItem("cv", JSON.stringify(cv));
    } else {
      sessionStorage.removeItem("cv");
    }
  }, [cv]);

  return (
    <CvContext.Provider
      value={{
        cv,
        setCv,
        cvTexts,
        setCvTexts,
      }}
    >
      {children}
    </CvContext.Provider>
  );
};

export const useCv = (): CvContextType => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error("useCv must be used within a CvProvider");
  }
  return context;
};
