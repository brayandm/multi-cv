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

export interface CvTemplate {
  id: string;
  type: "latex" | "html";
  cv_texts: CvTexts;
}

interface CvContextType {
  cv: Cv;
  setCv: (cv: Cv) => void;
  cvTexts: CvTexts;
  setCvTexts: (texts: CvTexts) => void;
  applicationId: string | null;
  setApplicationId: (id: string | null) => void;
  cvTemplateId: string | null;
  setCvTemplateId: (id: string | null) => void;
}

interface Storage {
  cv: Cv;
  cvTexts: CvTexts;
  applicationId: string | null;
  cvTemplateId: string | null;
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

  const [applicationId, setApplicationId] = useState<string | null>(null);

  const [cvTemplateId, setCvTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cv_context");
    if (stored) {
      try {
        const { cv, cvTexts, applicationId, cvTemplateId }: Storage =
          JSON.parse(stored);
        setCv(cv);
        setCvTexts(cvTexts);
        setApplicationId(applicationId);
        setCvTemplateId(cvTemplateId);
      } catch {
        console.warn("Invalid CV in sessionStorage");
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "cv_context",
      JSON.stringify({ cv, cvTexts, applicationId, cvTemplateId })
    );
  }, [cv, cvTexts, applicationId, cvTemplateId]);

  return (
    <CvContext.Provider
      value={{
        cv,
        setCv,
        cvTexts,
        setCvTexts,
        applicationId,
        setApplicationId,
        cvTemplateId,
        setCvTemplateId,
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
