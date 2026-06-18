import { z } from "zod";

export const plameHeaderSchema = z.object({
  periodo: z.string().regex(/^\d{2}\/\d{4}$/, "Debe ingresar el período en formato mm/aaaa"),
  sustitutoria: z.boolean().default(false),
  numeroOrden: z.string().optional().nullable(),
});

export type PlameHeaderForm = z.infer<typeof plameHeaderSchema>;

export const plameDetalleSchema = z.object({
  diasLaborados: z.coerce.number().min(0, "Debe ser mayor o igual a 0").max(31, "No puede exceder 31 días"),
  diasSubsidiados: z.coerce.number().min(0, "Debe ser mayor o igual a 0").max(31, "No puede exceder 31 días"),
  diasNoLaborados: z.coerce.number().min(0, "Debe ser mayor o igual a 0").max(31, "No puede exceder 31 días"),
  horasOrdinarias: z.string().regex(/^\d+:\d{2}$/, "Debe tener formato HHH:MM"),
  horasSobretiempo: z.string().regex(/^\d+:\d{2}$/, "Debe tener formato HHH:MM"),
});

export type PlameDetalleForm = z.infer<typeof plameDetalleSchema>;
