"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";

export default function CookieBanner() {
  const t = useTranslations();

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const showModal = () => {
        setShowBanner(true);
        window.removeEventListener("click", showModal);
        window.removeEventListener("touchstart", showModal);
      };

      window.addEventListener("click", showModal, { once: true });
      window.addEventListener("touchstart", showModal, { once: true });

      return () => {
        window.removeEventListener("click", showModal);
        window.removeEventListener("touchstart", showModal);
      };
    }
  }, []);

  const handleConsent = (granted: boolean) => {
    const isIframe = window.self !== window.top;

    const value = granted ? "granted" : "denied";

    localStorage.setItem("cookie_consent", value);

    if (isIframe) {
      storeExtensionStorageValue("cookie_consent", value, () => {});
    }
    window.dispatchEvent(new Event("cookie-consent-changed"));
    setShowBanner(false);
  };

  return (
    <>
      <Modal
        isOpen={showBanner}
        onOpenChange={setShowBanner}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={true}
        placement="bottom"
      >
        <ModalContent className="md:max-w-none md:w-[700px]">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("common.legal.cookies")}
              </ModalHeader>
              <ModalBody>
                <p>
                  {t.rich("common.legal.cookies_description", {
                    privacyPolicy: () => (
                      <Link
                        href="/privacy-policy"
                        target="_blank"
                        className="text-primary underline font-medium"
                      >
                        {t("common.legal.privacy_policy")}
                      </Link>
                    ),
                    cookiesPolicy: () => (
                      <Link
                        href="/cookies-policy"
                        target="_blank"
                        className="text-primary underline font-medium"
                      >
                        {t("common.legal.cookies_policy")}
                      </Link>
                    ),
                  })}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => handleConsent(false)}
                >
                  {t("common.buttons.deny")}
                </Button>
                <Button color="primary" onPress={() => handleConsent(true)}>
                  {t("common.buttons.accept")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
