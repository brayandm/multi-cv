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
} from "@heroui/react";
import {
  DEFAULT_CARD_HEIGHT,
  DEFAULT_CARD_MAX_WIDTH,
  DEFAULT_CARD_WIDTH,
} from "@/lib/consts";

import { PlusIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { autoFillCvFromDocumentEngine } from "@/lib/backendService";
import { useProfile } from "@/contexts/ProfileContext";

export default function ProfileAutoCvComponent() {
  const width = DEFAULT_CARD_WIDTH;
  const maxWidth = DEFAULT_CARD_MAX_WIDTH;
  const height = DEFAULT_CARD_HEIGHT;

  const { pullProfile } = useProfile();

  const router = useRouter();
  const t = useTranslations();

  const [file, setFile] = useState<File | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const handleAutofill = async () => {
    onOpen();

    await autoFillCvFromDocumentEngine(file as File);

    await pullProfile();

    router.push("/profile/initial");
  };

  return (
    <main className="flex justify-center">
      <div
        style={{
          maxWidth: `${maxWidth}vw`,
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        <form className="flex flex-col gap-2">
          <Card style={{ height: `${height}px` }}>
            <CardHeader className="pb-0 flex flex-col items-start">
              <div className="px-1 py-1">
                <h1>{t("pages.profile.auto_fill.title")}</h1>
                <p>{t("pages.profile.auto_fill.message")}</p>
              </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-6">
              <label
                htmlFor="pdf-upload"
                className="flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-4 cursor-pointer hover:bg-gray-50 transition"
              >
                {file ? (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <DocumentTextIcon className="w-5 h-5 text-primary" />
                    {file.name}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-500">
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
                {file && (
                  <Button color="secondary" onPress={handleAutofill}>
                    {t("common.buttons.autofill_button")}
                  </Button>
                )}
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
                {t("common.texts.loading_title")}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center justify-center gap-4 py-6">
                <Spinner />
                <p className="text-center text-sm text-gray-600">
                  {t("common.texts.loading_autofill")}
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
