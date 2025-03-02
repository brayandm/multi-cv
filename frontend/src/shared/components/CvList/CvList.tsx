import { CV } from "@/lib/types";
import React from "react";
import CvComponent from "../CvComponent/CvComponent";
import { useTranslations } from "next-intl";

interface CvListProps {
  cvs: CV[];
  onSelect?: (cv: CV) => void;
}

const CvList: React.FC<CvListProps> = ({ cvs }) => {
  const t = useTranslations("HomePage");
  return (
    <div className="px-2 flex flex-col gap-2">
      <h2 className="">{t("your-resumes")}</h2>
      {cvs.map((cv, key) => (
        <CvComponent {...cv} key={key}></CvComponent>
      ))}
    </div>
  );
};

export default CvList;
