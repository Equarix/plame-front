import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX, FiBook } from "react-icons/fi";
import type { EstudiosInput } from "@/modules/dashboard/hooks/useTRegistroForm";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const estudioSchema = z.object({
  formacionCompleta: z.enum(["SUPERIOR_COMPLETA", "UNIVERSITARIA_COMPLETA"] as const, {
    error: "Debe seleccionar una formación completa",
  }),
  estudioPeru: z.string().min(1, "Indique si estudió en Perú"),
  privado: z.string().min(1, "Indique si el régimen es privado"),
  tipoEducacion: z.enum(["INSTITUTO", "UNIVERSIDAD", "POLICIALES", "NO_ESPECIFICA"] as const, {
    error: "Debe seleccionar el tipo de institución",
  }),
  nombreInstitucion: z.string().min(1, "El nombre de la institución es requerido"),
  nombreCarrera: z.string().min(1, "El nombre de la carrera es requerido"),
  añoEgreso: z
    .string()
    .min(1, "El año de egreso es requerido")
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 1950 && Number(v) <= new Date().getFullYear(),
      `El año debe estar entre 1950 y ${new Date().getFullYear()}`
    ),
});

interface EstudioFormType {
  formacionCompleta: "SUPERIOR_COMPLETA" | "UNIVERSITARIA_COMPLETA";
  estudioPeru: string;
  privado: string;
  tipoEducacion: "INSTITUTO" | "UNIVERSIDAD" | "POLICIALES" | "NO_ESPECIFICA";
  nombreInstitucion: string;
  nombreCarrera: string;
  añoEgreso: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const FORMACION_COMPLETA_OPTIONS = [
  { value: "SUPERIOR_COMPLETA", label: "EDUCACIÓN SUPERIOR (INSTITUTO SUPERIOR, ETC) COMPLETA" },
  { value: "UNIVERSITARIA_COMPLETA", label: "EDUCACIÓN UNIVERSITARIA COMPLETA" },
];

const TIPO_EDUCACION_OPTIONS = [
  { value: "INSTITUTO", label: "INSTITUTO" },
  { value: "UNIVERSIDAD", label: "UNIVERSIDAD" },
  { value: "POLICIALES", label: "POLICIALES" },
  { value: "NO_ESPECIFICA", label: "NO ESPECIFICA" },
];

const BOOL_OPTIONS = [
  { value: "true", label: "Sí" },
  { value: "false", label: "No" },
];

// ─── Props ───────────────────────────────────────────────────────────────────

interface EstudiosModalProps {
  onClose: () => void;
  onAdd: (estudio: EstudiosInput) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EstudiosModal({ onClose, onAdd }: EstudiosModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EstudioFormType>({
    resolver: zodResolver(estudioSchema),
    defaultValues: {
      formacionCompleta: undefined,
      estudioPeru: "",
      privado: "",
      tipoEducacion: undefined,
      nombreInstitucion: "",
      nombreCarrera: "",
      añoEgreso: "",
    },
  });

  const handleAdd = (data: EstudioFormType) => {
    const nuevo: EstudiosInput = {
      formacionCompleta: data.formacionCompleta,
      estudioPeru: data.estudioPeru === "true",
      privado: data.privado === "true",
      tipoEducacion: data.tipoEducacion,
      nombreInstitucion: data.nombreInstitucion,
      nombreCarrera: data.nombreCarrera,
      añoEgreso: parseInt(data.añoEgreso, 10),
    };
    onAdd(nuevo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/40 dark:border-zinc-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-bento-control bg-bento-secondary/15 text-bento-secondary flex items-center justify-center">
              <FiBook className="text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-bento-text dark:text-zinc-50 text-sm leading-none">
                Agregar Estudio Concluido
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-none">
                Complete los datos del nivel de formación superior alcanzado.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="form-estudio-modal"
          onSubmit={handleSubmit(handleAdd)}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormSelect
                label="Formación Superior Completa"
                name="formacionCompleta"
                options={FORMACION_COMPLETA_OPTIONS}
                register={register("formacionCompleta")}
                error={errors.formacionCompleta?.message}
              />
            </div>

            <FormSelect
              label="¿Estudió en una Institución del Perú?"
              name="estudioPeru"
              options={BOOL_OPTIONS}
              register={register("estudioPeru")}
              error={errors.estudioPeru?.message}
            />

            <FormSelect
              label="Régimen de la Institución Educativa"
              name="privado"
              options={[
                { value: "false", label: "Pública" },
                { value: "true", label: "Privada" },
              ]}
              register={register("privado")}
              error={errors.privado?.message}
            />

            <FormSelect
              label="Tipo de Institución Educativa"
              name="tipoEducacion"
              options={TIPO_EDUCACION_OPTIONS}
              register={register("tipoEducacion")}
              error={errors.tipoEducacion?.message}
            />

            <FormInput
              label="Año de Egreso"
              name="añoEgreso"
              type="number"
              placeholder={String(new Date().getFullYear())}
              register={register("añoEgreso")}
              error={errors.añoEgreso?.message}
            />

            <FormInput
              label="Nombre de la Institución Educativa"
              name="nombreInstitucion"
              placeholder="Ej: Universidad Nacional Mayor de San Marcos"
              register={register("nombreInstitucion")}
              error={errors.nombreInstitucion?.message}
            />

            <FormInput
              label="Carrera"
              name="nombreCarrera"
              placeholder="Ej: Ingeniería de Sistemas"
              register={register("nombreCarrera")}
              error={errors.nombreCarrera?.message}
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-zinc-200/40 dark:border-zinc-800/40 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="form-estudio-modal"
            className="px-5 py-2 bg-bento-secondary hover:opacity-95 text-zinc-950 rounded-bento-control text-xs font-extrabold shadow-md transition-all cursor-pointer border border-zinc-900/10"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
