"use client";

import React, { useState } from "react";
import { FiUsers, FiPlus, FiFileText, FiEdit2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { toast } from "sonner";
import {
  DashboardTableCard,
  type DashboardTableColumn,
} from "@/components/DashboardTableCard";
import { DashboardLayout } from "../components/DashboardLayout";
import { formatDireccion } from "@/utils/address";
import type { EstudiosInput, CategoriaType } from "../hooks/useTRegistroForm";
import type { ApiResponse, EmpresaData, PersonaData } from "@/interface/response.interface";

interface RawTPersona {
  tPersonaId: number;
  personaId: number;
}

export interface TPersonaRow {
  tPersonaId: number;
  personaId: number;
  categoria: CategoriaType;
  telefono: string;
  email: string;
  periodoInicio: string;
  fechaInicio: string;
  periodoFin: string | null;
  motivoBaja: string | null;
  tipoTrabajador: string;
  fechaIngreso: string;
  regimenLaboral: string;
  otroRegimenLaboral: string | null;
  ocupacionId: number;
  tipoContrato: string;
  otroTipoContrato: string | null;
  tipoPago: string;
  otroTipoPago: string | null;
  periodoIngreso: string;
  otroPeriodoIngreso: string | null;
  entidadId: number;
  cuentaBancaria: string | null;
  montoRemuneracionInicial: number;
  codlocal: string;
  local: string | null;
  jornadaLaboral: string;
  situacionEspecial: string | null;
  discapacidad: boolean;
  sindicalizado: boolean;
  regimenSalud: string;
  fechaInicioSalud: string;
  fechaFinSalud: string | null;
  regimenPensionario: string;
  fechaInicioPensionario: string;
  fechaFinPensionario: string | null;
  CUSPP: string | null;
  sctr: boolean;
  pension: string | null;
  salud: string | null;
  fechaInicioSaludPension: string | null;
  fechaFinSaludPension: string | null;
  situacionEducativaId: number;
  quintaCategoriaExonerada: boolean;
  evitaDobleImposicion: boolean;
  tEmpresaCompanyId: number;
  createAt: string;
  userId: number;
  persona: PersonaData;
  ocupacion?: {
    ocupacionId: number;
    name: string;
  } | null;
  situacionEducativa?: {
    situacionEducativaId: number;
    nombre: string;
  } | null;
  estudios?: EstudiosInput[];
}

interface ActiveCompanyType {
  companyId: number;
  ruc: string;
  name: string;
  address: string;
}

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "TRABAJADOR":
      return "Trabajador";
    case "PENSIONISTA":
      return "Pensionista";
    case "PERSONAL_FORMACION_LABORAL":
      return "Personal en Formación";
    case "PERSONAL_TERCERO":
      return "Personal de Terceros";
    default:
      return category;
  }
};

function mapTPersonaToPDFPayload(
  tp: TPersonaRow,
  activeCompany: ActiveCompanyType,
) {
  const principalAddress =
    tp.persona.direcciones && tp.persona.direcciones.length > 0
      ? formatDireccion({
          ...tp.persona.direcciones[0],
          refiereEssalud: tp.persona.direcciones[0].refiereEssalud ?? false,
        })
      : "No registrada";

  return {
    tPersonaId: tp.tPersonaId,
    createAt: tp.createAt,
    empleador: {
      ruc: activeCompany.ruc,
      name: activeCompany.name,
      direccion: activeCompany.address,
    },
    trabajador: {
      dni: tp.persona.dni,
      nombres: tp.persona.nombres,
      apellidoPaterno: tp.persona.apellidoPaterno,
      apellidoMaterno: tp.persona.apellidoMaterno,
      fechaNacimiento: tp.persona.fechaNacimiento,
      sexo: tp.persona.sexo,
      estadoCivil: tp.persona.estadoCivil,
      nacionalidad: tp.persona.nacionalidad,
      telefono: tp.telefono || "",
      email: tp.email || "",
      direccion: principalAddress,
    },
    laborales: {
      fechaInicio: tp.fechaInicio || "",
      tipoTrabajador: tp.tipoTrabajador || "EMPLEADO",
      regimenLaboral: tp.regimenLaboral || "D_LEG_728",
      ocupacion: tp.ocupacion?.name || "OCUPACION NO ESPECIFICADA",
      tipoContrato: tp.tipoContrato || "PLAZO_INDETERMINADO",
      tipoPago: tp.tipoPago || "EFECTIVO",
      periodoIngreso: tp.periodoIngreso || "MENSUAL",
      montoRemuneracion: tp.montoRemuneracionInicial || 0,
      codlocal: tp.codlocal || "0000",
      discapacidad: tp.discapacidad || false,
      sindicalizado: tp.sindicalizado || false,
      jornadaLaboral: tp.jornadaLaboral || "MAXIMA",
      situacionEspecial: tp.situacionEspecial || "NINGUNA",
    },
    seguridadSocial: {
      regimenSalud: tp.regimenSalud || "ESSALUD_REGULAR",
      fechaInicioSalud: tp.fechaInicioSalud || "",
      fechaFinSalud: tp.fechaFinSalud || undefined,
      regimenPensionario: tp.regimenPensionario || "SIN_REGIMEN_PENSIONARIO",
      fechaInicioPensionario: tp.fechaInicioPensionario || "",
      fechaFinPensionario: tp.fechaFinPensionario || undefined,
      CUSPP: tp.CUSPP || undefined,
      sctr: tp.sctr || false,
      pension: tp.pension || undefined,
      salud: tp.salud || undefined,
      fechaInicioSaludPension: tp.fechaInicioSaludPension || undefined,
      fechaFinSaludPension: tp.fechaFinSaludPension || undefined,
    },
    educacion: {
      situacionEducativa: tp.situacionEducativa?.nombre || "SIN ESTUDIOS",
      estudios: tp.estudios || [],
    },
    adicionales: {
      quintaCategoriaExonerada: tp.quintaCategoriaExonerada || false,
      evitaDobleImposicion: tp.evitaDobleImposicion || false,
    },
    categoria: tp.categoria,
  };
}

