"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { empresaSchema, type EmpresaFormType } from "../schemas/empresa.schema";
import { FormInput } from "@/components/forms/FormInput";
import type { ApiResponse, EmpresaData, ConceptoData } from "@/interface/response.interface";
import { FiX, FiPlusCircle, FiEdit2 } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";

interface AdminEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmpresaFormType) => void;
  empresaToEdit?: EmpresaData;
  isLoading?: boolean;
}

export function AdminEmpresaModal({
  isOpen,
  onClose,
  onSubmit,
  empresaToEdit,
  isLoading = false,
}: AdminEmpresaModalProps) {
  const isEditing = !!empresaToEdit;
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"TODOS" | "INGRESO" | "DESCUENTO" | "TRIBUTO">("TODOS");

  // Fetch concepts
  const { data: conceptosResponse, isLoading: isLoadingConceptos } = useQuery<ApiResponse<ConceptoData[]>>({
    queryKey: ["conceptos", token],
    queryFn: async () => {
      const res = await Api.get("/conceptos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: isOpen && !!token,
  });

  const conceptos = conceptosResponse?.body || [];

  // Filter concepts based on tab
  const filteredConceptos = conceptos.filter((con) => {
    return activeTab === "TODOS" || con.tipo === activeTab;
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<EmpresaFormType>({
    resolver: zodResolver(empresaSchema),
    defaultValues: {
      name: "",
      ruc: "",
      address: "",
      conceptos: [],
    },
  });

  const selectedConceptos = watch("conceptos") || [];

  const handleToggleConcepto = (conceptoId: number) => {
    if (selectedConceptos.includes(conceptoId)) {
      setValue("conceptos", selectedConceptos.filter(id => id !== conceptoId), { shouldValidate: true });
    } else {
      setValue("conceptos", [...selectedConceptos, conceptoId], { shouldValidate: true });
    }
  };

  // Reset values when modal opens/closes or empresaToEdit changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("TODOS");
      if (empresaToEdit) {
        reset({
          name: empresaToEdit.name,
          ruc: empresaToEdit.ruc,
          address: empresaToEdit.address,
          conceptos: empresaToEdit.tempresaConceptos?.map(tc => tc.conceptoId) || [],
        });
      } else {
        reset({
          name: "",
          ruc: "",
          address: "",
          conceptos: [],
        });
      }
    }
  }, [isOpen, empresaToEdit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content Wrapper */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-xl p-6 sm:p-7 flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
              {isEditing ? (
                <FiEdit2 className="text-sm" />
              ) : (
                <FiPlusCircle className="text-sm" />
              )}
            </div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight">
              {isEditing ? "Editar Empresa" : "Registrar Nueva Empresa"}
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
                {...field}
                label="Razón Social / Nombre"
                placeholder="Empresa SAC"
                disabled={isLoading}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            name="ruc"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="Número de RUC"
                placeholder="20123456789"
                disabled={isLoading}
                error={errors.ruc?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="Dirección Fiscal"
                placeholder="Av. Las Flores 123, Lima"
                disabled={isLoading}
                error={errors.address?.message}
              />
            )}
          />

          {/* Conceptos Selector */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Conceptos Asociados
              </label>
              <span className="text-[10px] text-zinc-500 font-semibold">
                {selectedConceptos.length} seleccionados
              </span>
            </div>

            {/* Tabs Bar */}
            <div className="flex border-b border-zinc-200/30 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20 px-2 py-1.5 gap-1.5 overflow-x-auto rounded-bento-control mb-2">
              {(["TODOS", "INGRESO", "DESCUENTO", "TRIBUTO"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-bento-control transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-bento-secondary text-zinc-950 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                  }`}
                >
                  {tab === "TODOS"
                    ? "Todos"
                    : tab === "INGRESO"
                      ? "Ingresos"
                      : tab === "DESCUENTO"
                        ? "Descuentos"
                        : "Tributos"}
                </button>
              ))}
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-bento-control p-3 bg-zinc-50/50 dark:bg-zinc-950/20 max-h-48 overflow-y-auto space-y-2">
              {isLoadingConceptos ? (
                <p className="text-xs text-zinc-500 text-center py-2">Cargando conceptos...</p>
              ) : filteredConceptos.length === 0 ? (
                <p className="text-xs text-zinc-500 text-center py-2">No hay conceptos disponibles</p>
              ) : (
                filteredConceptos.map((con) => {
                  const isChecked = selectedConceptos.includes(con.conceptoId);
                  return (
                    <label
                      key={con.conceptoId}
                      className={`flex items-center gap-3 p-2 rounded-bento-control border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-bento-secondary/10 border-bento-secondary/30 dark:border-bento-secondary/20"
                          : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-850"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isLoading}
                        onChange={() => handleToggleConcepto(con.conceptoId)}
                        className="rounded border-zinc-300 dark:border-zinc-700 text-bento-secondary focus:ring-bento-secondary h-4 w-4 cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[10px] bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-650 dark:text-zinc-300">
                            {con.codigo}
                          </span>
                          {con.nombre}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {con.tipo} {con.subTipo ? `- ${con.subTipo}` : ""}
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
            {errors.conceptos && (
              <p className="text-xs text-red-500 font-medium mt-1">{errors.conceptos.message}</p>
            )}
          </div>

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
                  : "Crear Empresa"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
