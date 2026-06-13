"use client";

import React from "react";
import { useAuth } from "@/components/context/AuthContext";
import { FormProvider } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import {
  FiPlus,
  FiSearch,
  FiX,
  FiUser,
  FiMapPin,
  FiLock,
} from "react-icons/fi";
import { toast } from "sonner";

import { type DireccionFormType, type PersonaFormType } from "../../admin/schemas/persona.schema";
import { DashboardLayout } from "../components/DashboardLayout";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { DireccionModal } from "../../persona/components/DireccionModal";
import { AddAddressModal } from "../../persona/components/AddAddressModal";
import { PersonaSummaryCard } from "../../persona/components/PersonaSummaryCard";
import { useTRegistroForm, type CategoriaType, type EstudiosInput } from "../hooks/useTRegistroForm";
import { Tabs, TabHeader, TabHeaderButton, TabBody, Tab } from "@/components/Tabs/Tabs";
import { ResumenTab } from "../components/ResumenTab";
import { TrabajadorTab } from "../components/TrabajadorTab";
import { PensionistaTab } from "../components/PensionistaTab";
import { FormacionTab } from "../components/FormacionTab";
import { TRegistroSuccessScreen } from "../components/TRegistroSuccessScreen";

const getDireccionSummary = (dir: DireccionFormType): string => {
  const parts = [
    dir.tipoVia && dir.nombreVia ? `${dir.tipoVia} ${dir.nombreVia}` : null,
    dir.numero ? `N° ${dir.numero}` : null,
    dir.tipoZona ? `${dir.tipoZona} ${dir.nombreZona}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Dirección registrada";
};

export function TRegistroCrearPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { token } = useAuth();

  const {
    selectedPersona,
    isModalOpen,
    setIsModalOpen,
    formPhase,
    setFormPhase,
    searchDni,
    setSearchDni,
    isSearching,
    isDireccionModalOpen,
    setIsDireccionModalOpen,
    activeTab,
    setActiveTab,
    categoria,
    setCategoria,
    methods,
    handleOpenSearch,
    handleSearch,
    isCreating,
    onSubmitRegister,
    isBlocking,
    createTPersona,
    isCreatingTPersona,
    updateTPersona,
    isUpdatingTPersona,
    companyId,
    telefono,
    setTelefono,
    email,
    setEmail,
    isAddAddressModalOpen,
    setIsAddAddressModalOpen,
    setSelectedPersona,
    successData,
    setSuccessData,
  } = useTRegistroForm();

  const {
    register,
    handleSubmit,
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

  // Estudios del trabajador — state elevado a nivel de página
  const [estudios, setEstudios] = React.useState<EstudiosInput[]>([]);

  // Fetch details of T-Persona in edit mode
  const { data: tPersonaDetails, isLoading: isLoadingDetails } = useQuery<any>({
    queryKey: ["t-persona-details", editId, token],
    queryFn: async () => {
      if (!editId) return null;
      const res = await Api.get(`/t-persona/details/${editId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!editId && !!token,
  });

  // Skip search modal and go directly to register phase if editing
  React.useEffect(() => {
    if (editId) {
      setIsModalOpen(false);
      setFormPhase("register");
    }
  }, [editId, setIsModalOpen, setFormPhase]);

  // Pre-populate form values once worker details are retrieved
  React.useEffect(() => {
    if (tPersonaDetails) {
      setSelectedPersona(tPersonaDetails.persona);
      setTelefono(tPersonaDetails.telefono || "");
      setEmail(tPersonaDetails.email || "");
      setCategoria(tPersonaDetails.categoria);

      if (tPersonaDetails.estudios) {
        setEstudios(tPersonaDetails.estudios);
      }

      const formatDate = (isoStr?: string) => {
        if (!isoStr) return "";
        return isoStr.split("T")[0];
      };

      const formattedValues = {
        dni: tPersonaDetails.persona.dni,
        nombres: tPersonaDetails.persona.nombres,
        apellidoPaterno: tPersonaDetails.persona.apellidoPaterno,
        apellidoMaterno: tPersonaDetails.persona.apellidoMaterno,
        fechaNacimiento: formatDate(tPersonaDetails.persona.fechaNacimiento),
        sexo: tPersonaDetails.persona.sexo,
        estadoCivil: tPersonaDetails.persona.estadoCivil,
        nacionalidad: tPersonaDetails.persona.nacionalidad,
        direccion: tPersonaDetails.persona.direcciones && tPersonaDetails.persona.direcciones.length > 0
          ? tPersonaDetails.persona.direcciones[0]
          : {
              personaId: 0,
              departamentoId: 0,
              provinciaId: 0,
              distritoId: 0,
              tipoVia: "AVENIDA",
              nombreVia: "",
              numero: "",
              tipoZona: "URBANA",
              nombreZona: "",
            },

        fechaInicio: formatDate(tPersonaDetails.fechaInicio),
        fechaFin: formatDate(tPersonaDetails.periodoFin),
        motivoBaja: tPersonaDetails.motivoBaja || "",
        tipoTrabajador: tPersonaDetails.tipoTrabajador || "EMPLEADO",
        fechaInicioTipo: formatDate(tPersonaDetails.fechaIngreso),
        regimenLaboral: tPersonaDetails.regimenLaboral || "D_LEG_728",
        rdb_descripcion_detalle: tPersonaDetails.otroRegimenLaboral || "",
        categoriaOcupacional: "EMPLEADO",
        ocupacionId: tPersonaDetails.ocupacionId || "",
        ocupacionNombre: tPersonaDetails.ocupacion?.name || "",
        tipoContrato: tPersonaDetails.tipoContrato || "PLAZO_INDETERMINADO",
        tipoPago: tPersonaDetails.tipoPago || "EFECTIVO",
        periodoIngreso: tPersonaDetails.periodoIngreso || "MENSUAL",
        montoRemuneracion: tPersonaDetails.montoRemuneracionInicial || 1025,
        establecimiento: tPersonaDetails.tEmpresaCompanyId,
        codLocal: tPersonaDetails.codlocal || "0000",
        localTipo: "DOMICILIO FISCAL",
        jornadaLaboral: tPersonaDetails.jornadaLaboral || "MAXIMA",
        situacionEspecial: tPersonaDetails.situacionEspecial || "NINGUNA",
        discapacidad: tPersonaDetails.discapacidad ? "SI" : "NO",
        sindicalizado: tPersonaDetails.sindicalizado ? "SI" : "NO",
        situacion: "Activo",

        regimenSalud: tPersonaDetails.regimenSalud || "ESSALUD_REGULAR",
        fechaInicioSalud: formatDate(tPersonaDetails.fechaInicioSalud),
        fechaFinSalud: formatDate(tPersonaDetails.fechaFinSalud),
        regimenPensionario: tPersonaDetails.regimenPensionario || "SIN_REGIMEN_PENSIONARIO",
        fechaInicioPensionario: formatDate(tPersonaDetails.fechaInicioPensionario),
        fechaFinPensionario: formatDate(tPersonaDetails.fechaFinPensionario),
        CUSPP: tPersonaDetails.CUSPP || "",
        sctr: tPersonaDetails.sctr ? "SI" : "NO",
        pension: tPersonaDetails.pension || "ONP",
        salud: tPersonaDetails.salud || "ESSALUD",
        fechaInicioSaludPension: formatDate(tPersonaDetails.fechaInicioSaludPension),
        fechaFinSaludPension: formatDate(tPersonaDetails.fechaFinSaludPension),

        situacionEducativaId: tPersonaDetails.situacionEducativaId || 1,
        situacionEducativaNombre: tPersonaDetails.situacionEducativa?.nombre || "",
        quintaCategoriaExonerada: tPersonaDetails.quintaCategoriaExonerada ? "SI" : "NO",
        evitaDobleImposicion: tPersonaDetails.evitaDobleImposicion ? "SI" : "NO",
      };

      methods.reset(formattedValues as any);
      methods.setValue("ocupacionNombre" as keyof PersonaFormType, tPersonaDetails.ocupacion?.name || "");
      methods.setValue("situacionEducativaNombre" as keyof PersonaFormType, tPersonaDetails.situacionEducativa?.nombre || "");
    }
  }, [tPersonaDetails, methods, setSelectedPersona, setTelefono, setEmail, setCategoria]);

  if (successData) {
    return (
      <DashboardLayout title={editId ? "Editar T-Registro" : "Registrar T-Registro"} icon={<FiPlus className="text-sm" />}>
        <TRegistroSuccessScreen
          data={successData}
          onRetornar={() => {
            setSuccessData(null);
            router.push("/t-registro");
          }}
        />
      </DashboardLayout>
    );
  }

  if (editId && isLoadingDetails) {
    return (
      <DashboardLayout title="Editar T-Registro" icon={<FiPlus className="text-sm" />}>
        <div className="p-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
          Cargando detalles del trabajador...
        </div>
      </DashboardLayout>
    );
  }

  const handleGrabar = () => {
    if (!selectedPersona) {
      toast.error("Debe buscar y seleccionar una persona primero");
      return;
    }

    if (!companyId) {
      toast.error("Debe seleccionar una empresa activa");
      return;
    }

    if (!telefono.trim()) {
      toast.error("Debe ingresar un número de teléfono para el prestador");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Debe ingresar un correo electrónico válido para el prestador");
      return;
    }

    const formValues = methods.getValues() as PersonaFormType & {
      ocupacionId?: string | number;
      fechaInicio?: string;
      tipoTrabajador?: string;
      regimenLaboral?: string;
      tipoContrato?: string;
      tipoPago?: string;
      entidadId?: string | number;
      montoRemuneracion?: string | number;
      periodoIngreso?: string;
      jornadaLaboral?: string;
      codLocal?: string;
      situacionEspecial?: string;
      discapacidad?: string;
      sindicalizado?: string;
      regimenSalud?: string;
      fechaInicioSalud?: string;
      fechaFinSalud?: string;
      regimenPensionario?: string;
      fechaInicioPensionario?: string;
      fechaFinPensionario?: string;
      CUSPP?: string;
      sctr?: string;
      pension?: string;
      salud?: string;
      fechaInicioSaludPension?: string;
      fechaFinSaludPension?: string;
      situacionEducativaId?: string | number;
      quintaCategoriaExonerada?: string;
      evitaDobleImposicion?: string;
    };
    const activeOcupacionId = formValues.ocupacionId ? Number(formValues.ocupacionId) : undefined;

    if (categoria === "TRABAJADOR" && !activeOcupacionId) {
      toast.error("Debe seleccionar una ocupación para el trabajador");
      return;
    }

    const isSctrActive = formValues.sctr === "SI";

    const payload = {
      personaId: selectedPersona.personaId,
      categoria: categoria,
      tEmpresaCompanyId: companyId,
      periodoInicio: editId ? tPersonaDetails?.periodoInicio : new Date().toISOString(),
      fechaInicio: formValues.fechaInicio ? new Date(formValues.fechaInicio).toISOString() : new Date().toISOString(),
      tipoTrabajador: formValues.tipoTrabajador || "EMPLEADO",
      fechaIngreso: editId ? tPersonaDetails?.fechaIngreso : new Date().toISOString(),
      regimenLaboral: formValues.regimenLaboral || "D_LEG_728",
      ocupacionId: activeOcupacionId || 1,
      tipoContrato: formValues.tipoContrato || "PLAZO_INDETERMINADO",
      tipoPago: formValues.tipoPago || "EFECTIVO",
      entidadId: formValues.entidadId ? Number(formValues.entidadId) : 1,
      montoRemuneracionInicial: formValues.montoRemuneracion ? Number(formValues.montoRemuneracion) : 1025,

      regimenSalud: formValues.regimenSalud || "ESSALUD_REGULAR",
      fechaInicioSalud: formValues.fechaInicioSalud ? new Date(formValues.fechaInicioSalud).toISOString() : new Date().toISOString(),
      fechaFinSalud: formValues.fechaFinSalud ? new Date(formValues.fechaFinSalud).toISOString() : undefined,
      regimenPensionario: formValues.regimenPensionario || "SIN_REGIMEN_PENSIONARIO",
      fechaInicioPensionario: formValues.fechaInicioPensionario ? new Date(formValues.fechaInicioPensionario).toISOString() : new Date().toISOString(),
      fechaFinPensionario: formValues.fechaFinPensionario ? new Date(formValues.fechaFinPensionario).toISOString() : undefined,
      CUSPP: (formValues.regimenPensionario && formValues.regimenPensionario.startsWith("SPP_")) ? (formValues.CUSPP || undefined) : undefined,
      sctr: isSctrActive,
      pension: isSctrActive ? (formValues.pension || "ONP") : undefined,
      salud: isSctrActive ? (formValues.salud || "ESSALUD") : undefined,
      fechaInicioSaludPension: isSctrActive ? (formValues.fechaInicioSaludPension ? new Date(formValues.fechaInicioSaludPension).toISOString() : new Date().toISOString()) : undefined,
      fechaFinSaludPension: isSctrActive && formValues.fechaFinSaludPension ? new Date(formValues.fechaFinSaludPension).toISOString() : undefined,

      situacionEducativaId: formValues.situacionEducativaId ? Number(formValues.situacionEducativaId) : 1,
      estudios: estudios,
      quintaCategoriaExonerada: formValues.quintaCategoriaExonerada === "SI",
      evitaDobleImposicion: formValues.evitaDobleImposicion === "SI",
      periodoIngreso: formValues.periodoIngreso || "MENSUAL",
      telefono: telefono,
      email: email,
      jornadaLaboral: formValues.jornadaLaboral || "MAXIMA",
      codlocal: formValues.codLocal || "0000",
      situacionEspecial: formValues.situacionEspecial || "NINGUNA",
      discapacidad: formValues.discapacidad === "SI",
      sindicalizado: formValues.sindicalizado === "SI",
    };

    if (editId) {
      updateTPersona(
        { id: Number(editId), data: payload },
        {
          onSuccess: () => {
            router.push("/t-registro");
          },
        }
      );
    } else {
      createTPersona(payload);
    }
  };

  const categoriesList: { value: CategoriaType; label: string; desc: string }[] = [
    {
      value: "TRABAJADOR",
      label: "Trabajador",
      desc: "Persona física que presta servicios bajo subordinación.",
    },
    {
      value: "PENSIONISTA",
      label: "Pensionista",
      desc: "Persona que percibe pensión de jubilación, invalidez o sobrevivencia.",
    },
    {
      value: "PERSONAL_FORMACION_LABORAL",
      label: "Personal en formación laboral",
      desc: "Practicantes, aprendices o personas bajo modalidades formativas.",
    },
    {
      value: "PERSONAL_TERCERO",
      label: "Personal de Terceros",
      desc: "Trabajadores destacados por contratistas o subcontratistas.",
    },
  ];

  return (
    <DashboardLayout title={editId ? "Editar T-Registro" : "Registrar T-Registro"} icon={<FiPlus className="text-sm" />}>
      <div className="flex flex-col gap-6">

        {/* Datos de Identificación (Siempre visible si está seleccionada) */}
        {selectedPersona ? (
          <PersonaSummaryCard
            persona={selectedPersona}
            onCambiarPersona={editId ? undefined : handleOpenSearch} // Disable changing persona in edit mode
            telefono={telefono}
            onChangeTelefono={setTelefono}
            email={email}
            onChangeEmail={setEmail}
            onAddAddress={() => setIsAddAddressModalOpen(true)}
          />
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

        {/* Categoría & Tabs (Deshabilitado si no hay persona seleccionada) */}
        <FormProvider {...methods}>
          <div
            className={`bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-5 sm:p-6 shadow-sm flex flex-col transition-all duration-300 ${!selectedPersona ? "blur-sm opacity-45 pointer-events-none select-none" : ""
              }`}
          >
            <div className="border-b border-zinc-200/40 dark:border-zinc-800/40 pb-4 mb-5">
              <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base leading-none">
                Categoría
              </h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-none">
                Especifique la categoría y configure la relación de prestaciones correspondientes
              </p>
            </div>

            {/* Tabs Navigation & Content */}
            <Tabs defaultValue="resumen" className="mt-4" onChange={(val) => setActiveTab(val as any)}>
              <TabHeader>
                <TabHeaderButton value="resumen">Resumen de Prestadores</TabHeaderButton>
                <TabHeaderButton
                  value="trabajador"
                  disabled={categoria !== "TRABAJADOR"}
                  className={categoria !== "TRABAJADOR" ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Trabajador
                </TabHeaderButton>
                <TabHeaderButton
                  value="pensionista"
                  disabled={categoria !== "PENSIONISTA"}
                  className={categoria !== "PENSIONISTA" ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Pensionista
                </TabHeaderButton>
                <TabHeaderButton
                  value="formacion"
                  disabled={categoria !== "PERSONAL_FORMACION_LABORAL"}
                  className={categoria !== "PERSONAL_FORMACION_LABORAL" ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Personal en formación laboral
                </TabHeaderButton>
              </TabHeader>

              <TabBody className="py-4 min-h-[220px]">
                <Tab value="resumen">
                  <ResumenTab
                    categoria={categoria}
                    setCategoria={setCategoria}
                    categoriesList={categoriesList}
                  />
                </Tab>

                <Tab value="trabajador">
                  <TrabajadorTab
                    estudios={estudios}
                    onEstudiosChange={setEstudios}
                  />
                </Tab>

                <Tab value="pensionista">
                  <PensionistaTab />
                </Tab>

                <Tab value="formacion">
                  <FormacionTab />
                </Tab>
              </TabBody>
            </Tabs>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3.5 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 shrink-0">
              <button
                type="button"
                onClick={() => router.push("/t-registro")}
                className="px-4.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-bold text-zinc-650 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
              >
                Retornar
              </button>
              <button
                type="button"
                onClick={handleGrabar}
                disabled={isCreatingTPersona || isUpdatingTPersona}
                className="px-5 py-2 bg-bento-secondary hover:opacity-95 text-zinc-950 rounded-bento-control text-xs font-extrabold shadow-md transition-all cursor-pointer border border-zinc-900/10 flex items-center gap-1.5"
              >
                {isCreatingTPersona || isUpdatingTPersona ? "Grabando..." : "Grabar"}
              </button>
            </div>
          </div>
        </FormProvider>
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
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
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

                    <FormSelect
                      label="Sexo"
                      name="sexo"
                      disabled={isCreating}
                      register={register("sexo")}
                      error={errors.sexo?.message}
                      options={[
                        { value: "MASCULINO", label: "MASCULINO" },
                        { value: "FEMENINO", label: "FEMENINO" },
                      ]}
                    />

                    <FormSelect
                      label="Estado Civil"
                      name="estadoCivil"
                      disabled={isCreating}
                      register={register("estadoCivil")}
                      error={errors.estadoCivil?.message}
                      options={[
                        { value: "SOLTERO", label: "SOLTERO(A)" },
                        { value: "CASADO", label: "CASADO(A)" },
                        { value: "DIVORCIADO", label: "DIVORCIADO(A)" },
                        { value: "VIUDO", label: "VIUDO(A)" },
                      ]}
                    />

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
                      className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-650 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
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

      {selectedPersona && (
        <AddAddressModal
          isOpen={isAddAddressModalOpen}
          onClose={() => setIsAddAddressModalOpen(false)}
          personaId={selectedPersona.personaId}
          onSuccess={(newAddress) => {
            setSelectedPersona({
              ...selectedPersona,
              direcciones: [...(selectedPersona.direcciones || []), newAddress],
            });
          }}
        />
      )}
    </DashboardLayout>
  );
}
