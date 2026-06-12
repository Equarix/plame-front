"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLock,
} from "react-icons/fi";

import type { ApiResponse, PersonaData, DireccionData } from "@/interface/response.interface";
import { personaSchema, type PersonaFormType, type DireccionFormType } from "../../admin/schemas/persona.schema";
import { DashboardLayout } from "../components/DashboardLayout";
import { FormInput } from "@/components/forms/FormInput";
import { DireccionModal } from "../../persona/components/DireccionModal";
import { formatDireccion } from "@/utils/address";
import { AxiosError } from "axios";

const getDireccionSummary = (dir: DireccionFormType): string => {
  const parts = [
    dir.tipoVia && dir.nombreVia ? `${dir.tipoVia} ${dir.nombreVia}` : null,
    dir.numero ? `N° ${dir.numero}` : null,
    dir.tipoZona && dir.nombreZona ? `${dir.tipoZona} ${dir.nombreZona}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Dirección registrada";
};

export function TRegistroCrearPage() {
  const { token } = useAuth();

  const [selectedPersona, setSelectedPersona] = useState<PersonaData | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formPhase, setFormPhase] = useState<"search" | "register">("search");
  const [searchDni, setSearchDni] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [isDireccionModalOpen, setIsDireccionModalOpen] = useState(false);

  // Zod hook-form for registration
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
      nacionalidad: "PERUANA",
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
    setValue,
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

  // Reset form phase and selected person when modal opens
  const handleOpenSearch = () => {
    setFormPhase("search");
    setSearchDni("");
    setIsModalOpen(true);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{8}$/.test(searchDni)) {
      toast.error("El DNI debe tener exactamente 8 dígitos numéricos");
      return;
    }

    try {
      setIsSearching(true);
      const res = await Api.get(`/persona/dni/${searchDni}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.body) {
        toast.success("Persona encontrada en el sistema");
        setSelectedPersona(res.data.body);
        setIsModalOpen(false);
      } else {
        toast.info("La persona no existe. Por favor, complete el registro.");
        setFormPhase("register");
        reset({
          dni: searchDni,
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          fechaNacimiento: "",
          sexo: "",
          estadoCivil: "",
          nacionalidad: "PERUANA",
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
        setValue("dni", searchDni);
      }
    } catch (err: unknown) {
      const error = err as AxiosError;

      if (error.response?.status === 404) {
        toast.info("La persona no existe. Por favor, complete el registro.");
        setFormPhase("register");
        reset({
          dni: searchDni,
          nombres: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          fechaNacimiento: "",
          sexo: "",
          estadoCivil: "",
          nacionalidad: "PERUANA",
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
        setValue("dni", searchDni);
      } else {
        toast.error("Error al buscar la persona por DNI");
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Create persona mutation
  const { mutate: createPersona, isPending: isCreating } = useMutation({
    mutationFn: async (formData: PersonaFormType) => {
      const res = await Api.post("/persona", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data as ApiResponse<PersonaData>;
    },
    onSuccess: (data) => {
      toast.success("Persona registrada y seleccionada con éxito");
      setSelectedPersona(data.body);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la persona");
    },
  });

  const onSubmitRegister = (data: PersonaFormType) => {
    createPersona(data);
  };

  const isBlocking = !selectedPersona;

  return (
    <DashboardLayout title="Registrar Persona" icon={<FiPlus className="text-sm" />}>
      <div className="flex flex-col gap-6">
        {/* Selected Persona Summary Card */}
        {selectedPersona ? (
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-bento-control bg-bento-secondary/15 text-bento-secondary flex items-center justify-center shrink-0">
                <FiUser className="text-xl" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block leading-none">Persona Seleccionada</span>
                <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1 leading-tight">
                  DNI: {selectedPersona.dni}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  {selectedPersona.email && <span className="flex items-center gap-1"><FiMail className="shrink-0 text-[10px]" /> {selectedPersona.email}</span>}
                  {selectedPersona.telefono && <span className="flex items-center gap-1"><FiPhone className="shrink-0 text-[10px]" /> {selectedPersona.telefono}</span>}
                  {selectedPersona.primeraDireccion && selectedPersona.primeraDireccion.length > 0 && (
                    <span className="flex items-center gap-1 truncate max-w-[450px]" title={formatDireccion(selectedPersona.primeraDireccion[0])}>
                      <FiMapPin className="shrink-0 text-[10px]" />
                      {formatDireccion(selectedPersona.primeraDireccion[0])}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleOpenSearch}
              className="w-full sm:w-auto px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-bento-secondary/50 rounded-bento-control text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:text-bento-secondary transition-all duration-200 cursor-pointer shadow-sm text-center shrink-0"
            >
              Cambiar Persona
            </button>
          </div>
        ) : (
          <div className="bg-bento-danger/5 border border-bento-danger/15 rounded-bento-card p-6 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-bento-danger/10 text-bento-danger flex items-center justify-center mx-auto mb-3">
              <FiLock className="text-lg" />
            </div>
            <h4 className="text-sm font-bold text-zinc-850 dark:text-zinc-100">Búsqueda Requerida</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Debe buscar o registrar una persona por DNI para habilitar el formulario de T-Registro.
            </p>
            <button
              onClick={handleOpenSearch}
              className="mt-4 px-4 py-2 bg-bento-secondary text-zinc-950 text-xs font-bold rounded-bento-control hover:opacity-95 shadow-sm transition-all cursor-pointer"
            >
              Buscar Persona
            </button>
          </div>
        )}

        {/* Empty Page / Form for TPersona */}
        <div className={`bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col transition-all duration-300 ${!selectedPersona ? "blur-sm opacity-40 pointer-events-none select-none" : ""}`}>
          <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base mb-4">
            Datos Laborales (TPersona)
          </h3>
          
          <div className="border border-dashed border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-12 flex flex-col items-center justify-center text-center">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              Formulario de Relación Laboral - Listo para la implementación de {selectedPersona?.dni}
            </p>
            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1 max-w-sm">
              Aquí puedes añadir campos como ocupación, régimen laboral, ingresos, situación académica, etc.
            </p>
          </div>
        </div>
      </div>

      {/* DNI Search / Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            onClick={() => !isBlocking && setIsModalOpen(false)}
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Box */}
          <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-xl p-6 sm:p-7 flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
                  <FiSearch className="text-sm" />
                </div>
                <div>
                  <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight leading-none text-sm sm:text-base">
                    {formPhase === "search" ? "Buscar Persona" : "Registrar Persona"}
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-none">
                    {formPhase === "search"
                      ? "Identifique a la persona en el sistema"
                      : "La persona no está registrada. Ingrese sus datos."}
                  </p>
                </div>
              </div>
              {!isBlocking && (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                >
                  <FiX className="text-lg" />
                </button>
              )}
            </div>

            {/* Content phase 1: Search */}
            {formPhase === "search" && (
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="searchDni" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Documento de Identidad (DNI)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-zinc-400 dark:text-zinc-500">
                      <FiSearch className="text-sm" />
                    </span>
                    <input
                      type="text"
                      id="searchDni"
                      value={searchDni}
                      onChange={(e) => setSearchDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      placeholder="Ingrese los 8 dígitos del DNI..."
                      required
                      disabled={isSearching}
                      className="block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 pl-10 pr-3.5 h-11 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6">
                  {!isBlocking && (
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="px-4 py-2 bg-bento-secondary hover:opacity-95 text-zinc-950 rounded-bento-control text-xs font-bold shadow-md transition-all cursor-pointer border border-zinc-900/10 flex items-center gap-1.5"
                  >
                    {isSearching ? "Buscando..." : "Buscar"}
                  </button>
                </div>
              </form>
            )}

            {/* Content phase 2: Register */}
            {formPhase === "register" && (
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitRegister)} className="flex-1 overflow-y-auto pr-1 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="DNI"
                      name="dni"
                      disabled={true}
                      register={register("dni")}
                      error={errors.dni?.message}
                    />

                    <FormInput
                      label="Nombres"
                      name="nombres"
                      placeholder="e.g. Juan Carlos"
                      disabled={isCreating}
                      register={register("nombres")}
                      error={errors.nombres?.message}
                    />

                    <FormInput
                      label="Apellido Paterno"
                      name="apellidoPaterno"
                      placeholder="e.g. Pérez"
                      disabled={isCreating}
                      register={register("apellidoPaterno")}
                      error={errors.apellidoPaterno?.message}
                    />

                    <FormInput
                      label="Apellido Materno"
                      name="apellidoMaterno"
                      placeholder="e.g. Quispe"
                      disabled={isCreating}
                      register={register("apellidoMaterno")}
                      error={errors.apellidoMaterno?.message}
                    />

                    <FormInput
                      label="Fecha de Nacimiento"
                      name="fechaNacimiento"
                      type="date"
                      disabled={isCreating}
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
                        disabled={isCreating}
                        {...register("sexo")}
                        className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
                          errors.sexo
                            ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
                            : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary"
                        }`}
                      >
                        <option value="">Seleccione...</option>
                        <option value="MASCULINO">MASCULINO</option>
                        <option value="FEMENINO">FEMENINO</option>
                      </select>
                      {errors.sexo && (
                        <p className="mt-1.5 text-xs text-bento-danger font-medium animate-fadeIn">
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
                        disabled={isCreating}
                        {...register("estadoCivil")}
                        className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all duration-200 h-11 px-3.5 ${
                          errors.estadoCivil
                            ? "border-bento-danger focus:ring-bento-danger/20 focus:border-bento-danger"
                            : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary"
                        }`}
                      >
                        <option value="">Seleccione...</option>
                        <option value="SOLTERO">SOLTERO(A)</option>
                        <option value="CASADO">CASADO(A)</option>
                        <option value="DIVORCIADO">DIVORCIADO(A)</option>
                        <option value="VIUDO">VIUDO(A)</option>
                      </select>
                      {errors.estadoCivil && (
                        <p className="mt-1.5 text-xs text-bento-danger font-medium animate-fadeIn">
                          <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
                          {errors.estadoCivil.message}
                        </p>
                      )}
                    </div>

                    <FormInput
                      label="Nacionalidad"
                      name="nacionalidad"
                      placeholder="e.g. PERUANA"
                      disabled={isCreating}
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

                  <div className="flex justify-between items-center pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-6">
                    <button
                      type="button"
                      onClick={() => setFormPhase("search")}
                      disabled={isCreating}
                      className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-500 cursor-pointer"
                    >
                      &larr; Volver a Buscar
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="px-4 py-2 bg-bento-secondary hover:opacity-95 text-zinc-950 rounded-bento-control text-xs font-bold shadow-md transition-all cursor-pointer border border-zinc-900/10"
                    >
                      {isCreating ? "Registrando..." : "Registrar Persona"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            )}

          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
