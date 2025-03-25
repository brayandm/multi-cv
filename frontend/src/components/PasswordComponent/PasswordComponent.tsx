"use client";

import { useState } from "react";
import { addToast, Button, Input } from "@heroui/react";
import useSWR from "swr";
import { userApiLink } from "@/lib/links";
import {
  fetcherApi,
  passwordRecoveryResetApi,
  updatePasswordApi,
} from "@/lib/backendService";
import { UserResponse } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { generalInputsStyles } from "@/lib/customStyles";
import { MAX_SHORT_TEXT_LENGTH } from "@/lib/consts";
import { passwordValidator } from "@/lib/validator";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface IPasswordComponentProps {
  passwordRecovery?: {
    email: string;
    token: string;
  };
}

export default function PasswordComponent({
  passwordRecovery,
}: IPasswordComponentProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    repeatPassword: "",
  });

  const [onPasswordChange, setOnPasswordChange] = useState(false);

  const router = useRouter();

  const t = useTranslations();

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const { data: userData, isLoading: isUserDataLoading } = useSWR<UserResponse>(
    passwordRecovery ? null : userApiLink,
    fetcherApi
  );

  if (isUserDataLoading) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOnPasswordChange(true);

    if (passwordRecovery) {
      try {
        const passwordRecoveryResetResponse = await passwordRecoveryResetApi({
          email: passwordRecovery.email,
          token: passwordRecovery.token,
          password: formData.password,
          password_confirmation: formData.repeatPassword,
        });

        if (passwordRecoveryResetResponse.status === 200) {
          router.push("/password/recovery/success");
        }
      } catch (error) {
        console.log(error);
        router.push("/password/recovery/fail");
      }
    } else {
      try {
        const updatePasswordResponse = await updatePasswordApi({
          currentPassword: formData.currentPassword,
          password: formData.password,
        });

        if (updatePasswordResponse.status === 200) {
          addToast({
            title: t("common.success.password_change"),
            description: t("common.success.password_change_description"),
            color: "success",
            timeout: 5000,
          });
        }
      } catch (error) {
        console.log(error);
        const message = (
          error as unknown as {
            response?: { data?: { errors: string } };
          }
        )?.response?.data?.errors;
        if (message === "Old password is incorrect") {
          addToast({
            title: t("common.errors.password_change"),
            description: t("common.errors.old_password_incorrect"),
            color: "danger",
            timeout: 5000,
          });
        } else {
          addToast({
            title: t("common.errors.password_change"),
            description: t("common.errors.server"),
            color: "danger",
            timeout: 5000,
          });
        }
      }
    }

    setOnPasswordChange(false);
  };

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{t("common.form.new_password")}</h1>
      <p>{t("common.placeholders.enter_new_password")}</p>
      <div className="flex flex-col gap-3">
        {!userData?.is_password_null && !passwordRecovery && (
          <Input
            label={t("common.form.current_password")}
            color="default"
            placeholder={t("common.placeholders.enter_current_password")}
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            classNames={{
              ...generalInputsStyles,
              inputWrapper: "pr-10",
            }}
            isRequired
            minLength={8}
            maxLength={MAX_SHORT_TEXT_LENGTH}
            validate={(value) => {
              return passwordValidator(t, value);
            }}
            endContent={
              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-3 text-gray-500 hover:text-primary pointer-events-auto"
                tabIndex={-1}
              >
                {showCurrentPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />
        )}
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
          classNames={{
            ...generalInputsStyles,
            inputWrapper: "pr-10",
          }}
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
        <Button color="primary" type="submit" isLoading={onPasswordChange}>
          {t("common.buttons.change_password")}
        </Button>
      </div>
    </form>
  );
}
