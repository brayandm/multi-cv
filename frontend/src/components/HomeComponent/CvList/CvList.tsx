import { CV } from "@/lib/types";
import React from "react";
import CvComponent from "./CvComponent/CvComponent";

interface CvListProps {
  cvs: CV[];
  onSelect?: (cv: CV) => void;
}

const CvList: React.FC<CvListProps> = ({ cvs, onSelect }) => {
  return (
    <div className="cv-list px-2">
      <h1 className="">Your Cvs</h1>
      {cvs.map((cv, key) => (
        <CvComponent {...cv} key={key}></CvComponent>
      ))}
    </div>
  );
};

export default CvList;
