"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { useIsNotAuthenticated } from "@/hooks/useIsNotAuthenticated";
import useSWR from "swr";
import { userApiLink } from "@/lib/links";
import { fetcherApi, updatePasswordApi } from "@/lib/backendService";
import { UserResponse } from "@/lib/types";

export default function PasswordComponent() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    repeatPassword: "",
  });

  const { authenticated, isLoading } = useIsNotAuthenticated();

  const { data: userData, isLoading: isUserDataLoading } = useSWR<UserResponse>(
    authenticated ? userApiLink : null,
    fetcherApi
  );

  if (isLoading || isUserDataLoading) {
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
      <h1 className="text-center">Change Password</h1>
      <p>Enter your new password</p>
      <div className="flex flex-col gap-3">
        {!userData?.is_password_null && (
          <Input
            label="Current Password"
            placeholder="Enter your password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        )}
        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Input
          label="Repeat the password"
          placeholder="Enter your password"
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
          Change Password
        </Button>
      </div>
    </form>
  );
}
