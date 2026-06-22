"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  conceptoSchema,
  type ConceptoFormType,
} from "../schemas/concepto.schema";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import type { ConceptoData } from "@/interface/response.interface";
import { FiX, FiPlusCircle, FiEdit2 } from "react-icons/fi";

interface AdminConceptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ConceptoFormType) => void;
  conceptoToEdit?: ConceptoData;
  isLoading?: boolean;
}

export function AdminConceptoModal({
  isOpen,
  onClose,
  onSubmit,
  conceptoToEdit,
  isLoading = false,
}: AdminConceptoModalProps) {
  const isEditing = !!conceptoToEdit;

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
    control,
  } = useForm<ConceptoFormType>({
    resolver: zodResolver(conceptoSchema),
    defaultValues: {
      nombre: "",
      codigo: "",
      tipo: "INGRESO",
      subConcepto: null,
      porcentaje: null,
    },
  });

  const selectedTipo = watch("tipo");

  // If tipo is not TRIBUTO, reset subConcepto value
  useEffect(() => {
    if (selectedTipo !== "TRIBUTO") {
      setValue("subConcepto", null);
    }
  }, [selectedTipo, setValue]);

  useEffect(() => {
    if (isOpen) {
      if (conceptoToEdit) {
        reset({
          nombre: conceptoToEdit.nombre,
          codigo: conceptoToEdit.codigo,
          tipo: conceptoToEdit.tipo,
          subConcepto: conceptoToEdit.subTipo || null,
          porcentaje: conceptoToEdit.porcentaje || null,
        });
      } else {
        reset({
          nombre: "",
          codigo: "",
          tipo: "INGRESO",
          subConcepto: null,
          porcentaje: null,
        });
      }
    }
  }, [isOpen, conceptoToEdit, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content Wrapper */}
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-xl p-6 sm:p-7 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
              {isEditing ? (
                <FiEdit2 className="text-sm" />
              ) : (
                <FiPlusCircle className="text-sm" />
              )}
            </div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight">
              {isEditing ? "Editar Concepto" : "Registrar Nuevo Concepto"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-4">
          <Controller
            name="codigo"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                value={field.value ?? ""}
                label="Código"
                placeholder="E.g., 0101"
                disabled={isLoading}
                error={errors.codigo?.message}
              />
            )}
          />

          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                value={field.value ?? ""}
                label="Nombre del Concepto"
                placeholder="E.g., Sueldo Básico"
                disabled={isLoading}
                error={errors.nombre?.message}
              />
            )}
          />

          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <FormSelect
                {...field}
                value={field.value ?? ""}
                label="Tipo de Concepto"
                options={[
                  { value: "INGRESO", label: "Ingreso" },
                  { value: "DESCUENTO", label: "Descuento" },
                  { value: "TRIBUTO", label: "Tributo" },
                ]}
                disabled={isLoading}
                error={errors.tipo?.message}
              />
            )}
          />

          {selectedTipo === "TRIBUTO" && (
            <Controller
              name="subConcepto"
              control={control}
              render={({ field }) => (
                <FormSelect
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                  label="Subconcepto (Solo Tributo)"
                  options={[
                    { value: "Trabajador", label: "Trabajador" },
                    { value: "Empleador", label: "Empleador" },
                  ]}
                  disabled={isLoading}
                  error={errors.subConcepto?.message}
                />
              )}
            />
          )}

          <Controller
            name="porcentaje"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value === "" ? null : Number(e.target.value))}
                label="Porcentaje (Opcional)"
                placeholder="E.g., 8.33"
                type="number"
                step="0.01"
                disabled={isLoading}
                error={errors.porcentaje?.message}
              />
            )}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-855 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-bento-secondary hover:opacity-95 text-zinc-950 rounded-bento-control text-xs font-bold shadow-md transition-all cursor-pointer border border-zinc-900/10"
            >
              {isLoading
                ? "Procesando..."
                : isEditing
                  ? "Guardar Cambios"
                  : "Crear Concepto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
