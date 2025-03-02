"use client";

import GoogleOauthBtn from "@/shared/components/GoogleOauthBtn";
import { loginApi } from "@/lib/backendService";
import { handleGoogleSignIn } from "@/lib/oauth";

import { Button, Divider, Input } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function LoginComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const t = useTranslations("LoginPage");
  const tCommon = useTranslations();

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{tCommon("login")}</h1>
      <p>{t("description")}</p>
      <div className="flex flex-col gap-3">
        <Input
          label={tCommon("email")}
          placeholder={tCommon("enter-email")}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Input
          label={tCommon("password")}
          placeholder={tCommon("enter-password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button color="primary" type="submit">
          {tCommon("login")}
        </Button>
      </div>
      <Divider className="my-4"></Divider>
      <p>
        {tCommon("other-method")} |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => router.push("/register")}
        >
          {tCommon("register")}
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
