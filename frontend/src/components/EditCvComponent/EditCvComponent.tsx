"use client";

import { renderHtmlInlineEngine } from "@/lib/backendService";
import DefaultTemplate from "@/templates/DefaultTemplate";
import { Button } from "@heroui/react";
import { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";
import TopBarTemplate from "@/templates/TopBarTemplate";
import LatexLikeTemplate from "@/templates/LatexLikeTemplate";

export default function EditCvComponent() {
  const templateRef = useRef<HTMLDivElement>(null);

  const [isCvLoading, setIsCvLoading] = useState(false);

  const { cv, cvTexts, applicationId } = useCv();

  const router = useRouter();

  const t = useTranslations();

  const handleDocument = async (download = false) => {
    try {
      setIsCvLoading(true);

      if (!templateRef.current) return;

      const htmlContent = templateRef.current.innerHTML;

      const fullHtml = `
      <html>
        <head>
         <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
          <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
            .cv-page {
              width: 794px;
              height: 1123px;
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          <div class="cv-page">
            ${htmlContent}
          </div>
        </body>
      </html>
    `;

      const response = await renderHtmlInlineEngine(
        fullHtml,
        cv,
        {
          id: "default",
          type: "html",
          cv_texts: cvTexts,
        },
        applicationId
      );

      const blob = new Blob([response.data], { type: "application/pdf" });

      if (download) {
        const contentDisposition = response.headers["content-disposition"];
        let filename = "cv.pdf";

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        saveAs(blob, filename);
      } else {
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");
      }

      router.push("/home");
    } catch (error) {
      console.error("Error while generating CV", error);
      setIsCvLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3">
        <div className="flex gap-3">
          <Button
            className=""
            color="primary"
            isLoading={isCvLoading}
            onPress={() => handleDocument(true)}
          >
            {t("common.texts.save_cv")}
          </Button>
        </div>
        <div className="flex flex-row gap-3">
          <div className="shadow-lg">
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.2,
                fontWeight: 400,
                color: "#000",
              }}
            >
              <div className="w-[794px] h-[1123px]" ref={templateRef}>
                <TopBarTemplate />
              </div>
            </div>
          </div>
          <div className="shadow-lg">
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.2,
                fontWeight: 400,
                color: "#000",
              }}
            >
              <div className="w-[794px] h-[1123px]" ref={templateRef}>
                <DefaultTemplate />
              </div>
            </div>
          </div>
          <div className="shadow-lg">
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.2,
                fontWeight: 400,
                color: "#000",
              }}
            >
              <div className="w-[794px] h-[1123px]" ref={templateRef}>
                <LatexLikeTemplate />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
