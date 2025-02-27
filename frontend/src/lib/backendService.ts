import axios, { AxiosResponse } from "axios";
import {
  acceptTermsVersionApiLink,
  googleLoginApiLink,
  loginApiLink,
  logoutApiLink,
  notifiedTermsVersionApiLink,
  registerApiLink,
  resendEmailApiLink,
  updatePasswordApiLink,
  userApiLink,
  userStatusApiLink,
} from "./links";
import {
  UserResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  UserStatusResponse,
  NotifiedTermsVersionResponse,
  AcceptTermsVersionResponse,
  ResendEmailResponse,
} from "./types";

const isServer = typeof window === "undefined";

export const api = axios.create({
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

export const resendEmailApi = async (): Promise<
  AxiosResponse<ResendEmailResponse>
> => {
  return await api.post(resendEmailApiLink);
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
  AxiosResponse<AcceptTermsVersionResponse>
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

export const notifiedTermsVersionApi = async (): Promise<
  AxiosResponse<NotifiedTermsVersionResponse>
> => {
  return await api.put(
    notifiedTermsVersionApiLink,
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

export const googleLoginApi = async (
  isExtension: boolean = false
): Promise<AxiosResponse> => {
  return await api.get(
    googleLoginApiLink + (isExtension ? "?extension=true" : "")
  );
};

export const userStatusApi = async (): Promise<
  AxiosResponse<UserStatusResponse>
> => {
  return await api.get(userStatusApiLink);
};

export const updatePasswordApi = async (formData: {
  currentPassword: string;
  password: string;
}): Promise<AxiosResponse<RegisterResponse>> => {
  return await api.put(
    updatePasswordApiLink,
    {
      old_password: formData.currentPassword,
      password: formData.password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
