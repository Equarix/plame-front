"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiArrowLeft, FiLogOut, FiBriefcase } from "react-icons/fi";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import type { ApiResponse, EmpresaData } from "@/interface/response.interface";
import { CompanySelectionModal } from "./CompanySelectionModal";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}

export function DashboardLayout({ children, title, icon }: DashboardLayoutProps) {
  const { logout, token, companyId, setCompanyId } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to home if no company is selected
  useEffect(() => {
    if (mounted && !companyId) {
      router.push("/");
    }
  }, [mounted, companyId, router]);

  // Fetch public companies to show selected company name
  const {
    data: publicCompaniesResponse,
    isLoading: isLoadingCompanies,
  } = useQuery<ApiResponse<EmpresaData[]>>({
    queryKey: ["public-companies", token],
    queryFn: async () => {
      const res = await Api.get("/t-empresa/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token && !!companyId,
  });

  const companiesList = publicCompaniesResponse?.body || [];
  const activeCompany = companiesList.find((c) => c.companyId === companyId);

  // While mounting or if not logged/selected, show a full screen loading or return null
  if (!mounted || !companyId) {
    return (
      <div className="min-h-screen bg-bento-surface dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-semibold animate-pulse">
          Cargando panel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        {/* Navbar (Bento Header Card) */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 sm:p-5 flex items-center justify-between shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer border border-zinc-200/30 dark:border-zinc-800"
            >
              <FiArrowLeft className="text-lg" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center font-bold shadow-inner">
                {icon}
              </div>
              <span className="font-bold text-bento-text dark:text-zinc-50 text-lg tracking-tight">
                {title}
              </span>
            </div>
          </div>

          {/* Active Company Widget */}
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-control">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shrink-0" />
            <div className="text-left min-w-[120px] max-w-[200px]">
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider leading-none">
                Empresa Activa
              </p>
              <p className="text-xs font-bold text-zinc-800 dark:text-zinc-100 truncate mt-1 leading-tight">
                {activeCompany?.name || "Cargando..."}
              </p>
              <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 leading-none">
                RUC: {activeCompany?.ruc || "..."}
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-2 px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-zinc-800 hover:bg-bento-secondary hover:text-zinc-950 border border-zinc-200 dark:border-zinc-700 hover:border-transparent rounded-bento-control transition-all duration-200 cursor-pointer shadow-sm"
            >
              Cambiar
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Mobile Company Indicator trigger */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex md:hidden items-center justify-center w-8 h-8 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-bento-control text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 cursor-pointer transition-colors"
              title="Cambiar Empresa"
            >
              <FiBriefcase className="text-sm" />
            </button>
            <ThemeToggle />

            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-bento-danger hover:bg-bento-danger/5 transition-all cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Page Content */}
        {children}

        {/* Company Switcher Modal */}
        <CompanySelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          companies={companiesList}
          isLoading={isLoadingCompanies}
          selectedCompanyId={companyId}
          onSelect={(id) => {
            setCompanyId(id);
            setIsModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
