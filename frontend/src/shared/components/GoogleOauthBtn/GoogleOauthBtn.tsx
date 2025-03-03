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
  const tCommon = useTranslations();
  return (
    <div className="w-full gap-4 items-center">
      <Button
        className="w-full"
        color="default"
        startContent={<GoogleIcon />}
        variant="bordered"
        {...props}
      >
        {tCommon("common.auth.google_sign_in")}
      </Button>
    </div>
  );
}
