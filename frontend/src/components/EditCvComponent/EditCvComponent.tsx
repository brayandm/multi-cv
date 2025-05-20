"use client";

import { renderHtmlInlineEngine } from "@/lib/backendService";
import DefaultTemplate from "@/templates/DefaultTemplate";
import TopBarTemplate from "@/templates/TopBarTemplate";
import LatexLikeTemplate from "@/templates/LatexLikeTemplate";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";

export default function EditCvComponent() {
  const templateRef = useRef<HTMLDivElement>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const { cv, cvTexts, applicationId } = useCv();
  const router = useRouter();
  const t = useTranslations();

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({
    defaultOpen: true,
  });

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

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "topbar":
        return <TopBarTemplate />;
      case "default":
        return <DefaultTemplate />;
      case "latex":
        return <LatexLikeTemplate />;
      default:
        return null;
    }
  };

  const getTemplate = (template: React.ReactNode, editable: boolean) => {
    return (
      <div className="shadow-lg">
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            lineHeight: 1.2,
            fontWeight: 400,
            color: "#000",
          }}
        >
          <div className="w-[794px] h-[1123px] relative">
            {template}
            {!editable && (
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-auto" />
            )}
          </div>
        </div>
      </div>
    );
  };

  const setTemplate = (template: string) => {
    setSelectedTemplate(template);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton
      >
        <ModalContent className="max-w-[90vw] w-[90vw]">
          {() => (
            <>
              <ModalHeader className="flex justify-center">
                Select a Template
              </ModalHeader>
              <ModalBody>
                <div className="h-[600px]">
                  <div
                    style={{
                      transform: "scale(0.40)",
                      transformOrigin: "top",
                    }}
                    className="flex flex-row justify-center items-center gap-3"
                  >
                    <div
                      onClick={() => setTemplate("topbar")}
                      className="transition-transform hover:scale-105 cursor-pointer"
                    >
                      {getTemplate(<TopBarTemplate />, false)}
                    </div>
                    <div
                      onClick={() => setTemplate("default")}
                      className="transition-transform hover:scale-105 cursor-pointer"
                    >
                      {getTemplate(<DefaultTemplate />, false)}
                    </div>
                    <div
                      onClick={() => setTemplate("latex")}
                      className="transition-transform hover:scale-105 cursor-pointer"
                    >
                      {getTemplate(<LatexLikeTemplate />, false)}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Vista principal de edición */}
      {selectedTemplate && (
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="flex gap-3">
            <Button
              color="primary"
              isLoading={isCvLoading}
              onPress={() => handleDocument(true)}
            >
              {t("common.texts.save_cv")}
            </Button>
            <Button variant="ghost" onPress={onOpen}>
              Select another template
            </Button>
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
                {renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
