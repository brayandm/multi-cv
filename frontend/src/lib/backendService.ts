import axios, { AxiosResponse } from "axios";
import {
  loginApiLink,
  logoutApiLink,
  registerApiLink,
  verifyApiLink,
} from "./links";
import {
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  VerifyResponse,
} from "./types";

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const fetcherApi = (url: string) => api.get(url).then((res) => res.data);

export const loginApi = async (formData: {
  email: string;
  password: string;
}): Promise<AxiosResponse<LoginResponse>> => {
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

export const logoutApi = async (): Promise<AxiosResponse<LogoutResponse>> => {
  return await api.post(logoutApiLink);
};

export const registerApi = async (formData: {
  name: string;
  email: string;
  password: string;
}): Promise<AxiosResponse<RegisterResponse>> => {
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

export const verifyApi = async (): Promise<AxiosResponse<VerifyResponse>> => {
  return await api.get(verifyApiLink);
};
