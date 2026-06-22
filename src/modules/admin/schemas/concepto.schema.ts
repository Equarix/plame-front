import { z } from "zod";

export const TipoConcepto = {
  INGRESO: "INGRESO",
  DESCUENTO: "DESCUENTO",
  TRIBUTO: "TRIBUTO",
} as const;

export type TipoConcepto = (typeof TipoConcepto)[keyof typeof TipoConcepto];

export const SubConcepto = {
  Trabajador: "Trabajador",
  Empleador: "Empleador",
} as const;

export type SubConcepto = (typeof SubConcepto)[keyof typeof SubConcepto];

export const conceptoSchema = z
  .object({
    nombre: z.string().min(2, "El nombre del concepto debe tener al menos 2 caracteres"),
    codigo: z.string().min(1, "El código del concepto es requerido"),
    tipo: z.enum(["INGRESO", "DESCUENTO", "TRIBUTO"], {
      message: "Debe seleccionar un tipo de concepto válido",
    }),
    subConcepto: z
      .enum(["Trabajador", "Empleador"], {
        message: "Debe seleccionar un subconcepto válido",
      })
      .nullable()
      .optional(),
    porcentaje: z
      .number()
      .min(0, "El porcentaje no puede ser menor a 0")
      .max(100, "El porcentaje no puede ser mayor a 100")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (data.tipo === "TRIBUTO" && !data.subConcepto) {
        return false;
      }
      return true;
    },
    {
      message: "Debe seleccionar un subconcepto si el tipo es TRIBUTO",
      path: ["subConcepto"],
    }
  );

export type ConceptoFormType = z.infer<typeof conceptoSchema>;
