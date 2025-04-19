import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { useCallback } from "react";
import { moderationEngine } from "@/lib/backendService";

export function useModeration(
  toastTitle: string,
  onClose: () => void = () => {}
) {
  const t = useTranslations();
  const router = useRouter();

  const moderate = useCallback(
    async (text: string) => {
      try {
        await moderationEngine(text);
        return true;
      } catch (error) {
        const message = (
          error as {
            response?: { data?: { error?: string } };
          }
        )?.response?.data?.error;

        console.error("Error during moderation:", error);
        onClose();

        if (message === "Input is unsafe.") {
          addToast({
            title: toastTitle,
            description: t("common.errors.input_unsafe"),
            color: "danger",
            timeout: 10000,
          });
          router.refresh();
        } else {
          addToast({
            title: toastTitle,
            description: t("common.errors.server"),
            color: "danger",
            timeout: 5000,
          });
        }

        return false;
      }
    },
    [toastTitle, t, router, onClose]
  );

  return moderate;
}