export function TRegistroPage() {
  const router = useRouter();
  const { token, companyId } = useAuth();
  const [generatingPdfId, setGeneratingPdfId] = useState<number | null>(null);

  // Fetch public companies to verify active company metadata
  const { data: companiesResponse } = useQuery<ApiResponse<EmpresaData[]>>({
    queryKey: ["public-companies", token],
    queryFn: async () => {
      const res = await Api.get("/t-empresa/public", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token && !!companyId,
  });

  const activeCompany: ActiveCompanyType | undefined =
    companiesResponse?.body?.find((c) => c.companyId === companyId) as
      | ActiveCompanyType
      | undefined;

  // Fetch partial worker list for current company
  const { data: tPersonasRaw, isLoading: isLoadingList } = useQuery<RawTPersona[]>({
    queryKey: ["t-personas-list", companyId, token],
    queryFn: async () => {
      const res = await Api.get<ApiResponse<RawTPersona[]>>(`/t-persona/company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.body || [];
    },
    enabled: !!companyId && !!token,
  });

  // Resolve full details (joins) for each worker dynamically
  const { data: tPersonasWithDetails, isLoading: isLoadingDetails } = useQuery<
    TPersonaRow[]
  >({
    queryKey: ["t-personas-details", tPersonasRaw, token],
    queryFn: async () => {
      if (!tPersonasRaw || tPersonasRaw.length === 0) return [];
      const details = await Promise.all(
        tPersonasRaw.map(async (tp: RawTPersona) => {
          try {
            const res = await Api.get<ApiResponse<TPersonaRow>>(`/t-persona/details/${tp.tPersonaId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return res.data.body;
          } catch (err) {
            console.error(
              `Error loading details for TPersona ${tp.tPersonaId}:`,
              err,
            );
            return {
              ...tp,
              categoria: "TRABAJADOR" as const,
              telefono: "",
              email: "",
              periodoInicio: "",
              fechaInicio: "",
              periodoFin: null,
              motivoBaja: null,
              tipoTrabajador: "EMPLEADO",
              fechaIngreso: "",
              regimenLaboral: "D_LEG_728",
              otroRegimenLaboral: null,
              ocupacionId: 0,
              tipoContrato: "PLAZO_INDETERMINADO",
              otroTipoContrato: null,
              tipoPago: "EFECTIVO",
              otroTipoPago: null,
              periodoIngreso: "MENSUAL",
              otroPeriodoIngreso: null,
              entidadId: 0,
              cuentaBancaria: null,
              montoRemuneracionInicial: 0,
              codlocal: "0000",
              local: null,
              jornadaLaboral: "MAXIMA",
              situacionEspecial: null,
              discapacidad: false,
              sindicalizado: false,
              regimenSalud: "ESSALUD_REGULAR",
              fechaInicioSalud: "",
              fechaFinSalud: null,
              regimenPensionario: "SIN_REGIMEN_PENSIONARIO",
              fechaInicioPensionario: "",
              fechaFinPensionario: null,
              CUSPP: null,
              sctr: false,
              pension: null,
              salud: null,
              fechaInicioSaludPension: null,
              fechaFinSaludPension: null,
              situacionEducativaId: 1,
              quintaCategoriaExonerada: false,
              evitaDobleImposicion: false,
              tEmpresaCompanyId: 0,
              createAt: "",
              userId: 0,
              persona: {
                personaId: tp.personaId,
                dni: "Desconocido",
                nombres: "Error de Carga",
                apellidoPaterno: "",
                apellidoMaterno: "",
                fechaNacimiento: "",
                sexo: "",
                estadoCivil: "",
                nacionalidad: "PERUANA",
                direcciones: [],
              },
              ocupacion: null,
              situacionEducativa: null,
              estudios: [],
            } as TPersonaRow;
          }
        }),
      );
      return details;
    },
    enabled: !!tPersonasRaw && tPersonasRaw.length > 0 && !!token,
  });

  const handleRegeneratePdf = async (row: TPersonaRow) => {
    if (!activeCompany) {
      toast.error("No se encontró la empresa activa para generar el documento");
      return;
    }
    try {
      setGeneratingPdfId(row.tPersonaId);
      const payload = mapTPersonaToPDFPayload(row, activeCompany);

      const res = await fetch("/api/pdf-tpersona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Constancia CIR regenerada correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el PDF de la constancia");
    } finally {
      setGeneratingPdfId(null);
    }
  };

  const columns: DashboardTableColumn<TPersonaRow>[] = [
    {
      header: "Documento",
      render: (tp) => (
        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-150">
          L.E / DNI - {tp.persona?.dni || "DNI Desconocido"}
        </span>
      ),
    },
    {
      header: "Nombre Completo",
      render: (tp) => {
        console.log({ tp });

        const name = tp.persona
          ? `${tp.persona.apellidoPaterno} ${tp.persona.apellidoMaterno}, ${tp.persona.nombres}`.toUpperCase()
          : "SINDATO";
        return (
          <span className="font-semibold text-bento-text dark:text-zinc-200">
            {name}
          </span>
        );
      },
    },
    {
      header: "Categoría",
      render: (tp) => (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300">
          {getCategoryLabel(tp.categoria)}
        </span>
      ),
    },
    {
      header: "Ocupación",
      render: (tp) => (
        <span className="text-zinc-650 dark:text-zinc-300 text-xs">
          {tp.ocupacion?.name || "OCUPACION NO ESPECIFICADA"}
        </span>
      ),
    },
    {
      header: "Fecha de Ingreso",
      render: (tp) => {
        let dateStr = "-";
        if (tp.fechaInicio) {
          try {
            dateStr = new Date(tp.fechaInicio).toLocaleDateString("es-ES", {
              timeZone: "UTC",
            });
          } catch {
            dateStr = tp.fechaInicio.split("T")[0];
          }
        }
        return (
          <span className="text-zinc-500 dark:text-zinc-400 font-mono text-xs">
            {dateStr}
          </span>
        );
      },
    },
    {
      header: "Acciones",
      headerClassName: "px-6 py-3.5 text-right",
      cellClassName: "px-6 py-4 text-right",
      render: (tp) => {
        const isGenerating = generatingPdfId === tp.tPersonaId;
        return (
          <div className="flex justify-end items-center gap-3">
            <button
              onClick={() => handleRegeneratePdf(tp)}
              disabled={isGenerating || !activeCompany}
              title="Regenerar PDF (Imprimir CIR)"
              className={`p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-blue-500 hover:bg-blue-550/5 text-zinc-500 hover:text-blue-600 transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                isGenerating ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isGenerating ? (
                <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiFileText className="text-sm" />
              )}
              <span className="text-xs font-bold px-0.5">Imprimir CIR</span>
            </button>
            <button
              onClick={() =>
                router.push(`/t-registro/crear?edit=${tp.tPersonaId}`)
              }
              title="Editar"
              className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <FiEdit2 className="text-sm" />
              <span className="text-xs font-bold px-0.5">Editar</span>
            </button>
          </div>
        );
      },
    },
  ];

  const hasNoData = !tPersonasRaw || tPersonasRaw.length === 0;

  return (
    <DashboardLayout title="T-Registro" icon={<FiUsers className="text-sm" />}>
      <DashboardTableCard
        title="Trabajadores Registrados"
        description="Listado de personal activo e inscrito en el T-Registro para la empresa activa"
        action={
          <button
            onClick={() => router.push("/t-registro/crear")}
            className="flex items-center gap-2 px-3 py-1.5 bg-bento-secondary hover:bg-bento-secondary/95 text-zinc-950 text-xs font-bold rounded-bento-control shadow-sm transition-all duration-200 cursor-pointer border border-zinc-900/5"
          >
            <FiPlus className="text-sm shrink-0" />
            <span>Registrar Persona</span>
          </button>
        }
        columns={columns}
        data={tPersonasWithDetails || []}
        getRowKey={(persona) => persona.tPersonaId}
        emptyStateTitle="Sin trabajadores registrados"
        emptyStateDescription={
          isLoadingList || isLoadingDetails
            ? "Cargando listado..."
            : "No hay trabajadores registrados en esta empresa en este momento."
        }
      />
    </DashboardLayout>
  );
}
