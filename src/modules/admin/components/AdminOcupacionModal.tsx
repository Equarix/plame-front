"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ocupacionSchema,
  type OcupacionFormType,
} from "../schemas/ocupacion.schema";
import { FormInput } from "@/components/forms/FormInput";
import type { OcupacionData } from "@/interface/response.interface";
import { FiX, FiPlusCircle, FiEdit2 } from "react-icons/fi";

interface AdminOcupacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OcupacionFormType) => void;
  ocupacionToEdit?: OcupacionData;
  isLoading?: boolean;
}

export function AdminOcupacionModal({
  isOpen,
  onClose,
  onSubmit,
  ocupacionToEdit,
  isLoading = false,
}: AdminOcupacionModalProps) {
  const isEditing = !!ocupacionToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<OcupacionFormType>({
    resolver: zodResolver(ocupacionSchema),
    defaultValues: {
      name: "",
    },
  });

  console.log({ errors });
  console.log({ watch: watch() });

  useEffect(() => {
    if (isOpen) {
      if (ocupacionToEdit) {
        reset({
          name: ocupacionToEdit.name,
        });
      } else {
        reset({
          name: "",
        });
      }
    }
  }, [isOpen, ocupacionToEdit]);

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
              {isEditing ? "Editar Ocupación" : "Registrar Nueva Ocupación"}
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
            label="Nombre de la Ocupación"
            placeholder="Administrador de Redes"
            disabled={isLoading}
            {...register("name")}
            error={errors.name?.message}
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
                  : "Crear Ocupación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
