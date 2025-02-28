import { CV } from "@/lib/types";
import React from "react";
import CvComponent from "./CvComponent/CvComponent";

interface CvListProps {
  cvs: CV[];
  onSelect?: (cv: CV) => void;
}

const CvList: React.FC<CvListProps> = ({ cvs }) => {
  return (
    <div className="px-2 flex flex-col gap-2">
      <h2 className="">Your resumes</h2>
      {cvs.map((cv, key) => (
        <CvComponent {...cv} key={key}></CvComponent>
      ))}
    </div>
  );
};

export default CvList;
