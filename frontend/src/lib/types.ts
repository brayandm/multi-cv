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
  is_password_null: boolean;
  created_at: string;
  updated_at: string;
}
