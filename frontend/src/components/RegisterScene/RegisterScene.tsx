import { useState } from "react";
import { Button, Divider, Input } from "@heroui/react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function RegisterScene() {
  const navigator = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col gap-2 text-center" onSubmit={handleSubmit}>
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
