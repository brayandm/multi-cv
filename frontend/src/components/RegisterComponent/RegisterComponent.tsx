"use client";

import { useState } from "react";
import { Button, Divider, Input, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { loginApi, registerApi } from "@/lib/backendService";
import Link from "next/link";
import { handleGoogleSignIn } from "@/lib/oauth";
import GoogleOauthBtn from "../../shared/components/GoogleOauthBtn";
import { useTranslations } from "next-intl";

export default function RegisterComponent() {
  const router = useRouter();

  const tCommon = useTranslations();
  const t = useTranslations("RegisterPage");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    acceptTerms: false,
    underAge: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const registerResponse = await registerApi(formData);

      if (registerResponse.status === 200) {
        const loginResponse = await loginApi({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse.status === 200) {
          router.push("/home");
        }
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
      <h1 className="text-center">{tCommon("register")}</h1>
      <p>{t("description")}</p>
      <div className="flex flex-col gap-3">
        <Input
          label={tCommon("full-name")}
          placeholder="John Doe"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label={tCommon("email")}
          placeholder="Enter your email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label={tCommon("password")}
          placeholder="Enter your password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          label={tCommon("repeat-password")}
          placeholder="Enter your password"
          type="password"
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={handleChange}
        />
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
            {tCommon("confirm-age")}
          </span>
        </div>

        <div className="flex items-start gap-1">
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span className="text-[9px] text-gray-600 text-left">
            {tCommon("i-accept")}{" "}
            <Link
              href="/terms-and-conditions.html"
              target="_blank"
              className="text-primary underline"
            >
              {tCommon("terms-and-conditions")}
            </Link>{" "}
            {tCommon("and")}{" "}
            <Link
              href="/privacy-policy.html"
              target="_blank"
              className="text-primary underline"
            >
              {tCommon("privacy-policy")}
            </Link>
          </span>
        </div>
        <Button
          color="primary"
          type="submit"
          isDisabled={
            !formData.acceptTerms ||
            !formData.underAge ||
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.repeatPassword ||
            formData.password !== formData.repeatPassword
          }
        >
          {tCommon("register")}
        </Button>
      </div>
      <Divider className="my-4" />
      <p>
        {tCommon("other-method")} |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => router.push("/login")}
        >
          {tCommon("login")}
        </span>
      </p>

      <GoogleOauthBtn
        onPress={() => {
          setTimeout(() => {
            handleGoogleSignIn();
          }, 500);
        }}
      ></GoogleOauthBtn>
    </form>
  );
}
