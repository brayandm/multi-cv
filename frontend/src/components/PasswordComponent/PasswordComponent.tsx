"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useIsNotAuthenticated } from "@/hooks/useIsNotAuthenticated";

export default function PasswordComponent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: "",
    password: "",
    repeatPassword: "",
  });

  const { isLoading } = useIsNotAuthenticated();

  if (isLoading) {
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

    // try {
    //   const registerResponse = await registerApi(formData);

    //   if (registerResponse.status === 200) {
    //     const loginResponse = await loginApi({
    //       email: formData.email,
    //       password: formData.password,
    //     });

    //     if (loginResponse.status === 200) {
    //       router.push("/home");
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <form
      className="flex flex-col gap-2 text-center w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Change Password</h1>
      <p>Enter your new password</p>
      <div className="flex flex-col gap-3">
        <Input
          label="Current Password"
          placeholder="Enter your password"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
        />
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
