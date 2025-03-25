"use client";

import GoogleOauthBtn from "@/shared/components/GoogleOauthBtn";
import { loginApi } from "@/lib/backendService";
import { handleGoogleSignIn } from "@/lib/oauth";

import { addToast, Button, Divider, Input } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { generalInputsStyles } from "@/lib/customStyles";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { setCookieClient } from "@/lib/setCookieClient";
import { MAX_SHORT_TEXT_LENGTH } from "@/lib/consts";
import { emailValidator, requiredValidator } from "@/lib/validator";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginComponent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [onLogin, setOnLogin] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOnLogin(true);

    try {
      axios.defaults.withCredentials = true;

      const loginresponse = await loginApi(formData);

      const auth_cookie = loginresponse.data.auth_cookie;

      const isIframe = window.self !== window.top;

      if (!auth_cookie) {
        router.push("/");
        return;
      }

      if (isIframe) {
        storeExtensionStorageValue("auth_cookie", auth_cookie, () => {
          if (loginresponse.status === 200) {
            router.push("/home");
          }
        });
      } else {
        setCookieClient(
          auth_cookie.name,
          auth_cookie.value,
          auth_cookie.expiration_date
        );
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      addToast({
        title: t("common.errors.login"),
        description: t("common.errors.login_description"),
        color: "danger",
        timeout: 5000,
      });
    }
    setOnLogin(false);
  };

  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);

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
          color="default"
          placeholder={t("common.placeholders.enter_email")}
          name="email"
          value={formData.email}
          onChange={handleChange}
          classNames={generalInputsStyles}
          isRequired
          maxLength={MAX_SHORT_TEXT_LENGTH}
          validate={(value) => {
            return emailValidator(t, value);
          }}
        />
        <Input
          label={t("common.form.password")}
          color="default"
          placeholder={t("common.placeholders.enter_password")}
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          classNames={{
            ...generalInputsStyles,
            inputWrapper: "pr-10",
          }}
          isRequired
          maxLength={MAX_SHORT_TEXT_LENGTH}
          validate={(value) => {
            return requiredValidator(t, value);
          }}
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 text-gray-500 hover:text-primary pointer-events-auto"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
        />
        <Button color="primary" type="submit" isLoading={onLogin}>
          {t("common.auth.login")}
        </Button>
        <p
          className="text-primary cursor-pointer text-sm mt-1"
          onClick={() => {
            const iframe = window.self !== window.top;
            if (iframe) {
              window.open("/password/recovery", "_blank");
            } else {
              router.push("/password/recovery");
            }
          }}
        >
          {t("common.auth.forgot_password")}
        </p>
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
          mode="login"
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
