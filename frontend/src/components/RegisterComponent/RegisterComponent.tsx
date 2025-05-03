"use client";

import { useEffect, useState } from "react";
import { Button, Divider, Input, Checkbox, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { loginApi, registerApi } from "@/lib/backendService";
import Link from "next/link";
import { handleGoogleSignIn } from "@/lib/oauth";
import GoogleOauthBtn from "../../shared/components/GoogleOauthBtn";
import { useTranslations } from "next-intl";
import { generalInputsStyles } from "@/lib/customStyles";
import { storeExtensionStorageValue } from "@/lib/storeExtensionStorageValue";
import { setCookieClient } from "@/lib/setCookieClient";
import { MAX_SHORT_TEXT_LENGTH } from "@/lib/consts";
import {
  emailValidator,
  passwordValidator,
  requiredValidator,
} from "@/lib/validator";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useCallbackRedirect } from "@/hooks/useCallbackRedirect";
import { useLocale } from "@/contexts/LocaleContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function RegisterComponent() {
  const router = useRouter();

  const t = useTranslations();

  const { locale } = useLocale();

  const { updateLocale } = useLocale();
  const { updateTheme } = useTheme();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    acceptTerms: false,
    underAge: false,
    talentPool: false,
    locale: "",
  });

  const [onRegister, setOnRegister] = useState(false);

  const { callbackUrl, redirectToCallback } = useCallbackRedirect();

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

  useEffect(() => {
    if (formData.underAge) {
      setUnderAgeError(false);
    }
    if (formData.acceptTerms) {
      setAcceptTermsError(false);
    }
  }, [formData.underAge, formData.acceptTerms]);

  const [underAgeError, setUnderAgeError] = useState(false);
  const [acceptTermsError, setAcceptTermsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUnderAgeError(false);

    if (!formData.underAge) {
      setUnderAgeError(true);
    }

    if (!formData.acceptTerms) {
      setAcceptTermsError(true);
    }

    if (!formData.underAge || !formData.acceptTerms) {
      return;
    }

    setOnRegister(true);

    try {
      formData.locale = locale;
      const registerResponse = await registerApi(formData);

      if (registerResponse.status === 200) {
        const loginResponse = await loginApi({
          email: formData.email,
          password: formData.password,
        });

        const auth_cookie = loginResponse.data.auth_cookie;

        const isIframe = window.self !== window.top;

        if (!auth_cookie) {
          router.push("/");
          return;
        }

        if (isIframe) {
          storeExtensionStorageValue("auth_cookie", auth_cookie, async () => {
            if (loginResponse.status === 200) {
              await updateLocale();
              await updateTheme();
              router.push("/home");
            }
          });
        } else {
          setCookieClient(
            auth_cookie.name,
            auth_cookie.value,
            auth_cookie.expiration_date
          ).then(async () => {
            await updateLocale();
            await updateTheme();
            if (callbackUrl) {
              redirectToCallback();
            } else {
              router.push("/home");
            }
          });
        }
      }
    } catch (error: unknown) {
      const message = (
        error as unknown as {
          response?: { data?: { errors?: { email?: string[] } } };
        }
      )?.response?.data?.errors?.email?.[0];
      if (message === "The email has already been taken.") {
        addToast({
          title: t("common.errors.register"),
          description: t("common.errors.register_description"),
          color: "danger",
          timeout: 5000,
        });
      } else {
        addToast({
          title: t("common.errors.register"),
          description: t("common.errors.server"),
          color: "danger",
          timeout: 5000,
        });
      }
    }

    setOnRegister(false);
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{t("common.auth.register")}</h1>
      <p>{t("pages.register.description")}</p>
      <div className="flex flex-col gap-3">
        <Input
          label={t("common.form.first_name")}
          color="default"
          placeholder={t("common.placeholders.enter_first_name")}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          classNames={generalInputsStyles}
          isRequired
          maxLength={MAX_SHORT_TEXT_LENGTH}
          validate={(value) => {
            return requiredValidator(t, value);
          }}
        />
        <Input
          label={t("common.form.last_name")}
          color="default"
          placeholder={t("common.placeholders.enter_last_name")}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          classNames={generalInputsStyles}
          isRequired
          maxLength={MAX_SHORT_TEXT_LENGTH}
          validate={(value) => {
            return requiredValidator(t, value);
          }}
        />
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
          classNames={generalInputsStyles}
          isRequired
          minLength={8}
          maxLength={MAX_SHORT_TEXT_LENGTH}
          validate={(value) => {
            return passwordValidator(t, value);
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

        <Input
          label={t("common.form.repeat_password")}
          color="default"
          placeholder={t("common.placeholders.enter_password_again")}
          type={showRepeatPassword ? "text" : "password"}
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={handleChange}
          classNames={generalInputsStyles}
          isRequired
          minLength={8}
          isInvalid={formData.password !== formData.repeatPassword}
          errorMessage={
            formData.password !== formData.repeatPassword
              ? t("common.errors.passwords_not_match")
              : ""
          }
          maxLength={MAX_SHORT_TEXT_LENGTH}
          endContent={
            <button
              type="button"
              onClick={() => setShowRepeatPassword((prev) => !prev)}
              className="absolute right-3 text-gray-500 hover:text-primary pointer-events-auto"
              tabIndex={-1}
            >
              {showRepeatPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          }
        />

        <div className="flex items-start gap-1">
          <Checkbox
            name="underAge"
            checked={formData.underAge}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span
            className="text-[9px] text-gray-600 dark:text-gray-300 text-left
          "
          >
            {t("common.legal.confirm_age")}
          </span>
        </div>
        {underAgeError && (
          <p className="text-left text-danger text-[9px]">
            {t("common.errors.under_age")}
          </p>
        )}

        <div className="flex items-start gap-1">
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span className="text-[9px] text-gray-600 dark:text-gray-300 text-left">
            {t.rich("common.legal.accept_terms", {
              termsConditions: () => (
                <Link
                  href="/terms-and-conditions"
                  target="_blank"
                  className="text-primary underline font-medium"
                >
                  {t("common.legal.terms_conditions")}
                </Link>
              ),
              privacyPolicy: () => (
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="text-primary underline font-medium"
                >
                  {t("common.legal.privacy_policy")}
                </Link>
              ),
            })}
          </span>
        </div>
        {acceptTermsError && (
          <p className="text-left text-danger text-[9px]">
            {t("common.errors.accept_terms")}
          </p>
        )}
        <div className="flex items-start gap-1">
          <Checkbox
            name="talentPool"
            checked={formData.talentPool}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span
            className="text-[9px] text-gray-600 dark:text-gray-300 text-left
          "
          >
            {t("common.legal.talent_pool")}
          </span>
        </div>
        <Button color="primary" type="submit" isLoading={onRegister}>
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
        mode="register"
        onPress={() => {
          setTimeout(() => {
            handleGoogleSignIn();
          }, 500);
        }}
      ></GoogleOauthBtn>
    </form>
  );
}
