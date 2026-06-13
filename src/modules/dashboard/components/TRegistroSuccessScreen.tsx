"use client";

import React from "react";
import { FiFileText, FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import type { TRegistroSuccessData } from "../hooks/useTRegistroForm";

interface TRegistroSuccessScreenProps {
  data: TRegistroSuccessData;
  onRetornar: () => void;
}

const formatDateToDDMMYYYY = (dateStr?: string): string => {
  if (!dateStr) return "";
  try {
    const cleanDateStr = dateStr.split("T")[0]; // YYYY-MM-DD
    const [year, month, day] = cleanDateStr.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return dateStr;
  }
};

const getCategoryLabel = (category: string): string => {
  switch (category) {
    case "TRABAJADOR":
      return "Trabajador";
    case "PENSIONISTA":
      return "Pensionista";
    case "PERSONAL_FORMACION_LABORAL":
      return "Personal en Formación Laboral";
    case "PERSONAL_TERCERO":
      return "Personal de Terceros";
    default:
      return category;
  }
};

export function TRegistroSuccessScreen({ data, onRetornar }: TRegistroSuccessScreenProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handlePrintCir = async () => {
    try {
      setIsGenerating(true);
      const res = await fetch("/api/pdf-tpersona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Constancia CIR generada correctamente");
    } catch (err: unknown) {
      console.error("Error generating PDF:", err);
      toast.error("Error al generar el PDF de la constancia");
    } finally {
      setIsGenerating(false);
    }
  };

  const fullName = `${data.trabajador.apellidoPaterno} ${data.trabajador.apellidoMaterno}, ${data.trabajador.nombres}`.toUpperCase();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        
        {/* Header - Bright Blue with checkmark on the left */}
        <div className="bg-[#154dbb] p-4 sm:p-5 flex items-center relative">
          <div className="flex items-center justify-center w-7 h-7 rounded-full border border-white/60 text-white shrink-0 mr-3">
            <FiCheck className="text-base font-extrabold" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase flex-1 text-center pr-7">
            Registro de Trabajadores, Pensionistas y Otros Prestadores de Servicios
          </h2>
        </div>

        {/* Sub-header - Soft Beige/Cream SUNAT style */}
        <div className="bg-[#faf7eb] dark:bg-zinc-850/80 px-4 sm:px-6 py-4 border-b border-zinc-200/60 dark:border-zinc-800">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 uppercase tracking-wide">
            Impresión de Constancias de Alta, Modificación o Baja de un Prestador de Servicios
          </h3>
          <h4 className="text-[10px] sm:text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-2.5">
            Datos de Identificación
          </h4>
        </div>

        {/* Success message & Information */}
        <div className="p-4 sm:p-6 space-y-6">
          <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed">
            Se ha realizado el <span className="font-bold text-[#008f4c] dark:text-emerald-450">alta</span>, modificación o baja de un prestador de servicios satisfactoriamente, cuyos datos de identificación son:
          </p>

          {/* Grid matching details */}
          <div className="grid grid-cols-1 md:grid-cols-2 bg-[#f8f9fa] dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden text-xs">
            <div className="p-4 space-y-4 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">Tipo y Número de Documento</span>
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-100">L.E / DNI - {data.trabajador.dni}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">País Emisor de Documento</span>
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-100">{data.trabajador.nacionalidad.toUpperCase() || "PERÚ"}</span>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">Fecha de Nacimiento</span>
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-100">{formatDateToDDMMYYYY(data.trabajador.fechaNacimiento)}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">Apellidos y Nombres</span>
                <span className="text-xs font-bold text-zinc-850 dark:text-zinc-100">{fullName}</span>
              </div>
            </div>
          </div>

          {/* Categories block */}
          <div className="space-y-3">
            <h5 className="text-[10px] sm:text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Categorías en las cuales se realizó el alta, modificación o baja de un prestador de servicios:
            </h5>
            
            {/* Table layout */}
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-zinc-900 gap-3 text-xs">
                <div className="font-bold text-zinc-850 dark:text-zinc-100 w-full sm:w-auto text-left sm:pl-2">
                  {getCategoryLabel(data.categoria)}
                </div>
                
                <div className="flex items-center gap-1.5 w-full sm:w-auto text-left">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-300 dark:border-emerald-900/30">
                    ALTA
                  </span>
                </div>

                <div className="w-full sm:w-auto text-left sm:text-right">
                  <button
                    onClick={handlePrintCir}
                    disabled={isGenerating}
                    className={`inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold underline transition-colors cursor-pointer ${
                      isGenerating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isGenerating ? (
                      <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <FiFileText className="text-sm shrink-0" />
                    )}
                    {isGenerating ? "Generando..." : "Imprimir CIR"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Centered Retornar Button */}
          <div className="flex justify-center pt-6 border-t border-zinc-200/40 dark:border-zinc-800/40 mt-8">
            <button
              onClick={onRetornar}
              className="px-6 py-2 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-250 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer min-w-[120px] h-9"
            >
              Retornar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
