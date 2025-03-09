import { Button, ButtonProps } from "@heroui/react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const GoogleIcon = ({}) => {
  return (
    <Image
      alt="Google Logo"
      width={20}
      height={20}
      src="icons/companies/google.svg"
    ></Image>
  );
};

export default function GoogleOauthBtn({ ...props }: ButtonProps) {
  const t = useTranslations();
  return (
    <div className="w-full gap-4 items-center">
      <Button
        className="w-full bg-white shadow-md !font-light"
        startContent={<GoogleIcon />}
        color="default"
        {...props}
      >
        {t("common.auth.google_sign_in")}
      </Button>
    </div>
  );
}
