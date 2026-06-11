import { z } from "zod";

export const entidadBancariaSchema = z.object({
  name: z.string().min(2, "El nombre de la entidad bancaria debe tener al menos 2 caracteres"),
});

export type EntidadBancariaFormType = z.infer<typeof entidadBancariaSchema>;
