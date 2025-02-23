import axios, { AxiosResponse } from "axios";
import {
  acceptTermsVersionApiLink,
  googleLoginApiLink,
  loginApiLink,
  logoutApiLink,
  registerApiLink,
  userApiLink,
  verifyApiLink,
} from "./links";
import {
  UserResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  VerifyResponse,
} from "./types";

const isServer = typeof window === "undefined";

const api = axios.create({
  baseURL: isServer ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL,
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

export const acceptTermsVersionApi = async (): Promise<
  AxiosResponse<RegisterResponse>
> => {
  return await api.put(
    acceptTermsVersionApiLink,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const userApi = async (): Promise<AxiosResponse<UserResponse>> => {
  return await api.get(userApiLink);
};

export const googleLoginApi = async (): Promise<AxiosResponse> => {
  return await api.get(googleLoginApiLink);
};

export const verifyApi = async (): Promise<AxiosResponse<VerifyResponse>> => {
  return await api.get(verifyApiLink);
};
