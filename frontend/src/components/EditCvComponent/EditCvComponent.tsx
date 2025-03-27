"use client";

import { renderHtmlInlineEngine } from "@/lib/backendService";
import DefaultTemplate from "@/templates/default";
import { Button } from "@heroui/react";
import { useRef, useState } from "react";
import { saveAs } from "file-saver";

export default function EditCvComponent() {
  const templateRef = useRef<HTMLDivElement>(null);

  const [isCvLoading, setIsCvLoading] = useState(false);

  const handleDocument = async (download = false) => {
    try {
      setIsCvLoading(true);

      if (!templateRef.current) return;

      const htmlContent = templateRef.current.innerHTML;

      const fullHtml = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 40px; font-family: Arial, sans-serif; }
            .cv-page {
              width: 794px;
              height: 1123px;
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

      const response = await renderHtmlInlineEngine(fullHtml);

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
    } catch (error) {
      console.error("Error while generating CV", error);
    }

    setIsCvLoading(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-3">
        <Button
          className=""
          color="primary"
          isLoading={isCvLoading}
          onPress={() => handleDocument(true)}
        >
          Download CV
        </Button>
        <div className="w-[794px] h-[1123px]" ref={templateRef}>
          <DefaultTemplate />
        </div>
      </div>
    </>
  );
}
