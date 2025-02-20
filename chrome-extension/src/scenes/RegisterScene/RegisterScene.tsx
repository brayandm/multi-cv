import { Button, Divider, Input } from "@heroui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function RegisterScene() {
  const navigator = useNavigate();
  return (
    <form className="flex flex-col gap-2 text-center ">
      <h1 className="text-center">Register</h1>
      <p>Introduce yourself</p>
      <div className="flex flex-col gap-3">
        <Input label="Full Name" placeholder="John Doe" type="text" />
        <Input label="Email" placeholder="Enter your email" type="email" />
        <Input
          label="Password"
          placeholder="Enter your password"
          type="password"
        />
        <Input
          label="Repeat the password"
          placeholder="Enter your password"
          type="password"
        />
        <Button color="primary">Register</Button>
      </div>
      <Divider className="my-4"></Divider>
      <p>
        Use another method |{" "}
        <span
          className="text-primary cursor-pointer"
          onClick={() => navigator("/login")}
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
