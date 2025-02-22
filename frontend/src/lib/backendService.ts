import axios from "axios";
import { loginApiLink, registerApiLink, verifyApiLink } from "./links";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const fetcherApi = (url: string) => api.get(url).then((res) => res.data);

export const loginApi = async (formData: {
  email: string;
  password: string;
}) => {
  return await api.post(
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
  return await api.post(
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
  return await api.get(verifyApiLink);
};
