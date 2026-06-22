import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FiCheckCircle,
  FiSave,
  FiRefreshCw,
  FiEdit2,
  FiInfo,
  FiTrash2,
  FiPlus,
  FiFileText,
} from "react-icons/fi";
import { Api } from "@/lib/api";
import { FormInput } from "@/components/forms/FormInput";
import { DeudaPanel } from "./DeudaPanel";
import type {
  PlameConceptAportacionTrabajador,
  PlameConceptIngreso,
  PlameConceptDescuento,
  PlameConceptTributo,
  PlameDetalle,
  PlameDeclaracion,
  PlameEmpresa,
} from "../types/plame.types";

interface PlameDeclaracionTabsProps {
  declaracion: PlameDeclaracion;
  activeCompany: PlameEmpresa;
  token: string;
  onClose: () => void;
  onRefresh: () => void;
}

export function PlameDeclaracionTabs({
  declaracion,
  activeCompany,
  token,
  onClose,
  onRefresh,
}: PlameDeclaracionTabsProps) {
  const [activeMainTab, setActiveMainTab] = useState<
    "general" | "detalle" | "deuda"
  >("general");
  const [selectedDetalle, setSelectedDetalle] = useState<PlameDetalle | null>(
    null,
  );
  const [activeSubTab, setActiveSubTab] = useState<
    "datos" | "jornada" | "ingresos" | "descuentos" | "tributos"
  >("jornada");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSavingDetalle, setIsSavingDetalle] = useState(false);
  const [isProcessingGlobal, setIsProcessingGlobal] = useState(false);

  // Form states
  const {
    register: registerGeneral,
    handleSubmit: handleGeneralSubmit,
    setValue: setGeneralValue,
  } = useForm({
    defaultValues: {
      sustitutoria: declaracion.sustitutoria ? "true" : "false",
      numeroOrden: declaracion.numeroOrden || "",
    },
  });

  const {
    register: registerDetalle,
    handleSubmit: handleDetalleSubmit,
    setValue: setDetalleValue,
    watch: watchDetalle,
  } = useForm({
    defaultValues: {
      diasLaborados: 30,
      diasSubsidiados: 0,
      diasNoLaborados: 0,
      horasOrdinarias: "240:00",
      horasSobretiempo: "00:00",
    },
  });

  // Dynamic values for income/deductions/taxes
  const [ingresos, setIngresos] = useState<PlameConceptIngreso[]>([]);
  const [descuentos, setDescuentos] = useState<PlameConceptDescuento[]>([]);
  const [tributos, setTributos] = useState<PlameConceptTributo[]>([]);
  const [aportacionesTrabajador, setAportacionesTrabajador] = useState<
    PlameConceptAportacionTrabajador[]
  >([]);

  // Subsidized details modal
  const [showSubsidioModal, setShowSubsidioModal] = useState(false);
  const [subsidioType, setSubsidioType] = useState("09");
  const [subsidioDays, setSubsidioDays] = useState(0);

  // Initialize values when selected worker changes
  useEffect(() => {
    if (selectedDetalle) {
      setDetalleValue("diasLaborados", selectedDetalle.diasLaborados);
      setDetalleValue("diasSubsidiados", selectedDetalle.diasSubsidiados);
      setDetalleValue("diasNoLaborados", selectedDetalle.diasNoLaborados);
      setDetalleValue("horasOrdinarias", selectedDetalle.horasOrdinarias);
      setDetalleValue("horasSobretiempo", selectedDetalle.horasSobretiempo);

      // ── INGRESOS MERGE ──
      const dbIngresos = selectedDetalle.ingresos || [];
      const defaultIngresos = [
        {
          code: "0105",
          name: "TRABAJO SOBRETIEMPO (H. EXTRAS 25%)",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0106",
          name: "TRABAJO SOBRETIEMPO (H. EXTRAS 35%)",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0107",
          name: "TRABAJO EN FERIADO O DÍA DESCANSO",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0118",
          name: "REMUNERACIÓN VACACIONAL",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0121",
          name: "REMUNERACIÓN O JORNAL BÁSICO",
          devengado: selectedDetalle.tPersona.montoRemuneracionInicial || 0,
          pagado: selectedDetalle.tPersona.montoRemuneracionInicial || 0,
        },
        {
          code: "0122",
          name: "REMUNERACIÓN PERMANENTE",
          devengado: 0,
          pagado: 0,
        },
        { code: "0201", name: "ASIGNACIÓN FAMILIAR", devengado: 0, pagado: 0 },
        {
          code: "0306",
          name: "BONIFICACIONES REGULARES",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0311",
          name: "BONIFICACION UNIFICADA DE CONSTRUCC",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0406",
          name: "GRATIF. F.PATRIAS NAVIDAD LEY 29351 Y 30334",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0407",
          name: "GRATIFIC. PROPORCIONAL - LEY 29351 Y 30334",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0504",
          name: "INDEMNIZACIÓN VACACIONES NO GOZADAS",
          devengado: 0,
          pagado: 0,
        },
        {
          code: "0904",
          name: "COMPENSACIÓN TIEMPO DE SERVICIOS",
          devengado: 0,
          pagado: 0,
        },
      ];
      const mergedIngresos = defaultIngresos.map(
        (def) => dbIngresos.find((i) => i.code === def.code) || def,
      );
      dbIngresos.forEach((dbI) => {
        if (!mergedIngresos.some((m) => m.code === dbI.code))
          mergedIngresos.push(dbI);
      });
      setIngresos(mergedIngresos);

      // ── DESCUENTOS MERGE ──
      const dbDescuentos = selectedDetalle.descuentos || [];
      const defaultDescuentos = [
        { code: "0701", name: "ADELANTO", monto: 0 },
        { code: "0702", name: "CUOTA SINDICAL", monto: 0 },
        { code: "0703", name: "DESCUENTO POR TARDANZAS", monto: 0 },
        { code: "0704", name: "DESCUENTO POR INASISTENCIAS", monto: 0 },
        { code: "0706", name: "OTROS DESC NO DEDUC DE BASE IMPONIB", monto: 0 },
      ];
      const mergedDescuentos = defaultDescuentos.map(
        (def) => dbDescuentos.find((d) => d.code === def.code) || def,
      );
      dbDescuentos.forEach((dbD) => {
        if (!mergedDescuentos.some((m) => m.code === dbD.code))
          mergedDescuentos.push(dbD);
      });
      setDescuentos(mergedDescuentos);

      // ── APORTACIONES TRABAJADOR MERGE ──
      const dbTributos = selectedDetalle.tributos || [];
      const dbAportacionesTrab = dbTributos.filter((t) =>
        t.code.startsWith("06"),
      );
      const sumDevengado = mergedIngresos.reduce((s, i) => s + i.devengado, 0);
      const defaultAportacionesTrab = [
        { code: "0602", name: "CONAFOVICER", base: 0, monto: 0 },
        {
          code: "0605",
          name: "RENTA QUINTA CATEGORÍA RETENCIONES",
          base: sumDevengado,
          monto: 0,
        },
        {
          code: "0607",
          name: "SISTEMA NAC. DE PENSIONES DL 19990",
          base: sumDevengado,
          monto: 0,
        },
        {
          code: "0611",
          name: "OTROS APORTACIONES TRAB./PENSIONIS.",
          base: 0,
          monto: 0,
        },
      ];
      const mergedAportacionesTrab = defaultAportacionesTrab.map((def) => {
        const found = dbAportacionesTrab.find((a) => a.code === def.code);
        return found
          ? {
              code: found.code,
              name: found.name,
              base: found.base,
              monto: found.monto,
            }
          : def;
      });
      dbAportacionesTrab.forEach((dbA) => {
        if (!mergedAportacionesTrab.some((m) => m.code === dbA.code)) {
          mergedAportacionesTrab.push({
            code: dbA.code,
            name: dbA.name,
            base: dbA.base,
            monto: dbA.monto,
          });
        }
      });
      setAportacionesTrabajador(mergedAportacionesTrab);

      setTributos(dbTributos);
    }
  }, [selectedDetalle, setDetalleValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSaveGeneral = async (data: {
    sustitutoria: string;
    numeroOrden: string;
  }) => {
    setIsProcessingGlobal(true);
    try {
      await Api.patch(
        `/plame/${declaracion.plameDeclaracionId}`,
        {
          sustitutoria: data.sustitutoria === "true",
          numeroOrden: data.numeroOrden || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Información general guardada correctamente");
      onRefresh();
    } catch (err) {
      toast.error("Error al guardar la información general");
    } finally {
      setIsProcessingGlobal(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsProcessingGlobal(true);
      setIsSyncing(true);
      await Api.post(
        "/plame/sync",
        {
          companyId: activeCompany.companyId,
          periodo: declaracion.periodo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Sincronización con T-Registro finalizada");
      onRefresh();
    } catch (err) {
      toast.error("Error al sincronizar con T-Registro");
    } finally {
      setIsSyncing(false);
      setIsProcessingGlobal(false);
    }
  };

  const onSaveWorkerDetalle = async (formData: any) => {
    if (!selectedDetalle) return;

    try {
      setIsProcessingGlobal(true);
      setIsSavingDetalle(true);

      const payload = {
        diasLaborados: Number(formData.diasLaborados),
        diasSubsidiados: Number(formData.diasSubsidiados),
        diasNoLaborados: Number(formData.diasNoLaborados),
        horasOrdinarias: formData.horasOrdinarias,
        horasSobretiempo: formData.horasSobretiempo,
        ingresos,
        descuentos,
      };

      await Api.patch(`/plame/detalle/${selectedDetalle.detalleId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Cambios del trabajador registrados");
      setSelectedDetalle(null);
      onRefresh();
    } catch (err) {
      toast.error("Error al registrar cambios");
    } finally {
      setIsSavingDetalle(false);
      setIsProcessingGlobal(false);
    }
  };

  const handleIngresoChange = (
    code: string,
    field: "devengado" | "pagado",
    value: string,
  ) => {
    const numericValue = Number(value) || 0;
    setIngresos((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, [field]: numericValue } : item,
      ),
    );
  };

  const handleDescuentoChange = (code: string, value: string) => {
    const numericValue = Number(value) || 0;
    setDescuentos((prev) =>
      prev.map((item) =>
        item.code === code ? { ...item, monto: numericValue } : item,
      ),
    );
  };

  // Sub-totals calculations
  const totalIngresosDevengado = ingresos.reduce(
    (sum, item) => sum + item.devengado,
    0,
  );
  const totalIngresosPagado = ingresos.reduce(
    (sum, item) => sum + item.pagado,
    0,
  );
  const totalDescuentos = descuentos.reduce((sum, item) => sum + item.monto, 0);

  // Recalculated tax base
  const essaludBase =
    totalIngresosDevengado < 1130 ? 1130 : totalIngresosDevengado;
  const essaludMonto = Number((essaludBase * 0.09).toFixed(2));

  const finalTributos = [
    { code: "0801", name: "SPP - APORTACIÓN VOLUNTARIA", base: 0, monto: 0 },
    { code: "0803", name: "PÓLIZA DE SEGURO - D. LEG. 688", base: 0, monto: 0 },
    {
      code: "0804",
      name: "ESSALUD(REGULAR CBSSP AGRAR/AC)TRAB",
      base: essaludBase,
      monto: essaludMonto,
    },
    {
      code: "0809",
      name: "OTRAS APORTACIONES CARGO EMPLEADOR",
      base: 0,
      monto: 0,
    },
  ];

  const handleSaveDeuda = async (deudaData: any) => {
    setIsProcessingGlobal(true);
    try {
      await Api.patch(`/plame/${declaracion.plameDeclaracionId}`, deudaData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Determinación de la deuda guardada correctamente");
      onRefresh();
    } catch (err) {
      toast.error("Error al guardar la deuda");
    } finally {
      setIsProcessingGlobal(false);
    }
  };

  const handleFinalizeDeclaration = async (deudaData?: any) => {
    setIsProcessingGlobal(true);
    try {
      const payload = deudaData
        ? { estado: "Presentado", ...deudaData }
        : { estado: "Presentado" };
      await Api.patch(`/plame/${declaracion.plameDeclaracionId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Declaración Jurada finalizada y presentada");
      onClose();
    } catch (err) {
      toast.error("Error al finalizar la declaración");
    } finally {
      setIsProcessingGlobal(false);
    }
  };

  const handleDownloadBoleta = async (det: PlameDetalle) => {
    const loadingToast = toast.loading(
      `Generando boleta R08 para ${det.tPersona.persona.nombres}...`,
    );
    try {
      const dbTributos = det.tributos || [];
      const aportacionesTrabajador = dbTributos.filter((t) =>
        t.code.startsWith("06"),
      );

      const payload = {
        periodo: declaracion.periodo,
        sustitutoria: declaracion.sustitutoria,
        numeroOrden: declaracion.numeroOrden,
        empresa: {
          ruc: activeCompany.ruc,
          name: activeCompany.name,
        },
        trabajador: {
          dni: det.tPersona.persona.dni,
          nombres: det.tPersona.persona.nombres,
          apellidoPaterno: det.tPersona.persona.apellidoPaterno,
          apellidoMaterno: det.tPersona.persona.apellidoMaterno,
          categoria: det.tPersona.categoria,
          ocupacion: det.tPersona.ocupacion?.name || "No Especificado",
          remuneracionBase: det.tPersona.montoRemuneracionInicial,
        },
        jornada: {
          diasLaborados: det.diasLaborados,
          diasSubsidiados: det.diasSubsidiados,
          diasNoLaborados: det.diasNoLaborados,
          horasOrdinarias: det.horasOrdinarias,
          horasSobretiempo: det.horasSobretiempo,
        },
        ingresos: det.ingresos,
        descuentos: det.descuentos,
        tributos: det.tributos,
        aportacionesTrabajador,
      };

      const response = await fetch("/api/pdf-plame-persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error en PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Boleta R08 generada", {
        id: loadingToast,
      });
    } catch (error) {
      console.error(error);
      toast.error("No se pudo generar el PDF", {
        id: loadingToast,
      });
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card overflow-hidden shadow-sm flex flex-col min-h-[500px] relative">
      {/* Tab Selectors */}
      <div className="flex bg-zinc-150/40 dark:bg-zinc-950/40 border-b border-zinc-200/40 dark:border-zinc-850">
        <button
          onClick={() => setActiveMainTab("general")}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-all ${
            activeMainTab === "general"
              ? "bg-white dark:bg-zinc-900 border-t-2 border-bento-secondary text-bento-text dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Información General
        </button>
        <button
          onClick={() => setActiveMainTab("detalle")}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-all ${
            activeMainTab === "detalle"
              ? "bg-white dark:bg-zinc-900 border-t-2 border-bento-secondary text-bento-text dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Detalle de Declaración
        </button>
        <button
          onClick={() => setActiveMainTab("deuda")}
          className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider text-center transition-all ${
            activeMainTab === "deuda"
              ? "bg-white dark:bg-zinc-900 border-t-2 border-bento-secondary text-bento-text dark:text-zinc-50"
              : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          }`}
        >
          Determinación de la Deuda
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* PANEL 1: INFORMACION GENERAL */}
        {activeMainTab === "general" && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200/50 pb-2">
              Datos básicos de la declaración
            </h3>

            <form
              onSubmit={handleGeneralSubmit(onSaveGeneral)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="RUC"
                  name="ruc"
                  defaultValue={activeCompany.ruc}
                  readOnly
                  disabled
                />
                <FormInput
                  label="Nombre / Razón Social"
                  name="name"
                  defaultValue={activeCompany.name}
                  readOnly
                  disabled
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Periodo Tributario"
                  name="periodo"
                  defaultValue={declaracion.periodo}
                  readOnly
                  disabled
                />
                <div className="flex flex-col">
                  <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2">
                    ¿Es declaración sustitutoria o rectificatoria?
                  </label>
                  <div className="flex gap-4 items-center h-11">
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        value="true"
                        {...registerGeneral("sustitutoria")}
                        className="text-bento-secondary"
                      />{" "}
                      Sí
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                      <input
                        type="radio"
                        value="false"
                        {...registerGeneral("sustitutoria")}
                        className="text-bento-secondary"
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-bento-secondary hover:bg-bento-secondary/95 text-zinc-950 font-bold rounded-bento-control shadow-sm transition-all text-xs"
                >
                  <FiSave className="text-sm" /> Guardar Cabecera
                </button>
              </div>
            </form>

            <div className="mt-8 border-t border-zinc-200/50 pt-6">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 pb-2 flex items-center gap-2">
                Obtención de datos del T-REGISTRO
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Para obtener o actualizar prestadores del T-REGISTRO en su
                declaración, presione ejecutar sincronización.
              </p>

              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-950 dark:bg-zinc-800 text-white hover:opacity-90 rounded-bento-control shadow-sm text-xs transition-all"
                >
                  {isSyncing ? (
                    <FiRefreshCw className="text-sm animate-spin" />
                  ) : (
                    <FiRefreshCw className="text-sm" />
                  )}
                  Sincronizar Trabajadores con Clave SOL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: DETALLE DE DECLARACION */}
        {activeMainTab === "detalle" && (
          <div className="space-y-6">
            {/* WORKERS LIST TABLE (If no worker selected for edit) */}
            {!selectedDetalle ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                    Trabajadores Registrados en Declaración (
                    {declaracion.detalles.length})
                  </h4>
                  <button
                    onClick={handleSync}
                    className="flex items-center gap-1 text-xs font-bold text-bento-secondary hover:underline"
                  >
                    <FiRefreshCw className="text-xs" /> Recargar de T-Registro
                  </button>
                </div>

                <div className="border border-zinc-200/50 dark:border-zinc-850 rounded-bento-card overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 font-semibold text-zinc-500 uppercase border-b border-zinc-200/30">
                        <th className="px-4 py-3">Doc / DNI</th>
                        <th className="px-4 py-3">Apellidos y Nombres</th>
                        <th className="px-4 py-3 text-center">Días Lab.</th>
                        <th className="px-4 py-3 text-right">Ingresos</th>
                        <th className="px-4 py-3 text-right">
                          Aporte Empleador
                        </th>
                        <th className="px-4 py-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-150/50 text-sm">
                      {declaracion.detalles.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-8 text-zinc-400 dark:text-zinc-500 font-medium"
                          >
                            No hay prestadores sincronizados. Ve a "Información
                            General" para sincronizar.
                          </td>
                        </tr>
                      ) : (
                        declaracion.detalles.map((det) => {
                          const totDevengado = det.ingresos.reduce(
                            (sum, item) => sum + item.devengado,
                            0,
                          );
                          const essaludCont =
                            det.tributos.find((t) => t.code === "0804")
                              ?.monto || 0;

                          return (
                            <tr
                              key={det.detalleId}
                              className="hover:bg-zinc-50/50 transition-colors"
                            >
                              <td className="px-4 py-3 font-mono font-bold">
                                01-{det.tPersona.persona.dni}
                              </td>
                              <td className="px-4 py-3 font-medium uppercase">
                                {det.tPersona.persona.apellidoPaterno}{" "}
                                {det.tPersona.persona.apellidoMaterno},{" "}
                                {det.tPersona.persona.nombres}
                              </td>
                              <td className="px-4 py-3 text-center">
                                {det.diasLaborados}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                S/. {totDevengado.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right text-zinc-650 dark:text-zinc-350">
                                S/. {essaludCont.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setSelectedDetalle(det)}
                                    title="Editar detalle del trabajador"
                                    className="p-1 border border-zinc-200 dark:border-zinc-800 rounded hover:border-bento-secondary text-zinc-500 hover:text-bento-secondary transition-all"
                                  >
                                    <FiEdit2 className="text-xs" />
                                  </button>
                                  <button
                                    onClick={() => handleDownloadBoleta(det)}
                                    title="Descargar Boleta R08"
                                    className="p-1 border border-zinc-200 dark:border-zinc-800 rounded hover:border-indigo-600 text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
                                  >
                                    <FiFileText className="text-xs" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* DETAILED WORKER DECLARATION EDIT PANEL */
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-5 bg-zinc-50/10 dark:bg-zinc-850/5">
                <div className="flex justify-between items-center border-b border-zinc-200/50 pb-3 mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      Editando Declaración de
                    </span>
                    <h4 className="text-base font-black text-bento-text dark:text-zinc-50 uppercase mt-0.5">
                      {selectedDetalle.tPersona.persona.apellidoPaterno}{" "}
                      {selectedDetalle.tPersona.persona.apellidoMaterno},{" "}
                      {selectedDetalle.tPersona.persona.nombres}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedDetalle(null)}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-800"
                    >
                      cerrar detalle
                    </button>
                  </div>
                </div>

                {/* Sub-tabs for worker details */}
                <div className="flex gap-2 border-b border-zinc-200/50 mb-6 pb-2 overflow-x-auto">
                  <button
                    onClick={() => setActiveSubTab("jornada")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-bento-control ${
                      activeSubTab === "jornada"
                        ? "bg-bento-secondary text-zinc-950"
                        : "text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    Jornada Laboral
                  </button>
                  <button
                    onClick={() => setActiveSubTab("ingresos")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-bento-control ${
                      activeSubTab === "ingresos"
                        ? "bg-bento-secondary text-zinc-950"
                        : "text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    Ingresos
                  </button>
                  <button
                    onClick={() => setActiveSubTab("descuentos")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-bento-control ${
                      activeSubTab === "descuentos"
                        ? "bg-bento-secondary text-zinc-950"
                        : "text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    Descuentos
                  </button>
                  <button
                    onClick={() => setActiveSubTab("tributos")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-bento-control ${
                      activeSubTab === "tributos"
                        ? "bg-bento-secondary text-zinc-950"
                        : "text-zinc-500 hover:bg-zinc-100"
                    }`}
                  >
                    Tributos y Aportes
                  </button>
                </div>

                <form
                  onSubmit={handleDetalleSubmit(onSaveWorkerDetalle)}
                  className="space-y-6"
                >
                  {/* WORKER JORNADA TAB */}
                  {activeSubTab === "jornada" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b pb-1">
                          Días de la Jornada
                        </h5>
                        <div className="grid grid-cols-3 gap-4 items-end">
                          <FormInput
                            label="Laborados"
                            type="number"
                            {...registerDetalle("diasLaborados")}
                          />
                          <div className="relative">
                            <FormInput
                              label="Subsidiados"
                              type="number"
                              {...registerDetalle("diasSubsidiados")}
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={() => setShowSubsidioModal(true)}
                              className="absolute right-2 top-8 text-bento-secondary font-bold text-[10px]"
                            >
                              Editar
                            </button>
                          </div>
                          <FormInput
                            label="No Laborados"
                            type="number"
                            {...registerDetalle("diasNoLaborados")}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b pb-1">
                          Horas Laboradas
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <FormInput
                            label="Ordinarias (HHH:MM)"
                            placeholder="240:00"
                            {...registerDetalle("horasOrdinarias")}
                          />
                          <FormInput
                            label="Sobretiempo (HHH:MM)"
                            placeholder="00:00"
                            {...registerDetalle("horasSobretiempo")}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* WORKER INGRESOS TAB */}
                  {activeSubTab === "ingresos" && (
                    <div className="space-y-4">
                      <div className="border border-zinc-200/50 rounded-bento-card overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-zinc-150/50 font-semibold text-zinc-500 uppercase border-b border-zinc-200/30">
                              <th className="px-4 py-2.5">Código</th>
                              <th className="px-4 py-2.5">Concepto</th>
                              <th className="px-4 py-2.5 text-right w-32">
                                Devengado (S/.)
                              </th>
                              <th className="px-4 py-2.5 text-right w-32">
                                Pagado (S/.)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-150/50 text-sm">
                            {ingresos.map((ing) => (
                              <tr
                                key={ing.code}
                                className="hover:bg-zinc-50/50"
                              >
                                <td className="px-4 py-2.5 font-mono text-zinc-500">
                                  {ing.code}
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-zinc-800 uppercase">
                                  {ing.name}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <input
                                    type="number"
                                    value={ing.devengado || ""}
                                    onChange={(e) =>
                                      handleIngresoChange(
                                        ing.code,
                                        "devengado",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full text-right p-1.5 border rounded focus:ring-1 focus:ring-bento-secondary"
                                    placeholder="0.00"
                                  />
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <input
                                    type="number"
                                    value={ing.pagado || ""}
                                    onChange={(e) =>
                                      handleIngresoChange(
                                        ing.code,
                                        "pagado",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full text-right p-1.5 border rounded focus:ring-1 focus:ring-bento-secondary"
                                    placeholder="0.00"
                                  />
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-zinc-50 font-bold border-t-2 border-zinc-200">
                              <td colSpan={2} className="px-4 py-3 text-right">
                                TOTAL INGRESOS:
                              </td>
                              <td className="px-4 py-3 text-right text-bento-text">
                                S/. {totalIngresosDevengado.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 text-right text-bento-text">
                                S/. {totalIngresosPagado.toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* WORKER DESCUENTOS TAB */}
                  {activeSubTab === "descuentos" && (
                    <div className="space-y-4">
                      <div className="border border-zinc-200/50 rounded-bento-card overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-zinc-150/50 font-semibold text-zinc-500 uppercase border-b border-zinc-200/30">
                              <th className="px-4 py-2.5">Código</th>
                              <th className="px-4 py-2.5">Concepto</th>
                              <th className="px-4 py-2.5 text-right w-48">
                                Monto (S/.)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-150/50 text-sm">
                            {descuentos.map((desc) => (
                              <tr
                                key={desc.code}
                                className="hover:bg-zinc-50/50"
                              >
                                <td className="px-4 py-2.5 font-mono text-zinc-500">
                                  {desc.code}
                                </td>
                                <td className="px-4 py-2.5 font-semibold text-zinc-800 uppercase">
                                  {desc.name}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  <input
                                    type="number"
                                    value={desc.monto || ""}
                                    onChange={(e) =>
                                      handleDescuentoChange(
                                        desc.code,
                                        e.target.value,
                                      )
                                    }
                                    className="w-full text-right p-1.5 border rounded focus:ring-1 focus:ring-bento-secondary"
                                    placeholder="0.00"
                                  />
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-zinc-50 font-bold border-t-2 border-zinc-200">
                              <td colSpan={2} className="px-4 py-3 text-right">
                                TOTAL DESCUENTOS:
                              </td>
                              <td className="px-4 py-3 text-right text-bento-text">
                                S/. {totalDescuentos.toFixed(2)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* WORKER TRIBUTOS Y APORTES TAB */}
                  {activeSubTab === "tributos" && (
                    <div className="space-y-6">
                      {/* ── Aportaciones del Trabajador ── */}
                      <div>
                        <h6 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                          Aportaciones del Trabajador
                        </h6>
                        <div className="border border-zinc-200/50 rounded-bento-card overflow-hidden">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-zinc-150/50 font-semibold text-zinc-500 uppercase border-b border-zinc-200/30">
                                <th className="px-4 py-2.5">Código</th>
                                <th className="px-4 py-2.5">Concepto</th>
                                <th className="px-4 py-2.5 text-right w-40">
                                  Base de Cálculo (S/.)
                                </th>
                                <th className="px-4 py-2.5 text-right w-40">
                                  Monto (S/.)
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-150/50 text-sm">
                              {aportacionesTrabajador.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="px-4 py-4 text-center text-zinc-400"
                                  >
                                    Cargue los conceptos por defecto desde la
                                    pestaña de Ingresos
                                  </td>
                                </tr>
                              ) : (
                                aportacionesTrabajador.map((ap) => (
                                  <tr
                                    key={ap.code}
                                    className="hover:bg-zinc-50/50"
                                  >
                                    <td className="px-4 py-2.5 font-mono text-zinc-500">
                                      {ap.code}
                                    </td>
                                    <td className="px-4 py-2.5 font-semibold text-zinc-800 uppercase">
                                      {ap.name}
                                    </td>
                                    <td className="px-4 py-2.5 text-right font-mono text-zinc-500">
                                      {ap.base > 0
                                        ? `S/. ${ap.base.toFixed(2)}`
                                        : "-"}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                      <input
                                        type="number"
                                        value={ap.monto || ""}
                                        onChange={(e) =>
                                          setAportacionesTrabajador((prev) =>
                                            prev.map((item) =>
                                              item.code === ap.code
                                                ? {
                                                    ...item,
                                                    monto:
                                                      Number(e.target.value) ||
                                                      0,
                                                  }
                                                : item,
                                            ),
                                          )
                                        }
                                        className="w-full text-right p-1.5 border rounded focus:ring-1 focus:ring-bento-secondary"
                                        placeholder="0.00"
                                      />
                                    </td>
                                  </tr>
                                ))
                              )}
                              <tr className="bg-zinc-50 font-bold border-t-2 border-zinc-200">
                                <td
                                  colSpan={3}
                                  className="px-4 py-3 text-right"
                                >
                                  TOTAL APORTES DEL TRABAJADOR:
                                </td>
                                <td className="px-4 py-3 text-right text-bento-text">
                                  S/.{" "}
                                  {aportacionesTrabajador
                                    .reduce((s, a) => s + a.monto, 0)
                                    .toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* ── Aportaciones del Empleador ── */}
                      <div>
                        <h6 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                          Aportaciones del Empleador
                        </h6>
                        <div className="border border-zinc-200/50 rounded-bento-card overflow-hidden">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-zinc-150/50 font-semibold text-zinc-500 uppercase border-b border-zinc-200/30">
                                <th className="px-4 py-2.5">Código</th>
                                <th className="px-4 py-2.5">Concepto</th>
                                <th className="px-4 py-2.5 text-right w-40">
                                  Base de Cálculo (S/.)
                                </th>
                                <th className="px-4 py-2.5 text-right w-40">
                                  Monto (S/.)
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-150/50 text-sm">
                              {finalTributos.map((trib) => (
                                <tr
                                  key={trib.code}
                                  className="hover:bg-zinc-50/50"
                                >
                                  <td className="px-4 py-2.5 font-mono text-zinc-500">
                                    {trib.code}
                                  </td>
                                  <td className="px-4 py-2.5 font-semibold text-zinc-800 uppercase">
                                    {trib.name}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-mono text-zinc-500">
                                    {trib.base > 0
                                      ? `S/. ${trib.base.toFixed(2)}`
                                      : "-"}
                                  </td>
                                  <td className="px-4 py-2.5 text-right font-bold text-zinc-800">
                                    {trib.monto > 0
                                      ? `S/. ${trib.monto.toFixed(2)}`
                                      : "-"}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-zinc-50 font-bold border-t-2 border-zinc-200">
                                <td
                                  colSpan={3}
                                  className="px-4 py-3 text-right"
                                >
                                  TOTAL APORTES DEL EMPLEADOR:
                                </td>
                                <td className="px-4 py-3 text-right text-bento-text">
                                  S/. {essaludMonto.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => setSelectedDetalle(null)}
                      className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:bg-zinc-100 text-xs font-semibold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingDetalle}
                      className="flex items-center gap-2 px-4 py-2 bg-bento-secondary hover:bg-bento-secondary/95 text-zinc-950 font-bold rounded-bento-control shadow-sm transition-all text-xs"
                    >
                      <FiSave className="text-sm" /> Grabar Cambios
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* PANEL 3: DETERMINACION DE LA DEUDA */}
        {activeMainTab === "deuda" && (
          <DeudaPanel
            declaracion={declaracion}
            companyRuc={activeCompany.ruc}
            companyName={activeCompany.name}
            onClose={onClose}
            onSaveDeuda={handleSaveDeuda}
            onFinalize={handleFinalizeDeclaration}
          />
        )}
      </div>

      {/* SUBSIDIZED DAYS EDIT MODAL */}
      {showSubsidioModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 rounded-bento-card p-6 w-full max-w-md shadow-xl">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b pb-2 mb-4">
              Registrar Días Subsidiados
            </h4>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold text-zinc-500 mb-1.5">
                  Tipo de suspensión de la relación laboral
                </label>
                <select
                  value={subsidioType}
                  onChange={(e) => setSubsidioType(e.target.value)}
                  className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-bento-secondary bg-white dark:bg-zinc-800"
                >
                  <option value="09">
                    09 - S.P. MATERNIDAD - PRE Y POST NATAL
                  </option>
                  <option value="21">
                    21 - S.I. INCAP TEMPORAL (SUBSIDIADO)
                  </option>
                  <option value="22">
                    22 - S.I. MATERNIDAD - PRE Y POST NATAL
                  </option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[12px] font-semibold text-zinc-500 mb-1.5">
                  Cantidad de días
                </label>
                <input
                  type="number"
                  value={subsidioDays}
                  onChange={(e) => setSubsidioDays(Number(e.target.value) || 0)}
                  className="w-full text-xs p-2 border rounded focus:ring-1 focus:ring-bento-secondary"
                  min={0}
                  max={31}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowSubsidioModal(false)}
                className="px-3 py-1.5 border rounded text-xs font-semibold hover:bg-zinc-50"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setDetalleValue("diasSubsidiados", subsidioDays);
                  setShowSubsidioModal(false);
                }}
                className="px-3 py-1.5 bg-bento-secondary text-zinc-950 font-bold rounded text-xs hover:opacity-90"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {isProcessingGlobal && (
        <div className="absolute inset-0 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-xl">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-sm font-bold text-indigo-700 dark:text-indigo-400 animate-pulse">
            Procesando...
          </span>
        </div>
      )}
    </div>
  );
}
