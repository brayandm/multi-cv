export interface UserStatusResponse {
  authenticated: boolean;
  is_valid_terms_version?: boolean;
  notice_new_terms_version?: boolean;
  email_verified?: boolean;
  email?: string;
  name?: string;
  is_first_login?: boolean;
}

export interface LoginResponse {
  message: string;
  auth_cookie?: AuthCookie;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
}

export interface AcceptTermsVersionResponse {
  message: string;
}

export interface NotifiedTermsVersionResponse {
  message: string;
}

export interface ResendEmailResponse {
  message: string;
}

export interface PasswordRecoveryEmailResponse {
  message: string;
}

export interface PasswordRecoveryResetResponse {
  message: string;
  auth_cookie?: AuthCookie;
}

export interface AuthCookie {
  name: string;
  value: string;
  expiration_date: number;
}

export interface GoogleLoginResponse {
  is_local?: boolean;
  url?: string;
  auth_cookie?: AuthCookie;
}
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  accepted_terms_at: string;
  created_at: string;
  updated_at: string;
  is_password_null: boolean;
  is_valid_terms_version: boolean | null;
  notice_new_terms_version: boolean | null;
}

export interface UserSetLocaleResponse {
  message: string;
}

export interface UserLocaleResponse {
  locale: string;
}

export interface GetQuotaInfoResponse {
  quota: number;
  frequency: string;
  left: number;
}

export interface ProfileSyncResponse {
  message: string;
}

export interface chatExperienceResponse {
  message: string;
}

export interface FinishFirstLoginResponse {
  message: string;
}

export interface CV {
  id: number;
  company: string;
  image: string;
  role: string;
  job_description: string;
  pdf_file: string;
  days_to_expire: number;
}
