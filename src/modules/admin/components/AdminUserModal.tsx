"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
  }, [isOpen, userToEdit, reset]);

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
              {isEditing ? <FiEdit2 className="text-sm" /> : <FiUserPlus className="text-sm" />}
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
          <FormInput
            label="Nombre"
            name="name"
            placeholder="Juan"
            disabled={isLoading}
            register={register("name")}
            error={errors.name?.message}
          />

          <FormInput
            label="Apellido"
            name="lastName"
            placeholder="Perez"
            disabled={isLoading}
            register={register("lastName")}
            error={errors.lastName?.message}
          />

          <FormInput
            label="Nombre de Usuario"
            name="username"
            placeholder="jperez"
            disabled={isLoading}
            register={register("username")}
            error={errors.username?.message}
          />

          <FormSelect
            label="Rol del Usuario"
            name="role"
            disabled={isLoading}
            register={register("role")}
            error={errors.role?.message}
            options={[
              { value: "USER", label: "USER (Contribuyente estándar)" },
              { value: "ADMIN", label: "ADMIN (Administrador)" },
            ]}
          />

          <FormInput
            label={isEditing ? "Contraseña (Opcional - dejar vacío para no cambiar)" : "Contraseña"}
            name="password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            register={register("password")}
            error={errors.password?.message}
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
              {isLoading ? "Procesando..." : isEditing ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
