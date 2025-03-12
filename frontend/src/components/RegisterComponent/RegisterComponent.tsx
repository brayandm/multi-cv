"use client";

import { useState } from "react";
import { Button, Divider, Input, Checkbox } from "@heroui/react";
import { useRouter } from "next/navigation";
import { loginApi, registerApi } from "@/lib/backendService";
import Link from "next/link";
import { handleGoogleSignIn } from "@/lib/oauth";
import GoogleOauthBtn from "../../shared/components/GoogleOauthBtn";
import { useTranslations } from "next-intl";
import { useRefreshPage } from "@/hooks/useRefreshPage";
import { generalInputsStyles } from "@/lib/customStyles";

export default function RegisterComponent() {
  const router = useRouter();

  const t = useTranslations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    acceptTerms: false,
    underAge: false,
  });

  useRefreshPage();

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
      <h1 className="text-center">{t("common.auth.register")}</h1>
      <p>{t("pages.register.description")}</p>
      <div className="flex flex-col gap-3">
        <Input
          label={t("common.form.full_name")}
          color="default"
          placeholder={t("common.placeholders.enter_full_name")}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          classNames={generalInputsStyles}
        />
        <Input
          label={t("common.form.email")}
          color="default"
          placeholder={t("common.placeholders.enter_email")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          classNames={generalInputsStyles}
        />
        <Input
          label={t("common.form.password")}
          color="default"
          placeholder={t("common.placeholders.enter_password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          classNames={generalInputsStyles}
        />
        <Input
          label={t("common.form.repeat_password")}
          color="default"
          placeholder={t("common.placeholders.enter_password_again")}
          type="password"
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={handleChange}
          classNames={generalInputsStyles}
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
            {t("common.legal.confirm_age")}
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
            {t.rich("common.legal.accept_terms", {
              termsConditions: () => (
                <Link
                  href="/terms-and-conditions.html"
                  target="_blank"
                  className="text-primary underline"
                >
                  {t("common.legal.terms_conditions")}
                </Link>
              ),
              privacyPolicy: () => (
                <Link
                  href="/privacy-policy.html"
                  target="_blank"
                  className="text-primary underline"
                >
                  {t("common.legal.privacy_policy")}
                </Link>
              ),
            })}
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
            formData.password !== formData.repeatPassword ||
            formData.password.length < 8
          }
        >
          {t("common.auth.register")}
        </Button>
      </div>
      <Divider className="my-4" />
      <p>
        {t("common.auth.use_other_method")} |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => router.push("/login")}
        >
          {t("common.auth.login")}
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
