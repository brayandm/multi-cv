import React, { createContext, useContext, ReactNode } from "react";
import { Cv } from "./types";

interface CvContextType {
  cv: Cv;
  setCv: React.Dispatch<React.SetStateAction<Cv>>;
}

const CvContext = createContext<CvContextType | null>(null);

export const useCv = () => {
  const ctx = useContext(CvContext);
  if (!ctx) throw new Error("useCv must be used inside CvProvider");
  return ctx;
};

export const CvProvider = ({
  children,
  value,
  onChange,
}: {
  children: ReactNode;
  value: Cv;
  onChange: React.Dispatch<React.SetStateAction<Cv>>;
}) => (
  <CvContext.Provider value={{ cv: value, setCv: onChange }}>
    {children}
  </CvContext.Provider>
);
