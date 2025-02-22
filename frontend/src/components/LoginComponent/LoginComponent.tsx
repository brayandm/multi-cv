"use client";

import { Button, Divider, Input } from "@heroui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function LoginComponent() {
  const router = useRouter();
  return (
    <form className="flex flex-col gap-2 text-center mt-8 ">
      <h1 className="text-center">Login</h1>
      <p>Please enter your credentials</p>
      <div className="flex flex-col gap-3">
        <Input label="Email" placeholder="Enter your email" type="email" />
        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <Button color="primary">Login</Button>
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
      <GoogleOAuthProvider clientId="">
        {/* Checa la documentacion https://www.npmjs.com/package/@react-oauth/google */}
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
