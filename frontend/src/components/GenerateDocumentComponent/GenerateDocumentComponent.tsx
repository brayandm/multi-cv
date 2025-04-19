"use client";

import {
  fetcherApiPost,
  fetcherEngine,
  generateCvInlineEngine,
  generateCvInlineNoRenderEngine,
  storeSettingsEngine,
} from "@/lib/backendService";

import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { GetQuotaInfoResponse, Settings } from "@/lib/types";
import { useTranslations } from "next-intl";
import {
  languages,
  unsupportedLanguages,
  useLocale,
} from "@/contexts/LocaleContext";
import { useCv } from "@/contexts/CvContext";
import { useRouter } from "next/navigation";

import { saveAs } from "file-saver";
import useSWR from "swr";
import { getQuotaInfoApiLink, getSettingsEngineLink } from "@/lib/links";
import {
  MAX_EXTRA_LONG_TEXT_LENGTH,
  MAX_LONG_TEXT_LENGTH,
  MAX_SHORT_TEXT_LENGTH,
} from "@/lib/consts";
import { requiredValidator } from "@/lib/validator";
import InputModalComponent from "@/shared/components/InputModalComponent";
import { generalInputsStyles } from "@/lib/customStyles";
import AnimatedText from "@/shared/components/AnimatedText";

interface IGenerateDocumentComponentProps {
  type?: "simple" | "role" | "job";
}

