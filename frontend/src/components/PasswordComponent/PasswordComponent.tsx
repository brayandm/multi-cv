"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import useSWR from "swr";
import { userApiLink } from "@/lib/links";
import { fetcherApi, updatePasswordApi } from "@/lib/backendService";
import { UserResponse } from "@/lib/types";
import { useTranslations } from "next-intl";

export default function PasswordComponent() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    repeatPassword: "",
  });

  const tCommon = useTranslations();

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
  };

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">{tCommon("change-password")}</h1>
      <p>{tCommon("enter-new-password")}</p>
      <div className="flex flex-col gap-3">
        {!userData?.is_password_null && (
          <Input
            label={tCommon("current-password")}
            placeholder={tCommon("enter-current-password")}
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        )}
        <Input
          label={tCommon("password")}
          placeholder={tCommon("enter-password")}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          label={tCommon("repeat-password")}
          placeholder={tCommon("enter-password-again")}
          type="password"
          name="repeatPassword"
          value={formData.repeatPassword}
          onChange={handleChange}
        />
        <Button
          color="primary"
          type="submit"
          isDisabled={
            (!userData?.is_password_null && !formData.currentPassword) ||
            !formData.password ||
            !formData.repeatPassword ||
            formData.password !== formData.repeatPassword
          }
        >
          {tCommon("change-password")}
        </Button>
      </div>
    </form>
  );
}
