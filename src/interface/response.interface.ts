export interface UserData {
  userId: number;
  username: string;
  name: string;
  lastName: string;
  role: string;
}

export interface Metadata {
  totalItems: number;
  itemCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ApiResponse<T> {
  message: string;
  body: T;
  status: number;
  errors?: string[];
  token?: string;
  metadata?: Metadata;
}

export interface AuthResponse {
  userId: number;
  name: string;
  lastName: string;
  username: string;
  role: string;
  token: string;
}

export interface EmpresaData {
  companyId: number;
  name: string;
  ruc: string;
  address: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface EntidadBancariaData {
  entidadId: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OcupacionData {
  ocupacionId: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SituacionAcademicaData {
  situacionEducativaId: number;
  nombre: string;
  requiereEstudios: boolean;
  estado: boolean;
  createdAt?: string;
}
