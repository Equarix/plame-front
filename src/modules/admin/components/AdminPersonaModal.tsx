"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personaSchema, type PersonaFormType, type DireccionFormType } from "../schemas/persona.schema";
import { FormInput } from "@/components/forms/FormInput";
import type { PersonaData } from "@/interface/response.interface";
import { FiX, FiPlusCircle, FiEdit2, FiMapPin } from "react-icons/fi";
import { DireccionModal } from "../../persona/components/DireccionModal";

interface AdminPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PersonaFormType) => void;
  personaToEdit?: PersonaData;
  isLoading?: boolean;
}

const getDireccionSummary = (dir: DireccionFormType): string => {
  const parts = [
    dir.tipoVia && dir.nombreVia ? `${dir.tipoVia} ${dir.nombreVia}` : null,
    dir.numero ? `N° ${dir.numero}` : null,
    dir.tipoZona && dir.nombreZona ? `${dir.tipoZona} ${dir.nombreZona}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Dirección registrada";
};

export function AdminPersonaModal({
  isOpen,
  onClose,
  onSubmit,
  personaToEdit,
  isLoading = false,
}: AdminPersonaModalProps) {
  const isEditing = !!personaToEdit;
  const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);

  const methods = useForm<PersonaFormType>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      dni: "",
      nombres: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      sexo: "",
      estadoCivil: "",
      nacionalidad: "",
      direccion: {
        personaId: 0,
        departamentoId: 0,
        provinciaId: 0,
        distritoId: 0,
        tipoVia: "AVENIDA",
        nombreVia: "",
        numero: "",
        dpto: "",
        interior: "",
        manzana: "",
        lote: "",
        block: "",
        etapa: "",
        tipoZona: "URBANA",
        nombreZona: "",
        referencia: "",
        refiereEssalud: false,
      },
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = methods;

  const watchDireccion = watch("direccion");
  const hasDireccionFilled =
    watchDireccion &&
    Number(watchDireccion.departamentoId) > 0 &&
    Number(watchDireccion.provinciaId) > 0 &&
    Number(watchDireccion.distritoId) > 0 &&
    watchDireccion.nombreVia &&
    watchDireccion.numero;

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

        const dir = personaToEdit.primeraDireccion && personaToEdit.primeraDireccion.length > 0
          ? personaToEdit.primeraDireccion[0]
          : null;

        reset({
          dni: personaToEdit.dni,
          nombres: personaToEdit.nombres || "",
          apellidoPaterno: personaToEdit.apellidoPaterno || "",
          apellidoMaterno: personaToEdit.apellidoMaterno || "",
          fechaNacimiento: formattedDate,
          sexo: personaToEdit.sexo,
          estadoCivil: personaToEdit.estadoCivil,
          nacionalidad: personaToEdit.nacionalidad,
          direccion: dir ? {
            personaId: dir.personaId,
            departamentoId: dir.departamentoId,
            provinciaId: dir.provinciaId,
            distritoId: dir.distritoId,
            tipoVia: dir.tipoVia,
            nombreVia: dir.nombreVia,
            numero: dir.numero,
            dpto: dir.dpto || "",
            interior: dir.interior || "",
            manzana: dir.manzana || "",
            lote: dir.lote || "",
            block: dir.block || "",
            etapa: dir.etapa || "",
            tipoZona: dir.tipoZona,
            nombreZona: dir.nombreZona,
            referencia: dir.referencia || "",
            refiereEssalud: dir.refiereEssalud,
          } : {
            personaId: 0,
            departamentoId: 0,
            provinciaId: 0,
            distritoId: 0,
            tipoVia: "AVENIDA",
            nombreVia: "",
            numero: "",
            dpto: "",
            interior: "",
            manzana: "",
            lote: "",
            block: "",
            etapa: "",
            tipoZona: "URBANA",
            nombreZona: "",
            referencia: "",
            refiereEssalud: false,
          },
        });
      } else {
        reset({
          dni: "",
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          fechaNacimiento: "",
          sexo: "",
          estadoCivil: "",
          nacionalidad: "",
          direccion: {
            personaId: 0,
            departamentoId: 0,
            provinciaId: 0,
            distritoId: 0,
            tipoVia: "AVENIDA",
            nombreVia: "",
            numero: "",
            dpto: "",
            interior: "",
            manzana: "",
            lote: "",
            block: "",
            etapa: "",
            tipoZona: "URBANA",
            nombreZona: "",
            referencia: "",
            refiereEssalud: false,
          },
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto pr-1.5 space-y-5">
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
                label="Nombres"
                name="nombres"
                placeholder="e.g. Juan Carlos"
                disabled={isLoading}
                register={register("nombres")}
                error={errors.nombres?.message}
              />

              <FormInput
                label="Apellido Paterno"
                name="apellidoPaterno"
                placeholder="e.g. Pérez"
                disabled={isLoading}
                register={register("apellidoPaterno")}
                error={errors.apellidoPaterno?.message}
              />

              <FormInput
                label="Apellido Materno"
                name="apellidoMaterno"
                placeholder="e.g. Quispe"
                disabled={isLoading}
                register={register("apellidoMaterno")}
                error={errors.apellidoMaterno?.message}
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
                  <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
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
                  <p className="mt-1.5 text-xs text-bento-danger dark:text-bento-danger/90 flex items-center gap-1.5 font-medium animate-fadeIn">
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
            </div>

            <div className="flex flex-col gap-2 border-t border-zinc-200/40 dark:border-zinc-800/40 pt-4">
              <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 select-none font-medium">
                Dirección Principal
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDireccionModalOpen(true)}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 rounded-bento-control text-xs font-bold text-zinc-850 dark:text-zinc-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm w-full sm:w-auto"
                >
                  <FiMapPin className="text-sm text-zinc-500" />
                  {hasDireccionFilled ? "Editar Dirección" : "Registrar Dirección"}
                </button>
                {hasDireccionFilled && watchDireccion && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold truncate max-w-[320px]">
                    {getDireccionSummary(watchDireccion)}
                  </span>
                )}
              </div>
              {errors.direccion && (
                <p className="text-xs text-bento-danger font-medium flex items-center gap-1.5 mt-1 animate-fadeIn">
                  <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
                  Hay errores pendientes en la validación de la dirección.
                </p>
              )}
            </div>

            <DireccionModal
              isOpen={isDireccionModalOpen}
              onClose={() => setIsDireccionModalOpen(false)}
            />

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-bento-control text-xs font-semibold text-zinc-650 dark:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
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
        </FormProvider>
      </div>
    </div>
  );
}
