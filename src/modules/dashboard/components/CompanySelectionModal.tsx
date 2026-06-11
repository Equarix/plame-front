"use client";

import { useState } from "react";
import type { EmpresaData } from "@/interface/response.interface";
import { FiX, FiBriefcase, FiSearch, FiCheck } from "react-icons/fi";

interface CompanySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  companies: EmpresaData[];
  isLoading: boolean;
  selectedCompanyId?: number;
  onSelect: (companyId: number) => void;
}

export function CompanySelectionModal({
  isOpen,
  onClose,
  companies,
  isLoading,
  selectedCompanyId,
  onSelect,
}: CompanySelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const canClose = !!selectedCompanyId;

  if (!isOpen) return null;

  // Filter companies based on search query
  const filteredCompanies = companies.filter((c) => {
    const nameMatch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const rucMatch = c.ruc.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || rucMatch;
  });

  const handleBackdropClick = () => {
    if (canClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Content Wrapper */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-overlay shadow-xl p-6 sm:p-7 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200/40 dark:border-zinc-800/40 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
              <FiBriefcase className="text-sm" />
            </div>
            <div>
              <h3 className="font-bold text-bento-text dark:text-zinc-50 tracking-tight text-sm sm:text-base leading-none">
                Selección de Empresa
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-none">
                Elija la empresa con la que operará en el portal
              </p>
            </div>
          </div>
          {canClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>

        {/* Search Input - Bento Styled */}
        <div className="relative flex items-center mb-4 shrink-0">
          <span className="absolute left-3 text-zinc-400 dark:text-zinc-500">
            <FiSearch className="text-sm" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar empresa por nombre o RUC..."
            className="block w-full text-xs bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50 h-9 pl-9 pr-3"
          />
        </div>

        {/* Body - Company List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {isLoading ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando empresas públicas...
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron empresas coincidentes." : "No hay empresas públicas registradas."}
            </div>
          ) : (
            filteredCompanies.map((company) => {
              const isSelected = selectedCompanyId === company.companyId;
              return (
                <div
                  key={company.companyId}
                  onClick={() => onSelect(company.companyId)}
                  className={`group relative p-4 rounded-bento-card border transition-all duration-200 cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-bento-secondary/10 dark:bg-bento-secondary/5 border-bento-secondary"
                      : "bg-zinc-50/50 dark:bg-zinc-850/20 border-zinc-200/50 dark:border-zinc-800/50 hover:border-zinc-400 dark:hover:border-zinc-700"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate block">
                        {company.name}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-bento-secondary bg-bento-secondary/15 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <FiCheck className="text-[10px]" /> Activo
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[10px] text-zinc-400 dark:text-zinc-500">
                      <span className="font-mono">RUC: {company.ruc}</span>
                      <span className="truncate max-w-[250px]">{company.address}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-bento-control text-[10px] font-bold shadow-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-bento-secondary text-zinc-950 border border-zinc-900/10"
                          : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 group-hover:bg-bento-secondary group-hover:text-zinc-950 group-hover:border-transparent"
                      }`}
                    >
                      {isSelected ? "Seleccionada" : "Seleccionar"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
