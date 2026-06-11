"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type AuthSchemaType } from "@/schemas/auth/login.schema";
import { useAuth } from "@/components/context/AuthContext";
import { FormInput } from "@/components/forms/FormInput";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

export function AdminLoginForm() {
  const { loginAdmin, isLoadLoginAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: AuthSchemaType) => {
    loginAdmin(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Username Field */}
      <FormInput
        label="Usuario Administrador"
        name="username"
        placeholder="Introduce tu usuario administrador"
        disabled={isLoadLoginAdmin}
        icon={FaUser}
        register={register("username")}
        error={errors.username?.message}
      />

      {/* Password Field */}
      <FormInput
        label="Contraseña de Administrador"
        name="password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        disabled={isLoadLoginAdmin}
        icon={FaLock}
        register={register("password")}
        error={errors.password?.message}
        rightElement={
          <button
            type="button"
            disabled={isLoadLoginAdmin}
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
          >
            {showPassword ? (
              <FaEyeSlash className="h-4 w-4" />
            ) : (
              <FaEye className="h-4 w-4" />
            )}
          </button>
        }
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoadLoginAdmin}
        className="w-full flex justify-center items-center py-2.5 px-4 rounded-bento-control text-sm font-semibold text-zinc-950 bg-bento-primary hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-bento-primary/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all duration-200 cursor-pointer border border-zinc-900/10"
      >
        {isLoadLoginAdmin ? (
          <>
            <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-950" />
            Iniciando sesión...
          </>
        ) : (
          "Ingresar al Panel"
        )}
      </button>
    </form>
  );
}
