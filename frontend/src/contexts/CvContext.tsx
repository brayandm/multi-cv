"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export const dummyCv: Cv = {
  full_name: "Brayan Durán Medina",
  email: "brayan.duran@example.com",
  phone: "+34 612 345 678",
  linkedin: "linkedin.com/in/brayan-duran",
  github: "github.com/brayan-dev",
  location: "Barcelona, España",
  summary:
    "Desarrollador Full Stack con experiencia en React, Next.js, Laravel y DevOps. Apasionado por crear soluciones eficientes y escalables.",
  experiences: [
    {
      company: "OpenAI",
      position: "Full Stack Developer",
      location: "Remoto",
      start_date: "Ene 2023",
      end_date: "Mar 2024",
      descriptions: [
        "Desarrollé interfaces interactivas con React y Tailwind.",
        "Implementé APIs RESTful con Laravel y bases de datos relacionales.",
        "Optimizaciones de rendimiento en el backend y automatización con CI/CD.",
      ],
    },
    {
      company: "Habra Spain Institute of Technology",
      position: "DevOps Intern",
      location: "Barcelona",
      start_date: "Sep 2022",
      end_date: "Dic 2022",
      descriptions: [
        "Desplegué microservicios usando Docker y Nginx.",
        "Configuré pipelines con GitHub Actions y DigitalOcean.",
      ],
    },
  ],
};

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

interface CvContextType {
  cv: Cv;
  setCv: (cv: Cv) => void;
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
    <CvContext.Provider value={{ cv, setCv }}>{children}</CvContext.Provider>
  );
};

export const useCv = (): CvContextType => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error("useCv must be used within a CvProvider");
  }
  return context;
};
