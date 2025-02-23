"use client";

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

  if (isLoading) {
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
      className="flex flex-col gap-2 mt-8 text-center w-[300px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Privacy Policy and Terms & Conditions</h1>
      <p> Please read and accept</p>
      <div className="flex flex-col gap-3 mt-7">
        <div className="flex items-start gap-1">
          <Checkbox
            name="underAge"
            checked={formData.underAge}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span
            className="text-xs text-gray-600
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
          <span className="text-xs text-gray-600">
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
