"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personaSchema, type PersonaFormType } from "../schemas/persona.schema";
import { FormInput } from "@/components/forms/FormInput";
import type { PersonaData } from "@/interface/response.interface";
import { FiX, FiPlusCircle, FiEdit2 } from "react-icons/fi";

interface AdminPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonaFormType) => void;
  personaToEdit?: PersonaData;
  isLoading?: boolean;
}

export function AdminPersonaModal({
  isOpen,
  onClose,
  onSubmit,
  personaToEdit,
  isLoading = false,
}: AdminPersonaModalProps) {
  const isEditing = !!personaToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonaFormType>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      dni: "",
      fechaNacimiento: "",
      sexo: "",
      estadoCivil: "",
      nacionalidad: "",
      primeraDireccion: "",
      segundaDireccion: "",
      telefono: "",
      email: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (personaToEdit) {
        // Format date to YYYY-MM-DD for standard date input binding
        let formattedDate = "";
        if (personaToEdit.fechaNacimiento) {
          try {
            const dateObj = new Date(personaToEdit.fechaNacimiento);
            formattedDate = dateObj.toISOString().split("T")[0];
          } catch {
            formattedDate = personaToEdit.fechaNacimiento.split("T")[0];
          }
        }
        reset({
          dni: personaToEdit.dni,
          fechaNacimiento: formattedDate,
          sexo: personaToEdit.sexo,
          estadoCivil: personaToEdit.estadoCivil,
          nacionalidad: personaToEdit.nacionalidad,
          primeraDireccion: personaToEdit.primeraDireccion,
          segundaDireccion: personaToEdit.segundaDireccion,
          telefono: personaToEdit.telefono,
          email: personaToEdit.email,
        });
      } else {
        reset({
          dni: "",
          fechaNacimiento: "",
          sexo: "",
          estadoCivil: "",
          nacionalidad: "",
          primeraDireccion: "",
          segundaDireccion: "",
          telefono: "",
          email: "",
        });
      }
    }
  }, [isOpen, personaToEdit, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content Wrapper */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-xl p-6 sm:p-7 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
              {isEditing ? <FiEdit2 className="text-sm" /> : <FiPlusCircle className="text-sm" />}
            </div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight">
              {isEditing ? "Editar Persona" : "Registrar Nueva Persona"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto pr-1.5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Documento de Identidad (DNI)"
              name="dni"
              placeholder="e.g. 70123456"
              disabled={isLoading || isEditing}
              register={register("dni")}
              error={errors.dni?.message}
            />

            <FormInput
              label="Fecha de Nacimiento"
              name="fechaNacimiento"
              type="date"
              disabled={isLoading}
              register={register("fechaNacimiento")}
              error={errors.fechaNacimiento?.message}
            />

            <div className="flex flex-col w-full">
              <label
                htmlFor="sexo"
                className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-1.5 select-none"
              >
                Sexo
              </label>
              <select
                id="sexo"
                disabled={isLoading}
                {...register("sexo")}
                className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
                  errors.sexo
                    ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
                    : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50"
                }`}
              >
                <option value="">Seleccione...</option>
                <option value="MASCULINO">MASCULINO</option>
                <option value="FEMENINO">FEMENINO</option>
              </select>
              {errors.sexo && (
                <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
                  {errors.sexo.message}
                </p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label
                htmlFor="estadoCivil"
                className="block text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-1.5 select-none"
              >
                Estado Civil
              </label>
              <select
                id="estadoCivil"
                disabled={isLoading}
                {...register("estadoCivil")}
                className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
                  errors.estadoCivil
                    ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
                    : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50"
                }`}
              >
                <option value="">Seleccione...</option>
                <option value="SOLTERO">SOLTERO(A)</option>
                <option value="CASADO">CASADO(A)</option>
                <option value="DIVORCIADO">DIVORCIADO(A)</option>
                <option value="VIUDO">VIUDO(A)</option>
              </select>
              {errors.estadoCivil && (
                <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium">
                  <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
                  {errors.estadoCivil.message}
                </p>
              )}
            </div>

            <FormInput
              label="Nacionalidad"
              name="nacionalidad"
              placeholder="e.g. PERUANA"
              disabled={isLoading}
              register={register("nacionalidad")}
              error={errors.nacionalidad?.message}
            />

            <FormInput
              label="Teléfono"
              name="telefono"
              placeholder="e.g. 987654321"
              disabled={isLoading}
              register={register("telefono")}
              error={errors.telefono?.message}
            />

            <FormInput
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="e.g. usuario@correo.com"
              disabled={isLoading}
              register={register("email")}
              error={errors.email?.message}
            />

            <FormInput
              label="Dirección Principal"
              name="primeraDireccion"
              placeholder="Av. Las Flores 123"
              disabled={isLoading}
              register={register("primeraDireccion")}
              error={errors.primeraDireccion?.message}
            />

            <div className="sm:col-span-2">
              <FormInput
                label="Dirección Secundaria"
                name="segundaDireccion"
                placeholder="Dpto. 402 - Urb. Primavera"
                disabled={isLoading}
                register={register("segundaDireccion")}
                error={errors.segundaDireccion?.message}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6 shrink-0">
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
              {isLoading ? "Procesando..." : isEditing ? "Guardar Cambios" : "Crear Persona"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
