"use client";

import {
  generateCvInlineEngine,
  generateCvInlineNoRenderEngine,
  getQuotaInfoApi,
} from "@/lib/backendService";

import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { GetQuotaInfoResponse } from "@/lib/types";
import { AxiosResponse } from "axios";
import { useTranslations } from "next-intl";
import { useLocale } from "@/contexts/LocaleContext";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";

import { saveAs } from "file-saver";

export default function GenerateDocumentComponent() {
  const { getTraduction } = useLocale();

  const { setCv, setCvTexts } = useCv();

  const router = useRouter();

  const [isQuotaInfoLoading, setIsQuotaInfoLoading] = useState(false);
  const [quotaInfo, setQuotaInfo] = useState<GetQuotaInfoResponse | null>(null);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const t = useTranslations();

  const getQuota = () => {
    getQuotaInfoApi("generate_cv_inline")
      .then((response: AxiosResponse<GetQuotaInfoResponse>) => {
        setQuotaInfo(response.data);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error while fetching quota info", error.message);
        } else {
          console.error("Error while fetching quota info", error);
        }
      })
      .finally(() => {
        setIsQuotaInfoLoading(false);
      });
  };

  useEffect(() => {
    getQuota();
  }, []);

  const [isCvLoading, setIsCvLoading] = useState(false);

  if (isQuotaInfoLoading) {
    return null;
  }

  const handleDocument = async (download = false) => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineEngine(getTraduction());

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
      addToast({
        title: t("common.errors.generate_cv"),
        description: t("common.errors.server"),
        color: "danger",
        timeout: 5000,
      });
    }

    setIsCvLoading(false);
    getQuota();
  };

  const redirectEditCv = async () => {
    try {
      setIsCvLoading(true);
      const traduction = getTraduction();
      const response = await generateCvInlineNoRenderEngine(traduction);
      if (response.data) {
        setCv(response.data.cv);
        setCvTexts(response.data.cv_texts);
      }

      router.push("/edit/cv");
    } catch (error) {
      console.error("Error while generating CV", error);
      addToast({
        title: t("common.errors.generate_cv"),
        description: t("common.errors.server"),
        color: "danger",
        timeout: 5000,
      });
    }

    setIsCvLoading(false);
    getQuota();
  };

  return (
    <div className="mt-20">
      {quotaInfo ? (
        <>
          <div className="flex justify-center">
            <Button
              color="primary"
              onPress={async () => {
                onOpen();
                if (true) {
                  await handleDocument(true);
                } else {
                  await redirectEditCv();
                }
                onClose();
              }}
              isDisabled={isCvLoading || quotaInfo?.left === 0}
            >
              {t("common.texts.generate_cv")}
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p>
              <strong>{t("common.texts.quota_info")}:</strong>
            </p>
            <p>
              {t("common.texts.generation_left", {
                count: quotaInfo.left,
              })}
            </p>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <Spinner variant="dots" />
        </div>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="text-center">
                {t("common.texts.loading_generating_cv_title")}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center gap-4 py-6">
                <Spinner />
                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  {t("common.texts.loading_generating_cv_description")}
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
