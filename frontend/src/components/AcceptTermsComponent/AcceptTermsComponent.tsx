"use client";

import { useAcceptTerms } from "@/hooks/useAcceptTerms";
import { useIsNotAuthenticated } from "@/hooks/useIsNotAuthenticated";
import { acceptTermsVersionApi } from "@/lib/backendService";

import { Button, Checkbox } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AcceptTermsComponent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    acceptTerms: false,
    underAge: false,
  });

  const { isLoading } = useIsNotAuthenticated();

  const { acceptTerms, isLoading: acceptTermsLoading } = useAcceptTerms();

  if (isLoading || acceptTermsLoading) {
    return null;
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const acceptTermsResponse = await acceptTermsVersionApi();

      if (acceptTermsResponse.status === 200) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Privacy Policy and Terms & Conditions</h1>
      {acceptTerms == null ? (
        <p> Please read and accept.</p>
      ) : (
        <>
          <p>
            We have updated our privacy policy and terms & conditions. Please
            read and accept to continue.
          </p>
        </>
      )}
      <div className="flex flex-col gap-3 mt-7">
        <div className="flex items-start gap-1">
          <Checkbox
            name="underAge"
            checked={formData.underAge}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span
            className="text-[9px] text-gray-600
          "
          >
            I confirm that I am over 18 years old
          </span>
        </div>

        <div className="flex items-start gap-1">
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span className="text-[9px] text-gray-600">
            I accept the{" "}
            <Link
              href="/terms-and-conditions.html"
              target="_blank"
              className="text-primary underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy.html"
              target="_blank"
              className="text-primary underline"
            >
              Privacy Policy
            </Link>
          </span>
        </div>
        <Button
          color="primary"
          type="submit"
          isDisabled={!formData.acceptTerms || !formData.underAge}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
