"use client";

import { useTranslations } from "next-intl";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { userDeleteApi } from "@/lib/backendService";
import { useState } from "react";
import { useUserStatus } from "@/contexts/UserStatusContext";
import { useRouter } from "next/navigation";

export default function AccountDeletionComponent({}) {
  const t = useTranslations();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isDeleting, setIsDeleting] = useState(false);

  const { refreshUserStatus } = useUserStatus();

  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 text-center w-[250px] mx-auto mt-10">
      <h1 className="text-center">{t("pages.account.deletion.title")}</h1>
      <p>{t("pages.account.deletion.description")}</p>
      <div className="flex flex-col gap-2">
        <Button
          color="danger"
          onPress={() => {
            onOpen();
          }}
        >
          {t("pages.settings.delete_account")}
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>{t("common.texts.delete_account")}</h3>
              </ModalHeader>
              <ModalBody>
                <p>{t("common.texts.delete_account_description")}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={async () => {
                    onClose();
                  }}
                >
                  {t("common.buttons.cancel")}
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={async () => {
                    setIsDeleting(true);
                    await userDeleteApi();
                    await refreshUserStatus();
                    router.push("/");
                    setIsDeleting(false);
                  }}
                >
                  {t("pages.settings.delete_account")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
