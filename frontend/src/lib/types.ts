export interface VerifyResponse {
  authenticated: boolean;
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
  accepted_terms_version: string;
  created_at: string;
  updated_at: string;
  is_password_null: boolean;
  is_valid_terms_version: boolean;
}
