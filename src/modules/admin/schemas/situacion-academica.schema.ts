import { z } from "zod";

export const situacionAcademicaSchema = z.object({
  nombre: z.string().min(2, "El nombre de la situación académica debe tener al menos 2 caracteres"),
  requiereEstudios: z.boolean(),
});

export type SituacionAcademicaFormType = z.infer<typeof situacionAcademicaSchema>;
