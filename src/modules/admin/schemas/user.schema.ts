import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
  role: z.string().min(1, "Debe seleccionar un rol"),
  password: z.string().optional().or(z.literal("")),
});

export type UserFormType = z.infer<typeof userSchema>;
