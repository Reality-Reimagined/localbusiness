export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'business';
  profileComplete: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  role: 'user' | 'business';
}