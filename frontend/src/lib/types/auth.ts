// 用户信息
export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string | null;
  modelPreference?: string;
  createdAt: string;
  updatedAt?: string;
}

// 登录响应
export interface AuthResponse {
  user: User;
  accessToken: string;
}

// 登录请求
export interface LoginDto {
  email: string;
  password: string;
}

// 注册请求
export interface RegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
}