export default function GenerateDocumentComponent({
  type = "simple",
}: IGenerateDocumentComponentProps) {
  const { getTraduction } = useLocale();

  const { setCv, setCvTexts } = useCv();

  const router = useRouter();

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [input, setInput] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [targetLocale, setTargetLocale] = useState("");
  const [inputModalOpen, setInputModalOpen] = useState(false);

  const {
    mutate,
    data: quotaInfo,
    isLoading: isQuotaInfoLoading,
  } = useSWR<GetQuotaInfoResponse>(
    [getQuotaInfoApiLink, { action: "generate_cv" }],
    fetcherApiPost
  );

  const {
    mutate: mutateSettings,
    data: Settings,
    isLoading: isSettingsLoading,
  } = useSWR<Settings>(getSettingsEngineLink, fetcherEngine);

  const saveTargetLocale = useCallback(
    async (locale: string) => {
      await storeSettingsEngine({
        target_locale: locale,
      });
      mutateSettings();
    },
    [mutateSettings]
  );

  useEffect(() => {
    if (Settings) {
      let locale = Settings.target_locale || getTraduction().locale;

      if (unsupportedLanguages?.includes(locale)) {
        locale = "en";
      }

      setTargetLocale(locale);
      if (!Settings.target_locale) {
        saveTargetLocale(locale);
      }
    }
  }, [Settings, getTraduction, saveTargetLocale]);

  const t = useTranslations();

  const [isCvLoading, setIsCvLoading] = useState(false);

  const handleDocument = async (download = false) => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineEngine(
        {
          type: type,
          role_input: type === "role" ? input : null,
          job_input: type === "job" ? input : null,
          custom_prompt: customPrompt,
        },
        {
          locale: targetLocale,
        }
      );

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
      const message = (
        error as unknown as {
          response?: { data?: { error?: string } };
        }
      )?.response?.data?.error;

      console.error("Error while generating CV", error);

      if (message === "Input is unsafe.") {
        addToast({
          title: t("common.errors.generate_cv"),
          description: t("common.errors.input_unsafe"),
          color: "danger",
          timeout: 10000,
        });
        router.refresh();
      } else {
        addToast({
          title: t("common.errors.generate_cv"),
          description: t("common.errors.server"),
          color: "danger",
          timeout: 5000,
        });
      }
    }

    setIsCvLoading(false);

    mutate();
  };

  const redirectEditCv = async () => {
    try {
      setIsCvLoading(true);
      const response = await generateCvInlineNoRenderEngine(
        {
          type: type,
          role_input: type === "role" ? input : null,
          job_input: type === "job" ? input : null,
          custom_prompt: customPrompt,
        },
        {
          locale: targetLocale,
        }
      );
      if (response.data) {
        setCv(response.data.cv);
        setCvTexts(response.data.cv_texts);
      }

      router.push("/edit/cv");
    } catch (error) {
      const message = (
        error as unknown as {
          response?: { data?: { error?: string } };
        }
      )?.response?.data?.error;

      console.error("Error while generating CV", error);

      if (message === "Input is unsafe.") {
        addToast({
          title: t("common.errors.generate_cv"),
          description: t("common.errors.input_unsafe"),
          color: "danger",
          timeout: 10000,
        });
        router.refresh();
      } else {
        addToast({
          title: t("common.errors.generate_cv"),
          description: t("common.errors.server"),
          color: "danger",
          timeout: 5000,
        });
      }
    }

    setIsCvLoading(false);

    mutate();
  };

  const savePrompt = async () => {
    try {
      await storeSettingsEngine({
        custom_prompt: customPrompt,
      });
    } catch (error) {
      const message = (
        error as unknown as {
          response?: { data?: { error?: string } };
        }
      )?.response?.data?.error;

      console.error("Error during prompt save:", error);

      if (message === "Input is unsafe.") {
        addToast({
          title: t("common.errors.custom_prompt"),
          description: t("common.errors.input_unsafe"),
          color: "danger",
          timeout: 10000,
        });
        router.refresh();
      } else {
        addToast({
          title: t("common.errors.custom_prompt"),
          description: t("common.errors.server"),
          color: "danger",
          timeout: 5000,
        });
      }
    }
    mutateSettings();
  };

  return (
    <form
      className="w-full max-w-96 flex flex-col items-center"
      onSubmit={async (e) => {
        e.preventDefault();
        onOpen();
        if (true) {
          await handleDocument(true);
        } else {
          await redirectEditCv();
        }
        onClose();
      }}
    >
      {!isQuotaInfoLoading && quotaInfo ? (
        <>
          <div className="flex flex-row items-center justify-between w-full mb-5">
            <Select
              key={type}
              className={"max-w-40 " + (type !== "simple" ? "mb-5" : "mb-10")}
              items={languages.filter(
                (lang) => !unsupportedLanguages?.includes(lang.code)
              )}
              variant="bordered"
              label={t("common.texts.target_language")}
              selectedKeys={[targetLocale]}
              onChange={(e) => {
                setTargetLocale(e.target.value);
                saveTargetLocale(e.target.value);
              }}
              labelPlacement="outside"
            >
              {(language) => (
                <SelectItem key={language.code}>{language.label}</SelectItem>
              )}
            </Select>

            <Button
              variant={"light"}
              color="secondary"
              className={type !== "simple" ? "self-end mb-5" : "mt-6 mb-10"}
              onPress={() => {
                setInputModalOpen(true);
                setCustomPrompt(Settings?.custom_prompt || "");
              }}
            >
              {t("common.buttons.custom_prompt")}
            </Button>
            {inputModalOpen && (
              <InputModalComponent
                title={t("pages.home.tabs.builder.custom_prompt.title")}
                placeholder={t(
                  "pages.home.tabs.builder.custom_prompt.placeholder"
                )}
                isInputLoading={isSettingsLoading}
                input={customPrompt}
                setInput={setCustomPrompt}
                open={inputModalOpen}
                setOpen={setInputModalOpen}
                onSave={savePrompt}
                onCancel={async () => {
                  await mutateSettings();
                }}
                maxCharacters={MAX_LONG_TEXT_LENGTH}
              />
            )}
          </div>
          {type === "role" && (
            <div className="mb-10 w-full  flex flex-col items-center">
              <Textarea
                label={t(
                  "pages.home.tabs.builder.tabs.based_on_role.input.label"
                )}
                placeholder={t(
                  "pages.home.tabs.builder.tabs.based_on_role.input.placeholder"
                )}
                labelPlacement="outside"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_SHORT_TEXT_LENGTH}
                description={`${input.length} / 100`}
                isRequired
                validate={(value) => {
                  return requiredValidator(t, value);
                }}
                classNames={generalInputsStyles}
                maxRows={5}
              />
            </div>
          )}
          {type === "job" && (
            <div className="mb-10 w-full max-w-96 flex flex-col items-center">
              <Textarea
                label={t(
                  "pages.home.tabs.builder.tabs.based_on_job_post.input.label"
                )}
                placeholder={t(
                  "pages.home.tabs.builder.tabs.based_on_job_post.input.placeholder"
                )}
                labelPlacement="outside"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_EXTRA_LONG_TEXT_LENGTH}
                description={`${input.length} / 10000`}
                isRequired
                validate={(value) => {
                  return requiredValidator(t, value);
                }}
                classNames={generalInputsStyles}
                maxRows={5}
              />
            </div>
          )}
          <div className="flex justify-center">
            <Button
              color="secondary"
              type="submit"
              isDisabled={
                isCvLoading ||
                quotaInfo?.left === 0 ||
                quotaInfo?.pending >= quotaInfo?.max_pending ||
                isQuotaInfoLoading ||
                isSettingsLoading
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
            {quotaInfo.is_freemium && quotaInfo.left === 0 ? (
              <>
                <p>{t("common.texts.generation_finished")}</p>
                <p
                  className="font-semibold text-warning underline hover:text-warning-600 cursor-pointer"
                  onClick={() => {
                    router.push("/pricing");
                  }}
                >
                  {t("common.texts.upgrade_plan")}
                </p>
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
                <AnimatedText
                  descriptions={[
                    t("pages.home.tabs.builder.loading.descriptions.1"),
                    t("pages.home.tabs.builder.loading.descriptions.2"),
                    t("pages.home.tabs.builder.loading.descriptions.3"),
                    t("pages.home.tabs.builder.loading.descriptions.4"),
                    t("pages.home.tabs.builder.loading.descriptions.5"),
                    t("pages.home.tabs.builder.loading.descriptions.6"),
                    t("pages.home.tabs.builder.loading.descriptions.7"),
                    t("pages.home.tabs.builder.loading.descriptions.8"),
                    t("pages.home.tabs.builder.loading.descriptions.9"),
                    t("pages.home.tabs.builder.loading.descriptions.10"),
                  ]}
                  isCyclic={false}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </form>
  );
}
