export interface UserData {
  userId: number;
  username: string;
  name: string;
  lastName: string;
  role: string;
  status?: boolean;
  estado?: boolean;
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

export interface UbigeoDepartamento {
  idDepartamento: number;
  departamento: string;
  idPais: number;
}

export interface UbigeoProvincia {
  idProvincia: number;
  provincia: string;
  idDepartamento: number;
}

export interface UbigeoDistrito {
  idDistrito: number;
  distrito: string;
  idProvincia: number;
}

export interface DireccionData {
  direccionId: number;
  personaId: number;
  departamentoId: number;
  provinciaId: number;
  distritoId: number;
  tipoVia: "AVENIDA" | "CALLE" | "JIRON" | "PASAJE" | "OTRO";
  nombreVia: string;
  numero: string;
  dpto?: string | null;
  interior?: string | null;
  manzana?: string | null;
  lote?: string | null;
  block?: string | null;
  etapa?: string | null;
  tipoZona: "URBANA" | "RURAL" | "OTRO";
  nombreZona: string;
  referencia?: string | null;
  refiereEssalud: boolean;
  departamento?: UbigeoDepartamento;
  provincia?: UbigeoProvincia;
  distrito?: UbigeoDistrito;
}

export interface PersonaData {
  personaId: number;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  sexo: string;
  estadoCivil: string;
  nacionalidad: string;
  direcciones: DireccionData[];
  telefono?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}
