export interface VerifyResponse {
  authenticated: boolean;
  is_valid_terms_version?: boolean;
}

export interface LoginResponse {
  message: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterResponse {
  message: string;
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
  is_valid_terms_version: boolean;
}

/* -- Cv --  */
export interface CV {
  id: number;
  company: string;
  role: string;
  pdf_file: string;
  time_to_expire: number;
}
