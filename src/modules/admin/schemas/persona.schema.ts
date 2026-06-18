import { z } from "zod";

export const direccionSchema = z.object({
  departamentoId: z
    .number({ message: "Debe seleccionar un departamento" })
    .min(1, "Debe seleccionar un departamento"),
  provinciaId: z
    .number({ message: "Debe seleccionar una provincia" })
    .min(1, "Debe seleccionar una provincia"),
  distritoId: z
    .number({ message: "Debe seleccionar un distrito" })
    .min(1, "Debe seleccionar un distrito"),
  tipoVia: z.enum(["AVENIDA", "CALLE", "JIRON", "PASAJE", "OTRO"], {
    message: "Debe seleccionar un tipo de vía",
  }),
  nombreVia: z.string().min(1, "El nombre de la vía es requerido"),
  numero: z.string().min(1, "El número es requerido"),
  dpto: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  interior: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  manzana: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  lote: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  block: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  etapa: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  tipoZona: z.enum(["URBANA", "RURAL", "OTRO"], {
    message: "Debe seleccionar un tipo de zona",
  }),
  nombreZona: z.string().min(1, "El nombre de la zona es requerido"),
  referencia: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val === undefined ? null : val)),
  refiereEssalud: z.boolean().default(false),
});

export const personaSchema = z.object({
  dni: z
    .string()
    .regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos numéricos"),
  nombres: z.string().min(1, "Los nombres son requeridos"),
  apellidoPaterno: z.string().min(1, "El apellido paterno es requerido"),
  apellidoMaterno: z.string().min(1, "El apellido materno es requerido"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
  sexo: z.string().min(1, "El sexo es requerido"),
  estadoCivil: z.string().min(1, "El estado civil es requerido"),
  nacionalidad: z.string().min(1, "La nacionalidad es requerida"),
  direccion: direccionSchema,
});

export type PersonaFormType = z.input<typeof personaSchema>;
export type DireccionFormType = z.input<typeof direccionSchema>;
