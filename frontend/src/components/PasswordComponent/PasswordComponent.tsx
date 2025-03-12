"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
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
import { syncCookies } from "@/lib/syncCookies";

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

  const router = useRouter();

  const t = useTranslations();

  const { data: userData, isLoading: isUserDataLoading } = useSWR<UserResponse>(
    userApiLink,
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

    if (passwordRecovery) {
      try {
        const passwordRecoveryResetResponse = await passwordRecoveryResetApi({
          email: passwordRecovery.email,
          token: passwordRecovery.token,
          password: formData.password,
          password_confirmation: formData.repeatPassword,
        });

        const auth_cookie = passwordRecoveryResetResponse.data.auth_cookie;

        if (auth_cookie) {
          syncCookies(auth_cookie, () => {
            if (passwordRecoveryResetResponse.status === 200) {
              router.push("/password/recovery/success");
            }
          });
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
        }
      } catch (error) {
        console.log(error);
      }
    }
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
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            classNames={generalInputsStyles}
          />
        )}
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
        <Button
          color="primary"
          type="submit"
          isDisabled={
            (!userData?.is_password_null &&
              !passwordRecovery &&
              !formData.currentPassword) ||
            !formData.password ||
            !formData.repeatPassword ||
            formData.password !== formData.repeatPassword ||
            formData.password.length < 8
          }
        >
          {t("common.buttons.change_password")}
        </Button>
      </div>
    </form>
  );
}
