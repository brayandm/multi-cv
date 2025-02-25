"use client";

import { useState } from "react";
import { Button, Divider, Input, Checkbox } from "@heroui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { loginApi, registerApi } from "@/lib/backendService";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import Link from "next/link";
import { handleGoogleSignIn } from "@/lib/oauth";
import GoogleOauthBtn from "../shared/components/GoogleOauthBtn";

export default function RegisterComponent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    acceptTerms: false,
    underAge: false,
  });

  const { isLoading } = useIsAuthenticated();

  if (isLoading) {
    return null;
  }

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
      <h1 className="text-center">Register</h1>
      <p>Introduce yourself</p>
      <div className="flex flex-col gap-3">
        <Input
          label="Full Name"
          placeholder="John Doe"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Input
          label="Email"
          placeholder="Enter your email"
          type="email"
          name="email"
          value={formData.email}
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
            I confirm that I am over 18 years old
          </span>
        </div>

        <div className="flex items-start gap-1">
          <Checkbox
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleCheckboxChange}
            size="sm"
          />
          <span className="text-[9px] text-gray-600">
            I accept the{" "}
            <Link
              href="/terms-and-conditions.html"
              target="_blank"
              className="text-primary underline"
            >
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy.html"
              target="_blank"
              className="text-primary underline"
            >
              Privacy Policy
            </Link>
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
            formData.password !== formData.repeatPassword
          }
        >
          Register
        </Button>
      </div>
      <Divider className="my-4" />
      <p>
        Use another method |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Login
        </span>
      </p>

      <GoogleOauthBtn onPress={handleGoogleSignIn}></GoogleOauthBtn>
    </form>
  );
}
