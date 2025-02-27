"use client";

import { Button } from "@heroui/react";

interface IEmailVerificationComponentProps {
  type: "already-verified" | "success" | "expired" | "verification";
}

export default function EmailVerificationComponent({
  type,
}: IEmailVerificationComponentProps) {
  return (
    <>
      {type === "verification" && (
        <>
          <form className="flex flex-col gap-2 text-center w-[250px] mx-auto">
            <h1 className="text-center">Email Verification</h1>
            <p> We have sent you an email with a verification link.</p>
            <Button color="primary" type="submit">
              Resend Email
            </Button>
          </form>
        </>
      )}
      {type === "already-verified" && (
        <>
          <form className="flex flex-col gap-2 text-center w-[250px] mx-auto">
            <h1 className="text-center">Email Verification Already Verified</h1>
            <p> Your email has already been verified.</p>
            <Button color="primary" type="submit">
              Continue
            </Button>
          </form>
        </>
      )}
      {type === "success" && (
        <>
          <form className="flex flex-col gap-2 text-center w-[250px] mx-auto">
            <h1 className="text-center">Email Verification Success</h1>

            <p>Your email has been verified.</p>
            <Button color="primary" type="submit">
              Continue
            </Button>
          </form>
        </>
      )}
      {type === "expired" && (
        <>
          <form className="flex flex-col gap-2 text-center w-[250px] mx-auto">
            <h1 className="text-center">Email Verification Expired</h1>

            <p>Your email verification link has expired.</p>
            <Button color="primary" type="submit">
              Resend Email
            </Button>
          </form>
        </>
      )}
    </>
  );
}
