import { Button, ButtonProps } from "@heroui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const GoogleIcon = () => {
  return (
    <Image
      alt="Google Logo"
      width={20}
      height={20}
      src="icons/companies/google.svg"
    />
  );
};

interface GoogleOauthBtnProps extends ButtonProps {
  mode: "login" | "register";
}

export default function GoogleOauthBtn({ ...props }: GoogleOauthBtnProps) {
  const t = useTranslations();
  return (
    <div className="w-full gap-4 items-center">
      <Button
        className="w-full bg-white text-black shadow-md !font-light dark:bg-default-50 dark:text-white dark:border dark:border-default-200"
        startContent={<GoogleIcon />}
        color="default"
        {...props}
      >
        {props.mode === "login"
          ? t("common.auth.google_sign_in")
          : t("common.auth.google_sign_up")}
      </Button>
    </div>
  );
}
