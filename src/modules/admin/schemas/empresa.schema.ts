import { z } from "zod";

export const empresaSchema = z.object({
  name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  ruc: z
    .string()
    .length(11, "El RUC debe tener exactamente 11 dígitos")
    .regex(/^\d+$/, "El RUC debe contener solo números"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  conceptos: z.array(z.number()).min(1, "Debe seleccionar al menos un concepto"),
});

export type EmpresaFormType = z.infer<typeof empresaSchema>;
