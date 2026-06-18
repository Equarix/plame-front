"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserFormType } from "../schemas/user.schema";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import type { UserData } from "@/interface/response.interface";
import { FiX, FiUserPlus, FiEdit2 } from "react-icons/fi";

interface AdminUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormType) => void;
  userToEdit?: UserData;
  isLoading?: boolean;
}

export function AdminUserModal({
  isOpen,
  onClose,
  onSubmit,
  userToEdit,
  isLoading = false,
}: AdminUserModalProps) {
  const isEditing = !!userToEdit;

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<UserFormType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      lastName: "",
      username: "",
      role: "USER",
      password: "",
    },
  });

  // Reset values when modal opens/closes or userToEdit changes
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset({
          name: userToEdit.name,
          lastName: userToEdit.lastName,
          username: userToEdit.username,
          role: userToEdit.role,
          password: "",
        });
      } else {
        reset({
          name: "",
          lastName: "",
          username: "",
          role: "USER",
          password: "",
        });
      }
    }
  }, [isOpen, userToEdit]);

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
                <FiUserPlus className="text-sm" />
              )}
            </div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight">
              {isEditing ? "Editar Usuario" : "Registrar Nuevo Usuario"}
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
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Nombre"
                placeholder="Juan"
                disabled={isLoading}
                error={errors.name?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Apellido"
                placeholder="Perez"
                disabled={isLoading}
                error={errors.lastName?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Nombre de Usuario"
                placeholder="jperez"
                disabled={isLoading}
                error={errors.username?.message}
                {...field}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Rol del Usuario"
                disabled={isLoading}
                error={errors.role?.message}
                options={[
                  { value: "USER", label: "USER (Contribuyente estándar)" },
                  { value: "ADMIN", label: "ADMIN (Administrador)" },
                ]}
                {...field}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormInput
                label={
                  isEditing
                    ? "Contraseña (Opcional - dejar vacío para no cambiar)"
                    : "Contraseña"
                }
                type="password"
                placeholder="••••••••"
                disabled={isLoading}
                error={errors.password?.message}
                {...field}
              />
            )}
          />

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
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
                  : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
