"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlus, FiUsers, FiBriefcase, FiAlertCircle, FiShield } from "react-icons/fi";
import { ThemeToggle } from "@/components/ThemeToggle";

export function TRegistroPage() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* ROW 1: Navbar (Bento Header Card) */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-bento-control text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer border border-zinc-200/30 dark:border-zinc-800"
            >
              <FiArrowLeft className="text-lg" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center font-bold shadow-inner">
                <FiUsers className="text-sm" />
              </div>
              <span className="font-bold text-bento-text dark:text-zinc-50 text-lg tracking-tight">
                T-Registro
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-bento-danger hover:bg-bento-danger/5 transition-all cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

      {/* ROW 2: Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento Stats 1: Workers */}
        <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Trabajadores Activos</span>
            <div className="w-8 h-8 rounded-bento-control bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center border border-green-250/10">
              <FiUsers className="text-base" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-bento-text dark:text-zinc-100">148</p>
            <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 font-semibold">Tributando activamente</p>
          </div>
        </div>

        {/* Bento Stats 2: Contractors */}
        <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Prestadores de Servicio</span>
            <div className="w-8 h-8 rounded-bento-control bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-250/10">
              <FiBriefcase className="text-base" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-bento-text dark:text-zinc-100">24</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">4ª Categoría (Recibos)</p>
          </div>
        </div>

        {/* Bento Stats 3: Quick Action (Peach layout card) */}
        <div className="bg-bento-primary dark:bg-zinc-900 border border-zinc-900/5 dark:border-zinc-800 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-[150px] text-zinc-950 dark:text-zinc-50 group hover:opacity-95 transition-opacity cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900/60 dark:text-zinc-400">Acción Rápida</span>
            <div className="w-8 h-8 rounded-bento-control bg-zinc-950 text-white flex items-center justify-center">
              <FiPlus className="text-base" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-tight">Registrar Personal</h4>
            <p className="text-[10px] text-zinc-800 dark:text-zinc-400 mt-1">Dar de alta un nuevo trabajador en el sistema</p>
          </div>
        </div>

        {/* Bento Stats 4: Pending hires (spans 1 column) */}
        <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-[150px]">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pendientes de Alta</span>
            <div className="w-8 h-8 rounded-bento-control bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-250/10">
              <FiAlertCircle className="text-base" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-bento-text dark:text-zinc-100">3</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">Requiere firma digital</p>
          </div>
        </div>

        {/* Bento Stats 5: Legal badge/info (spans 2 columns) */}
        <div className="bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-5 flex items-start gap-4 shadow-sm md:col-span-2">
          <div className="p-3 bg-white dark:bg-zinc-800 rounded-bento-control text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50 shadow-inner shrink-0">
            <FiShield className="text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Marco Legal T-Registro</h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              El registro laboral cumple con el Decreto Supremo N° 018-2007-TR y sus modificatorias. Toda alta debe ser informada dentro del día de ingreso a labores.
            </p>
          </div>
        </div>

        {/* Table list: Bento Box (spans full 3 columns) */}
        <div className="md:col-span-3 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50">
            <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base">Personal Registrado Recientemente</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Últimos movimientos sincronizados con la Planilla Electrónica</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5">Nombre</th>
                  <th className="px-6 py-3.5">Documento (DNI/CE)</th>
                  <th className="px-6 py-3.5">Puesto</th>
                  <th className="px-6 py-3.5">Fecha de Ingreso</th>
                  <th className="px-6 py-3.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                <tr className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">Carlos Mendoza Ruiz</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">45781290</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">Desarrollador Full Stack</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">01/06/2026</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30 rounded-md">Activo</span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">Ana Sofía Torres</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">70984321</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">Diseñadora UX/UI</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">15/05/2026</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30 rounded-md">Activo</span>
                  </td>
                </tr>
                <tr className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">Luis Alberto Gomez</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">09348123</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">Analista Contable</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">02/05/2026</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 rounded-md">Pendiente</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
