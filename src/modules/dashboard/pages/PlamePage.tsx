"use client";

import React, { useState } from "react";
import {
  FiFileText,
  FiTrendingUp,
  FiCheckCircle,
  FiPlusSquare,
  FiArrowLeft,
} from "react-icons/fi";
import { DashboardLayout } from "../components/DashboardLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import { toast } from "sonner";
import { PlameDeclaracionTabs } from "../components/PlameDeclaracionTabs";
import type { ApiResponse, EmpresaData } from "@/interface/response.interface";
import type { PlameDeclaracion, PlameEmpresa } from "../types/plame.types";

export function PlamePage() {
  const { token, companyId } = useAuth();
  const queryClient = useQueryClient();
  const [activeDeclaracion, setActiveDeclaracion] =
    useState<PlameDeclaracion | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPeriodo, setNewPeriodo] = useState("");

  // Fetch public companies
  const { data: companiesResponse } = useQuery<ApiResponse<EmpresaData[]>>({
    queryKey: ["public-companies", token],
    queryFn: async () => {
      const res = await Api.get("/t-empresa/public", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as ApiResponse<EmpresaData[]>;
    },
    enabled: !!token && !!companyId,
  });

  const activeCompany = companiesResponse?.body?.find(
    (c) => c.companyId === companyId,
  ) as PlameEmpresa | undefined;

  // Fetch PLAME declarations list
  const { data: declarationsList, isLoading: isLoadingList } = useQuery<
    ApiResponse<PlameDeclaracion[]>
  >({
    queryKey: ["plame-declarations", companyId, token],
    queryFn: async () => {
      const res = await Api.get(`/plame/company/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data as ApiResponse<PlameDeclaracion[]>;
    },
    enabled: !!companyId && !!token,
  });

  // Find or Create mutation
  const findOrCreateMutation = useMutation({
    mutationFn: async (periodo: string) => {
      const res = await Api.post(
        "/plame/find-or-create",
        { companyId, periodo },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data as ApiResponse<PlameDeclaracion>;
    },
    onSuccess: (data) => {
      setActiveDeclaracion(data.body);
      setShowNewModal(false);
      setNewPeriodo("");
      queryClient.invalidateQueries({
        queryKey: ["plame-declarations", companyId],
      });
      toast.success("Declaración Jurada iniciada");
    },
    onError: () => {
      toast.error("Error al iniciar la declaración jurada");
    },
  });

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{2}\/\d{4}$/.test(newPeriodo)) {
      toast.error("El período debe tener formato MM/AAAA (ej. 06/2026)");
      return;
    }
    findOrCreateMutation.mutate(newPeriodo);
  };

  const handleOpenDeclaration = (decl: PlameDeclaracion) => {
    setActiveDeclaracion(decl);
  };

  const handleRefresh = async () => {
    if (!activeDeclaracion) return;
    try {
      const res = await Api.post(
        "/plame/find-or-create",
        {
          companyId: activeDeclaracion.companyId,
          periodo: activeDeclaracion.periodo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const response = res.data as ApiResponse<PlameDeclaracion>;
      setActiveDeclaracion(response.body);
      queryClient.invalidateQueries({
        queryKey: ["plame-declarations", companyId],
      });
    } catch (err) {
      console.error("Error refreshing declaration", err);
    }
  };

  if (activeDeclaracion && activeCompany) {
    return (
      <DashboardLayout
        title={`Declaración PLAME: ${activeDeclaracion.periodo}`}
        icon={<FiFileText className="text-sm" />}
      >
        <div className="mb-4">
          <button
            onClick={() => {
              setActiveDeclaracion(null);
              queryClient.invalidateQueries({
                queryKey: ["plame-declarations", companyId],
              });
            }}
            className="flex items-center gap-1 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <FiArrowLeft /> Regresar al Historial de PLAME
          </button>
        </div>
        <PlameDeclaracionTabs
          declaracion={activeDeclaracion}
          activeCompany={activeCompany}
          token={token || ""}
          onClose={() => {
            setActiveDeclaracion(null);
            queryClient.invalidateQueries({
              queryKey: ["plame-declarations", companyId],
            });
          }}
          onRefresh={handleRefresh}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="PLAME" icon={<FiFileText className="text-sm" />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bento Card 1: Active Period Banner */}
        <div className="md:col-span-2 bg-gradient-to-br from-violet-700 via-indigo-700 to-indigo-800 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-900 border border-violet-800/30 dark:border-zinc-800/50 rounded-bento-card p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-1/10 translate-y-1/10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-md w-fit">
              Planilla Mensual de Pagos
            </span>
            <h3 className="text-2xl font-black mt-3">Declaraciones SUNAT</h3>
            <p className="text-zinc-200 dark:text-zinc-400 text-xs mt-2 leading-relaxed max-w-xl">
              Genera y administra las declaraciones mensuales del PLAME para la
              empresa activa. Podrás sincronizar los prestadores del T-Registro
              de forma automática y registrar sus jornadas laborales, ingresos,
              descuentos e impuestos.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold bg-white/10 dark:bg-zinc-850 w-fit px-3 py-1 rounded-bento-control">
            <FiCheckCircle className="text-xs text-green-300" />
            <span>Listo para declarar</span>
          </div>
        </div>

        {/* Bento Card 2: Quick Action */}
        <div
          onClick={() => setShowNewModal(true)}
          className="bg-bento-secondary dark:bg-zinc-900 border border-zinc-900/5 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-full min-h-[180px] text-zinc-950 dark:text-zinc-50 group hover:opacity-95 transition-opacity cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900/60 dark:text-zinc-450">
              Declaraciones
            </span>
            <div className="w-8 h-8 rounded-bento-control bg-zinc-950 text-white flex items-center justify-center">
              <FiPlusSquare className="text-base" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-tight">
              Nueva Declaración
            </h4>
            <p className="text-[10px] text-zinc-800 dark:text-zinc-400 mt-1">
              Generar una nueva declaración jurada para el período mensual
            </p>
          </div>
        </div>
      </div>

      {/* Declarations List Table */}
      <div className="mt-6 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base">
              Declaraciones Juradas Recientes
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Historial de declaraciones mensuales de pagos de tributos
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            <FiTrendingUp className="text-bento-secondary" /> Historial de PLAME
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                <th className="px-6 py-3.5">Período</th>
                <th className="px-6 py-3.5">Nº de Orden</th>
                <th className="px-6 py-3.5">Total Neto a Pagar</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
              {isLoadingList ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-zinc-400 dark:text-zinc-500 font-medium"
                  >
                    Cargando declaraciones…
                  </td>
                </tr>
              ) : declarationsList?.body?.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-zinc-400 dark:text-zinc-500 font-medium"
                  >
                    No se han registrado declaraciones para esta empresa.
                    Presiona &quot;Nueva Declaración&quot; para comenzar.
                  </td>
                </tr>
              ) : (
                declarationsList?.body?.map((decl) => (
                  <tr
                    key={decl.plameDeclaracionId}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">
                      {decl.periodo}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">
                      {decl.numeroOrden ?? "No asignado"}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-950 dark:text-zinc-100">
                      S/. {Number(decl.totalNetoAPagar || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-bold rounded-md ${
                          decl.estado === "Presentado"
                            ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30"
                            : "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30"
                        }`}
                      >
                        {decl.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDeclaration(decl)}
                        className="px-3 py-1 bg-zinc-900 dark:bg-zinc-800 hover:opacity-90 text-white rounded text-xs font-bold transition-all"
                      >
                        Abrir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW DECLARATION DIALOG MODAL */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 rounded-bento-card p-6 w-full max-w-sm shadow-xl">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 border-b pb-2 mb-4">
              Nueva Declaración PLAME
            </h4>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div className="flex flex-col">
                <label className="text-[12px] font-semibold text-zinc-500 mb-1.5">
                  Período Tributario (MM/AAAA)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 06/2026"
                  value={newPeriodo}
                  onChange={(e) => setNewPeriodo(e.target.value)}
                  className="w-full text-sm p-2.5 border rounded focus:ring-1 focus:ring-bento-secondary"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 border rounded text-xs font-semibold hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={findOrCreateMutation.isPending}
                  className="px-3 py-1.5 bg-bento-secondary text-zinc-950 font-bold rounded text-xs hover:opacity-90 transition-all"
                >
                  Iniciar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
