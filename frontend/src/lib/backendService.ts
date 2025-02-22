import axios from "axios";
import { loginApiLink, registerApiLink, verifyApiLink } from "./links";

axios.defaults.withCredentials = true;

export const loginApi = async (formData: {
  email: string;
  password: string;
}) => {
  return await axios.post(
    loginApiLink,
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
};

export const registerApi = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  return await axios.post(
    registerApiLink,
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
};

export const verifyApi = async () => {
  return await axios.get(verifyApiLink);
};
