export interface UserData {
  userId: number;
  username: string;
  name: string;
  lastName: string;
  role: string;
}

export interface ApiResponse<T> {
  message: string;
  body: T;
  status: number;
  errors?: string[];
  token?: string;
}

export interface AuthResponse {
  userId: number;
  name: string;
  lastName: string;
  username: string;
  role: string;
  token: string;
}
