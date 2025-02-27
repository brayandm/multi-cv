"use client";

import {
  acceptTermsVersionApi,
  notifiedTermsVersionApi,
} from "@/lib/backendService";

import { Button, Checkbox } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IAcceptTermsComponentProps {
  acceptTerms: boolean | null;
  noticeTerms: boolean | null;
}

export default function AcceptTermsComponent({
  acceptTerms,
  noticeTerms,
}: IAcceptTermsComponentProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    acceptTerms: false,
    underAge: false,
  });

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let response;
      if (acceptTerms === false && noticeTerms === true) {
        response = await notifiedTermsVersionApi();
      } else {
        response = await acceptTermsVersionApi();
      }

      if (response.status === 200) {
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
      {acceptTerms === null ? (
        <p> Please read and accept.</p>
      ) : (
        <>
          {noticeTerms ? (
            <span>
              <p>
                We are updating our{" "}
                <Link
                  href="/privacy-policy.html"
                  target="_blank"
                  className="text-primary underline"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  href="/terms-and-conditions.html"
                  target="_blank"
                  className="text-primary underline"
                >
                  Terms & Conditions
                </Link>
                . The new terms will take effect in one month and will be
                available for review before then. Please take a moment to review
                the upcoming changes.
              </p>
            </span>
          ) : (
            <p>
              We have updated our privacy policy and terms & conditions. Please
              read and accept to continue using our services.
            </p>
          )}
        </>
      )}
      <div className="flex flex-col gap-3 mt-7">
        {acceptTerms === null && (
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
        )}
        {acceptTerms !== null && noticeTerms !== true && (
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
        )}
        <Button
          color="primary"
          type="submit"
          isDisabled={
            (acceptTerms !== null &&
              noticeTerms !== true &&
              !formData.acceptTerms) ||
            (acceptTerms === null && !formData.underAge)
          }
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
