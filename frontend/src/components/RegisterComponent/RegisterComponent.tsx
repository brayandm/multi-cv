"use client";

import { useState } from "react";
import { Button, Divider, Input } from "@heroui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterComponent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
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

      const registerResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (registerResponse.status === 200) {
        const Loginresponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/login`,
          {
            email: formData.email,
            password: formData.password,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 mt-8 text-center w-[250px] mx-auto"
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
        <Button color="primary" type="submit">
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
      <GoogleOAuthProvider clientId="">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </GoogleOAuthProvider>
    </form>
  );
}
