import { Cv, CvTexts } from "@/contexts/CvContext";

export interface UserStatusResponse {
  authenticated: boolean;
  is_valid_terms_version?: boolean;
  notice_new_terms_version?: boolean;
  email_verified?: boolean;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_first_login?: boolean;
  is_in_talent_pool?: boolean | null;
  has_profile_picture?: boolean;
  payment_plan?: string;
  is_freemium?: boolean;
}

export interface LoginResponse {
  message: string;
  auth_cookie?: AuthCookie;
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
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  accepted_terms_at: string;
  created_at: string;
  updated_at: string;
  is_password_null: boolean;
  is_valid_terms_version: boolean | null;
  notice_new_terms_version: boolean | null;
  is_in_talent_pool: boolean | null;
}

export interface UserLocaleResponse {
  locale: string;
}

export interface GetQuotaInfoResponse {
  quota: number;
  frequency: string;
  left: number;
  pending: number;
  max_pending: number;
  finished: boolean;
  is_freemium: boolean;
}

export interface MessageResponse {
  message: string;
}

export interface generateCvInlineNoRenderResponse {
  cv: Cv;
  cv_texts: CvTexts;
}

export interface UserThemeResponse {
  theme: string;
}

export interface CheckoutSessionResponse {
  id: string;
}
export interface Document {
  document_id: string;
  user_id: number;
  name: string;
  size: number;
  created_at: string;
  updated_at: string;
  type: "cv" | "cover_letter";
}

export interface GenerationInput {
  type: "simple" | "role" | "job";
  role_input: string | null;
  job_input: string | null;
  custom_prompt: string;
}

export interface Settings {
  custom_prompt?: string;
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
