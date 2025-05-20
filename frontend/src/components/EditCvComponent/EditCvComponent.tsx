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
import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { useTranslations } from "next-intl";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";
import { useWindowSize } from "@/hooks/useWindowSize";
import { SCREEN_SIZES } from "@/lib/consts";

export default function EditCvComponent() {
  const templateRef = useRef<HTMLDivElement>(null);
  const [isCvLoading, setIsCvLoading] = useState(false);
  const {
    cv,
    cvTexts,
    applicationId,
    setCvTemplateId,
    cvTemplateId,
    cleanUp,
    storedCv,
  } = useCv();
  const router = useRouter();
  const t = useTranslations();

  const { width } = useWindowSize();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({
    defaultOpen: true,
  });

  useEffect(() => {
    if (!storedCv) {
      router.push("/home");
    }
  }, [storedCv, router]);

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
          id: cvTemplateId || "default",
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

      cleanUp();

      router.push("/home");
    } catch (error) {
      console.error("Error while generating CV", error);
      setIsCvLoading(false);
    }
  };

  const renderTemplate = () => {
    switch (cvTemplateId) {
      case "topbar":
        return <TopBarTemplate />;
      case "default":
        return <DefaultTemplate />;
      case "professional":
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
    setCvTemplateId(template);

    onClose();
  };

  if (storedCv === false) {
    return <></>;
  }

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
              <ModalHeader className="flex justify-center text-xl sm:text-2xl">
                {t("pages.edit_cv.select_template")}
              </ModalHeader>
              <ModalBody>
                <div className="h-[600px] relative overflow-y-auto">
                  <div
                    style={{
                      transform:
                        "translateX(-50%)" +
                        (width < SCREEN_SIZES.sm
                          ? " scale(0.25)"
                          : " scale(0.40)"),
                      transformOrigin: "top",
                      position: "absolute",
                      left: "50%",
                      display: "inline-block",
                    }}
                  >
                    <div className="flex flex-col xl:flex-row justify-center items-center gap-32">
                      <div
                        style={{
                          transform:
                            width < SCREEN_SIZES.xl ? undefined : "scale(0.90)",
                          transformOrigin: "top",
                        }}
                      >
                        <div
                          onClick={() => setTemplate("topbar")}
                          className="transition-transform hover:scale-105 cursor-pointer pt-32"
                        >
                          {getTemplate(<TopBarTemplate />, false)}
                        </div>
                      </div>

                      <div
                        onClick={() => setTemplate("default")}
                        className="transition-transform hover:scale-105 cursor-pointer"
                      >
                        {getTemplate(<DefaultTemplate />, false)}
                      </div>

                      <div
                        style={{
                          transform:
                            width < SCREEN_SIZES.xl ? undefined : "scale(0.90)",
                          transformOrigin: "top",
                        }}
                      >
                        <div
                          onClick={() => setTemplate("professional")}
                          className="transition-transform hover:scale-105 cursor-pointer pt-32"
                        >
                          {getTemplate(<LatexLikeTemplate />, false)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter />
            </>
          )}
        </ModalContent>
      </Modal>

      {cvTemplateId && (
        <div className="flex flex-col justify-center items-center gap-3">
          <div className="flex gap-3">
            <Button
              color="secondary"
              isLoading={isCvLoading}
              onPress={() => handleDocument(true)}
            >
              {t("common.texts.save_cv")}
            </Button>
            <Button color="primary" onPress={onOpen}>
              {t("pages.edit_cv.change_template")}
            </Button>
          </div>
          <div className="flex flex-col justify-center items-center relative">
            <div
              style={{
                position: "absolute",
                top: 0,
                transform:
                  width < SCREEN_SIZES.sm
                    ? "scale(0.40)"
                    : width < SCREEN_SIZES.md
                    ? "scale(0.60)"
                    : width < SCREEN_SIZES.lg
                    ? "scale(0.80)"
                    : undefined,
                transformOrigin: "top",
                display: "inline-block",
              }}
            >
              <div className="shadow-lg">
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    lineHeight: 1.2,
                    fontWeight: 400,
                    color: "#000",
                  }}
                >
                  <div
                    className="w-[794px] h-[1123px] relative"
                    ref={templateRef}
                  >
                    {renderTemplate()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
