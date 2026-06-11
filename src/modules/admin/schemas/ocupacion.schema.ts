import { z } from "zod";

export const ocupacionSchema = z.object({
  name: z.string().min(2, "El nombre de la ocupación debe tener al menos 2 caracteres"),
});

export type OcupacionFormType = z.infer<typeof ocupacionSchema>;
