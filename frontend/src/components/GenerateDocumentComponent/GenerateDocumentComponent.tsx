"use client";

import {
  fetcherApiPost,
  generateCvInlineEngine,
  generateCvInlineNoRenderEngine,
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
import { useTranslations } from "next-intl";
import { useLocale } from "@/contexts/LocaleContext";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";

import { saveAs } from "file-saver";
import useSWR from "swr";
import { getQuotaInfoApiLink } from "@/lib/links";
import { useUserStatus } from "@/contexts/UserStatusContext";

export default function GenerateDocumentComponent() {
  const { getTraduction } = useLocale();

  const { setCv, setCvTexts } = useCv();

  const { userStatus } = useUserStatus();

  const router = useRouter();

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    mutate,
    data: quotaInfo,
    isLoading: isQuotaInfoLoading,
  } = useSWR<GetQuotaInfoResponse>(
    [getQuotaInfoApiLink, { action: "generate_cv_inline" }],
    fetcherApiPost
  );

  const t = useTranslations();

  useEffect(() => {}, []);

  const [isCvLoading, setIsCvLoading] = useState(false);

  const handleDocument = async (download = false) => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineEngine(getTraduction());

      const blob = new Blob([response.data], { type: "application/pdf" });

      if (download) {
        const contentDisposition = response.headers["content-disposition"];
        let filename = "cv.pdf";

        if (contentDisposition) {
          const utf8FilenameMatch = contentDisposition.match(
            /filename\*\=UTF-8''([^;]+)/
          );
          if (utf8FilenameMatch && utf8FilenameMatch[1]) {
            filename = decodeURIComponent(utf8FilenameMatch[1]);
          } else {
            const fallbackMatch = contentDisposition.match(/filename="(.+?)"/);
            if (fallbackMatch && fallbackMatch[1]) {
              filename = fallbackMatch[1];
            }
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

    mutate();
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

    mutate();
  };

  return (
    <div className="mt-20">
      {!isQuotaInfoLoading && quotaInfo ? (
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
              isDisabled={
                isCvLoading ||
                quotaInfo?.left === 0 ||
                quotaInfo?.pending >= quotaInfo?.max_pending
              }
            >
              {isCvLoading || quotaInfo?.pending >= quotaInfo?.max_pending
                ? t("common.texts.pending_generation")
                : t("common.texts.generate_cv")}
            </Button>
          </div>
          <div className="mt-4 text-center">
            <p>
              <strong>{t("common.texts.quota_info")}:</strong>
            </p>
            {userStatus.is_freemium && quotaInfo.left === 0 ? (
              <>
                <p>{t("common.texts.generation_finished")}</p>
                <a
                  href="/pricing"
                  className="text-primary-500 underline hover:text-primary-700"
                >
                  {t("common.texts.upgrade_plan")}
                </a>
              </>
            ) : (
              <p>
                {t("common.texts.generation_left", {
                  count: quotaInfo.left,
                })}
              </p>
            )}
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
