import axios, { AxiosResponse } from "axios";
import {
  acceptTermsVersionApiLink,
  googleLoginApiLink,
  loginApiLink,
  logoutApiLink,
  notifiedTermsVersionApiLink,
  passwordRecoveryEmailApiLink,
  passwordRecoveryResetApiLink,
  registerApiLink,
  resendEmailApiLink,
  profileSyncEngineLink,
  updatePasswordApiLink,
  userApiLink,
  userLocaleApiLink,
  userSetLocaleApiLink,
  userStatusApiLink,
  getQuotaInfoApiLink,
  getProfileEngineLink,
  generateCvInlineEngineLink,
  finishFirstLoginApiLink,
  chatExperienceEngineLink,
  talentPoolApiLink,
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
  GoogleLoginResponse,
  PasswordRecoveryEmailResponse,
  PasswordRecoveryResetResponse,
  UserSetLocaleResponse,
  UserLocaleResponse,
  ProfileSyncResponse,
  GetQuotaInfoResponse,
  FinishFirstLoginResponse,
  chatExperienceResponse,
  TalentPoolResponse,
} from "./types";
import { IProfile } from "@/contexts/ProfileContext";
import { ChatData } from "@/contexts/ChatContext";
import { Language } from "@/contexts/LocaleContext";

const isServer = typeof window === "undefined";

export const api = axios.create({
  baseURL: isServer ? process.env.API_URL : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export const engine = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENGINE_URL,
  withCredentials: true,
});

export const fetcherApi = (url: string) => api.get(url).then((res) => res.data);

export const fetcherEngine = (url: string) =>
  engine.get(url).then((res) => res.data);

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

export const passwordRecoveryEmailApi = async (
  email: string
): Promise<AxiosResponse<PasswordRecoveryEmailResponse>> => {
  return await api.post(
    passwordRecoveryEmailApiLink,
    {
      email: email,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
export const passwordRecoveryResetApi = async (data: {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}): Promise<AxiosResponse<PasswordRecoveryResetResponse>> => {
  return await api.post(
    passwordRecoveryResetApiLink,
    {
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      token: data.token,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const registerApi = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  talentPool: boolean;
}): Promise<AxiosResponse<RegisterResponse>> => {
  return await api.post(
    registerApiLink,
    {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      talent_pool: formData.talentPool,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const talentPoolApi = async (
  talentPool: boolean
): Promise<AxiosResponse<TalentPoolResponse>> => {
  return await api.put(
    talentPoolApiLink,
    {
      talent_pool: talentPool,
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
): Promise<AxiosResponse<GoogleLoginResponse>> => {
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

export const userSetLocaleApi = async (
  locale: string
): Promise<AxiosResponse<UserSetLocaleResponse>> => {
  return await api.put(
    userSetLocaleApiLink,
    {
      locale,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const userLocaleApi = async (): Promise<
  AxiosResponse<UserLocaleResponse>
> => {
  return await api.get(userLocaleApiLink);
};

export const getQuotaInfoApi = async (
  action: string
): Promise<AxiosResponse<GetQuotaInfoResponse>> => {
  return await api.post(getQuotaInfoApiLink, { action: action });
};

export const finishFirstLoginApi = async (): Promise<
  AxiosResponse<FinishFirstLoginResponse>
> => {
  return await api.put(finishFirstLoginApiLink);
};

export const profileSyncEngine = async (
  profile: IProfile
): Promise<AxiosResponse<ProfileSyncResponse>> => {
  return await engine.put(profileSyncEngineLink, profile);
};

export const getProfileEngine = async (): Promise<
  AxiosResponse<IProfile | null>
> => {
  return await engine.get(getProfileEngineLink);
};

export const generateCvInlineEngine = async (
  language: Language
): Promise<AxiosResponse<Blob>> => {
  return await engine.post(generateCvInlineEngineLink, language, {
    responseType: "blob",
  });
};

export const chatExperienceEngine = async ({
  experience_id,
  chat,
  language,
}: {
  experience_id: string;
  language: Language;
  chat: ChatData;
}): Promise<AxiosResponse<chatExperienceResponse>> => {
  return await engine.post(
    chatExperienceEngineLink,
    {
      experience_id: {
        id: experience_id,
      },
      language: language,
      chat: chat,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
