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

export default function CookieBanner() {
  const t = useTranslations();

  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleConsent = (granted: boolean) => {
    localStorage.setItem("cookie_consent", granted ? "granted" : "denied");
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
        <ModalContent>
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
                        className="text-primary underline"
                      >
                        {t("common.legal.privacy_policy")}
                      </Link>
                    ),
                    cookiesPolicy: () => (
                      <Link
                        href="/cookies-policy"
                        target="_blank"
                        className="text-primary underline"
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
