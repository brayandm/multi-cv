import { Button, ButtonProps } from "@heroui/react";

export const GoogleIcon = ({ ...props }) => {
  return <img width={20} height={20} src="icons/companies/google.svg"></img>;
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
        Enter with Google
      </Button>
    </div>
  );
}
