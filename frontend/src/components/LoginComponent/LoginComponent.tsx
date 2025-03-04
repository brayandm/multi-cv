"use client";

import GoogleOauthBtn from "@/shared/components/GoogleOauthBtn";
import { loginApi } from "@/lib/backendService";
import { handleGoogleSignIn } from "@/lib/oauth";

import { Button, Divider, Input } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRefreshOnVisibility } from "@/hooks/useRefreshOnVisibility";

export default function LoginComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useRefreshOnVisibility();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      const Loginresponse = await loginApi(formData);

      if (Loginresponse.status === 200) {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const t = useTranslations();

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{t("common.auth.login")}</h1>
      <p>{t("pages.login.description")}</p>
      <div className="flex flex-col gap-3">
        <Input
          label={t("common.form.email")}
          placeholder={t("common.placeholders.enter_email")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label={t("common.form.password")}
          placeholder={t("common.placeholders.enter_password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button color="primary" type="submit">
          {t("common.auth.login")}
        </Button>
      </div>
      <Divider className="my-4"></Divider>
      <p>
        {t("common.auth.use_other_method")} |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => router.push("/register")}
        >
          {t("common.auth.register")}
        </span>
      </p>
      <div>
        <GoogleOauthBtn
          onPress={() => {
            setTimeout(() => {
              handleGoogleSignIn();
            }, 500);
          }}
        ></GoogleOauthBtn>
      </div>
    </form>
  );
}
