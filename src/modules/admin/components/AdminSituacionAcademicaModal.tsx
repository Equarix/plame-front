"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  situacionAcademicaSchema,
  type SituacionAcademicaFormType,
} from "../schemas/situacion-academica.schema";
import { FormInput } from "@/components/forms/FormInput";
import type { SituacionAcademicaData } from "@/interface/response.interface";
import { FiX, FiPlusCircle, FiEdit2 } from "react-icons/fi";

interface AdminSituacionAcademicaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SituacionAcademicaFormType) => void;
  situacionToEdit?: SituacionAcademicaData;
  isLoading?: boolean;
}

export function AdminSituacionAcademicaModal({
  isOpen,
  onClose,
  onSubmit,
  situacionToEdit,
  isLoading = false,
}: AdminSituacionAcademicaModalProps) {
  const isEditing = !!situacionToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SituacionAcademicaFormType>({
    resolver: zodResolver(situacionAcademicaSchema),
    defaultValues: {
      nombre: "",
      requiereEstudios: false,
    },
  });

  // Reset values when modal opens/closes or situacionToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (situacionToEdit) {
        reset({
          nombre: situacionToEdit.nombre,
          requiereEstudios: situacionToEdit.requiereEstudios,
        });
      } else {
        reset({
          nombre: "",
          requiereEstudios: false,
        });
      }
    }
  }, [isOpen, situacionToEdit]);

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
              {isEditing
                ? "Editar Situación Académica"
                : "Registrar Nueva Situación"}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Nombre de la Situación Académica"
            placeholder="Educación Superior Completa"
            disabled={isLoading}
            {...register("nombre")}
            error={errors.nombre?.message}
          />

          {/* Requires studies concluidos checkbox */}
          <div className="flex items-center gap-3 bg-zinc-55/50 dark:bg-zinc-850/30 border border-zinc-200/40 dark:border-zinc-800/40 rounded-bento-control p-4 mt-2">
            <input
              type="checkbox"
              id="requiereEstudios"
              disabled={isLoading}
              {...register("requiereEstudios")}
              className="w-4 h-4 rounded text-bento-secondary focus:ring-bento-secondary/20 border-zinc-300 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/50 accent-bento-secondary"
            />
            <label
              htmlFor="requiereEstudios"
              className="text-xs font-semibold text-bento-text/80 dark:text-bento-text/90 select-none cursor-pointer"
            >
              Requiere registrar relación de estudios concluidos
            </label>
          </div>
          {errors.requiereEstudios && (
            <p className="mt-1.5 text-xs text-bento-danger font-medium">
              {errors.requiereEstudios.message}
            </p>
          )}

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
                  : "Crear Situación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
