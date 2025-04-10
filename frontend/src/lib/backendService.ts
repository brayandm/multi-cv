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
  generateCvInlineNoRenderEngineLink,
  renderHtmlInlineEngineLink,
  userDeleteProfilePictureApiLink,
  userUploadProfilePictureApiLink,
  autoFillCvFromDocumentEngineLink,
  userSetThemeApiLink,
  userThemeApiLink,
  documentsEngineLink,
  documentDownloadEngineLink,
  checkoutSessionApiLink,
  getSettingsEngineLink,
  storeSettingsEngineLink,
} from "./links";
import {
  UserResponse,
  LoginResponse,
  UserStatusResponse,
  GoogleLoginResponse,
  PasswordRecoveryResetResponse,
  UserLocaleResponse,
  GetQuotaInfoResponse,
  MessageResponse,
  generateCvInlineNoRenderResponse,
  UserThemeResponse,
  Document,
  CheckoutSessionResponse,
  GenerationInput,
  Settings,
} from "./types";
import { IProfile } from "@/contexts/ProfileContext";
import { ChatData } from "@/contexts/ChatContext";
import { Traduction } from "@/contexts/LocaleContext";

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
export const fetcherApiPost = <T>(args: [string, T]) => {
  const [url, data] = args;
  return api.post(url, data).then((res) => res.data);
};
export const fetcherEngine = (url: string) =>
  engine.get(url).then((res) => res.data);

export const fetcherEnginePost = <T>(args: [string, T]) => {
  const [url, data] = args;
  return engine.post(url, data).then((res) => res.data);
};
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

export const logoutApi = async (): Promise<AxiosResponse<MessageResponse>> => {
  return await api.post(logoutApiLink);
};

export const resendEmailApi = async (): Promise<
  AxiosResponse<MessageResponse>
> => {
  return await api.post(resendEmailApiLink);
};

export const passwordRecoveryEmailApi = async (
  email: string
): Promise<AxiosResponse<MessageResponse>> => {
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
}): Promise<AxiosResponse<MessageResponse>> => {
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
): Promise<AxiosResponse<MessageResponse>> => {
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
  AxiosResponse<MessageResponse>
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
  AxiosResponse<MessageResponse>
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
}): Promise<AxiosResponse<MessageResponse>> => {
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
): Promise<AxiosResponse<MessageResponse>> => {
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
  AxiosResponse<MessageResponse>
> => {
  return await api.put(finishFirstLoginApiLink);
};

export const profileSyncEngine = async (
  profile: IProfile
): Promise<AxiosResponse<MessageResponse>> => {
  return await engine.put(profileSyncEngineLink, profile);
};

export const getProfileEngine = async (): Promise<
  AxiosResponse<IProfile | null>
> => {
  return await engine.get(getProfileEngineLink);
};

export const generateCvInlineEngine = async (
  input: GenerationInput,
  traduction: Traduction
): Promise<AxiosResponse<Blob>> => {
  return await engine.post(
    generateCvInlineEngineLink,
    {
      input: input,
      traduction: traduction,
    },
    {
      responseType: "blob",
    }
  );
};

export const generateCvInlineNoRenderEngine = async (
  input: GenerationInput,
  traduction: Traduction
): Promise<AxiosResponse<generateCvInlineNoRenderResponse>> => {
  return await engine.post(
    generateCvInlineNoRenderEngineLink,
    {
      input: input,
      traduction: traduction,
    },
    {
      responseType: "json",
    }
  );
};

export const renderHtmlInlineEngine = async (
  html: string
): Promise<AxiosResponse<Blob>> => {
  return await engine.post(
    renderHtmlInlineEngineLink,
    {
      content: html,
    },
    {
      responseType: "blob",
    }
  );
};

export const chatExperienceEngine = async ({
  experience_id,
  chat,
  traduction,
}: {
  experience_id: string;
  traduction: Traduction;
  chat: ChatData;
}): Promise<AxiosResponse<MessageResponse>> => {
  return await engine.post(
    chatExperienceEngineLink,
    {
      experience_id: {
        id: experience_id,
      },
      traduction: traduction,
      chat: chat,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const userUploadProfilePictureApi = async (
  file: File
): Promise<AxiosResponse<MessageResponse>> => {
  const formData = new FormData();
  formData.append("photo", file);

  return await api.post(userUploadProfilePictureApiLink, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const userDeleteProfilePictureApi = async (): Promise<
  AxiosResponse<UserResponse>
> => {
  return await api.delete(userDeleteProfilePictureApiLink);
};

export const autoFillCvFromDocumentEngine = async (
  file: File
): Promise<AxiosResponse<MessageResponse>> => {
  const formData = new FormData();
  formData.append("file", file);

  return await engine.post(autoFillCvFromDocumentEngineLink, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const userSetThemeApi = async (
  theme: string
): Promise<AxiosResponse<MessageResponse>> => {
  return await api.put(
    userSetThemeApiLink,
    {
      theme,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const userThemeApi = async (): Promise<
  AxiosResponse<UserThemeResponse>
> => {
  return await api.get(userThemeApiLink);
};

export const documentsEngine = async (): Promise<AxiosResponse<Document[]>> => {
  return await engine.get(documentsEngineLink);
};

export const documentDownloadEngine = async (
  documentId: string
): Promise<AxiosResponse<Blob>> => {
  return await engine.post(
    documentDownloadEngineLink,
    {
      document_id: documentId,
    },
    {
      responseType: "blob",
    }
  );
};

export const checkoutSessionApi = async (
  plan: string
): Promise<AxiosResponse<CheckoutSessionResponse>> => {
  return await api.post(checkoutSessionApiLink, {
    plan: plan,
  });
};

export const getSettingsEngine = async (): Promise<AxiosResponse<Settings>> => {
  return await engine.get(getSettingsEngineLink);
};
export const storeSettingsEngine = async (
  settings: Settings
): Promise<AxiosResponse<MessageResponse>> => {
  return await engine.post(storeSettingsEngineLink, settings);
};
