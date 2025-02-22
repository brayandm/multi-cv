"use client";

import { Button, Divider, Input } from "@heroui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

      console.log(Loginresponse);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="flex flex-col gap-2 text-center mt-8 w-[250px] mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-center">Login</h1>
      <p>Please enter your credentials</p>
      <div className="flex flex-col gap-3">
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
        <Button color="primary" type="submit">
          Login
        </Button>
      </div>
      <Divider className="my-4"></Divider>
      <p>
        Use another method |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => router.push("/register")}
        >
          Register
        </span>
      </p>
      <GoogleOAuthProvider clientId="874501087601">
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
