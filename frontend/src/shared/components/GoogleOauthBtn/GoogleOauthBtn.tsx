import { Button, ButtonProps } from "@heroui/react";
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
  return (
    <div className="w-full gap-4 items-center">
      <Button
        className="w-full"
        color="default"
        startContent={<GoogleIcon />}
        variant="bordered"
        {...props}
      >
        Sign in with Google
      </Button>
    </div>
  );
}
