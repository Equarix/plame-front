import { z } from "zod";

export const personaSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos numéricos"),
  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es requerida"),
  sexo: z.string().min(1, "El sexo es requerido"),
  estadoCivil: z.string().min(1, "El estado civil es requerido"),
  nacionalidad: z.string().min(1, "La nacionalidad es requerida"),
  primeraDireccion: z.string().min(1, "La dirección principal es requerida"),
  segundaDireccion: z.string().min(1, "La dirección secundaria es requerida"),
  telefono: z.string().min(6, "El teléfono debe tener al menos 6 caracteres"),
  email: z.string().email("Debe ingresar un correo electrónico válido"),
});

export type PersonaFormType = z.infer<typeof personaSchema>;
