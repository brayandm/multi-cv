"use client";

import { useTranslations } from "next-intl";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Spinner,
  addToast,
} from "@heroui/react";
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_MAX_HEIGHT,
  DEFAULT_CARD_MAX_WIDTH,
  DEFAULT_CARD_WIDTH,
} from "@/lib/consts";

import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  autoFillCvFromDocumentEngine,
  getActionApi,
  getActionByNameApi,
  getQuotaInfoApi,
} from "@/lib/backendService";
import { useProfile } from "@/contexts/ProfileContext";
import { AxiosResponse } from "axios";
import { GetQuotaInfoResponse } from "@/lib/types";
import { useCallbackRedirect } from "@/hooks/useCallbackRedirect";
import AnimatedText from "@/shared/components/AnimatedText";
import { sleep } from "@/lib/utils";

export default function ProfileAutoCvComponent() {
  const width = DEFAULT_CARD_WIDTH;
  const maxWidth = DEFAULT_CARD_MAX_WIDTH;
  const height = DEFAULT_CARD_HEIGHT;
  const maxHeight = DEFAULT_CARD_MAX_HEIGHT;

  const { pullProfile } = useProfile();

  const router = useRouter();
  const t = useTranslations();

  const [file, setFile] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {} = useCallbackRedirect();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const waitForAction = async (actionId: string) => {
    while (true) {
      await sleep(5000);
      try {
        const response = await getActionApi(actionId);

        if (!response || response.data.action === null) {
          break;
        }
      } catch (error) {
        console.error("Error during polling:", error);
        break;
      }
    }
  };

  const handleAutofill = async () => {
    onOpen();

    try {
      const responseAutoFill = await autoFillCvFromDocumentEngine(file as File);
      const actionId = responseAutoFill.data.action_id;

      await waitForAction(actionId);

      await pullProfile();

      router.push("/profile/initial");
    } catch (error) {
      const message = (
        error as unknown as {
          response?: { data?: { error?: string } };
        }
      )?.response?.data?.error;

      console.error("Error during autofill:", error);

      onClose();

      if (message === "Input is unsafe.") {
        addToast({
          title: t("common.errors.autofill"),
          description: t("common.errors.input_unsafe"),
          color: "danger",
          timeout: 10000,
        });
        router.refresh();
      } else {
        addToast({
          title: t("common.errors.autofill"),
          description: t("common.errors.server"),
          color: "danger",
          timeout: 5000,
        });
      }
    }
  };

  const [isQuotaInfoLoading, setIsQuotaInfoLoading] = useState(true);
  const [quotaInfo, setQuotaInfo] = useState<GetQuotaInfoResponse | null>(null);

  const getQuota = useCallback(() => {
    getQuotaInfoApi("auto_fill_cv_from_document")
      .then((response: AxiosResponse<GetQuotaInfoResponse>) => {
        setQuotaInfo(response.data);
        if (
          Object.keys(response.data).length === 0 ||
          response.data.left <= 0
        ) {
          router.push("/profile/initial");
        } else {
          setIsQuotaInfoLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          console.error("Error while fetching quota info", error.message);
        } else {
          console.error("Error while fetching quota info", error);
        }
      });
  }, []); // eslint-disable-line

  useEffect(() => {
    getQuota();
  }, [getQuota]);

  useEffect(() => {
    if (quotaInfo?.pending) {
      const func = async () => {
        onOpen();
        const response = await getActionByNameApi("auto_fill_cv_from_document");

        const actionId = response.data.action?.action_id;

        if (actionId) {
          await waitForAction(actionId);
        }

        await pullProfile();

        router.push("/profile/initial");
      };

      func();
    }
  }, [quotaInfo]); // eslint-disable-line

  if (isQuotaInfoLoading) {
    return null;
  }

  return (
    <main className="flex justify-center">
      <div
        style={{
          maxWidth: `${maxWidth}vw`,
          width: `${width}px`,
        }}
      >
        <form className="flex flex-col gap-2">
          <Card style={{ height: `${height}px`, maxHeight: `${maxHeight}vh` }}>
            <CardHeader className="pb-0 flex flex-col items-start">
              <div className="px-1 py-1">
                <h1>{t("pages.profile.auto_fill.title")}</h1>
                <p>{t("pages.profile.auto_fill.message")}</p>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              <label
                htmlFor="pdf-upload"
                className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-default-100 transition"
              >
                {file ? (
                  <div className="flex h-6 items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <DocumentTextIcon className="w-5 h-5 text-primary" />
                    {file.name}
                  </div>
                ) : (
                  <div className="flex h-6 items-center gap-2 text-gray-500 dark:text-gray-300">
                    <PlusIcon className="w-5 h-5" />
                    <span>{t("common.texts.upload_cv")}</span>
                  </div>
                )}
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="flex flex-col justify-between items-center w-full">
                <Button
                  color="secondary"
                  onPress={handleAutofill}
                  isDisabled={!file}
                >
                  {t("common.buttons.autofill_button")}
                </Button>
              </div>
            </CardBody>
          </Card>
          <div className="flex flex-row justify-between gap-1">
            <Card className="mb-3 w-full">
              <Button
                color="primary"
                onPress={() => {
                  router.push("/profile/initial");
                }}
              >
                {t("common.buttons.next")}
              </Button>
            </Card>
          </div>
        </form>
      </div>

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
                {t("common.texts.loading_autofill_title")}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center gap-4 py-6">
                <p>{t("common.texts.loading_autofill_description")}</p>
                <Spinner />
                <AnimatedText
                  descriptions={[
                    t("pages.profile.auto_fill.loading.descriptions.1"),
                    t("pages.profile.auto_fill.loading.descriptions.2"),
                    t("pages.profile.auto_fill.loading.descriptions.3"),
                    t("pages.profile.auto_fill.loading.descriptions.4"),
                    t("pages.profile.auto_fill.loading.descriptions.5"),
                    t("pages.profile.auto_fill.loading.descriptions.6"),
                    t("pages.profile.auto_fill.loading.descriptions.7"),
                    t("pages.profile.auto_fill.loading.descriptions.8"),
                    t("pages.profile.auto_fill.loading.descriptions.9"),
                    t("pages.profile.auto_fill.loading.descriptions.10"),
                  ]}
                  isCyclic={true}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
