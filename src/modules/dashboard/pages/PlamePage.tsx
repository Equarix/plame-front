"use client";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiPlus, FiFileText, FiTrendingUp, FiCheckCircle, FiPlusSquare } from "react-icons/fi";
import { ThemeToggle } from "@/components/ThemeToggle";

export function PlamePage() {
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
              <div className="w-8 h-8 rounded-bento-control bg-bento-secondary text-zinc-950 flex items-center justify-center font-bold shadow-inner">
                <FiFileText className="text-sm" />
              </div>
              <span className="font-bold text-bento-text dark:text-zinc-50 text-lg tracking-tight">
                PLAME
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

      {/* ROW 2: Bento Grid for details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bento Card 1: Active Period Banner (Spans 2 columns) */}
        <div className="md:col-span-2 bg-gradient-to-r from-violet-650 to-indigo-650 dark:from-zinc-900 dark:to-zinc-900 border border-violet-700/20 dark:border-zinc-800 rounded-bento-card p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          {/* Subtle design element */}
          <div className="absolute right-0 bottom-0 translate-x-1/10 translate-y-1/10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/15 px-2 py-0.5 rounded-md w-fit">Período Fiscal Activo</span>
            <h3 className="text-2xl font-black mt-3">Junio 2026</h3>
            <p className="text-zinc-200 dark:text-zinc-400 text-xs mt-2 leading-relaxed max-w-xl">
              Recuerda que la presentación y pago de la Planilla Mensual correspondiente a este período vence el próximo 15 de julio de 2026. Asegúrate de tener al día toda la información importada del T-Registro.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold bg-white/10 dark:bg-zinc-850 w-fit px-3 py-1 rounded-bento-control">
            <FiCheckCircle className="text-xs text-green-300" />
            <span>Sincronizado con T-Registro correctamente</span>
          </div>
        </div>

        {/* Bento Card 2: Quick Action (New Declaration) */}
        <div className="bg-bento-secondary dark:bg-zinc-900 border border-zinc-900/5 dark:border-zinc-800 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-full min-h-[180px] text-zinc-950 dark:text-zinc-50 group hover:opacity-95 transition-opacity cursor-pointer">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900/60 dark:text-zinc-400">Declaraciones</span>
            <div className="w-8 h-8 rounded-bento-control bg-zinc-950 text-white flex items-center justify-center">
              <FiPlusSquare className="text-base" />
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold tracking-tight">Nueva Declaración</h4>
            <p className="text-[10px] text-zinc-800 dark:text-zinc-400 mt-1">Generar una nueva declaración jurada para el período mensual</p>
          </div>
        </div>

      </div>

      {/* ROW 3: Historical declarations table (spans 3 columns) */}
      <div className="mt-6 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base">Declaraciones Juradas Recientes</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Historial de declaraciones mensuales de pagos de tributos</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
            <FiTrendingUp className="text-bento-secondary" /> Historial de pagos
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                <th className="px-6 py-3.5">Período</th>
                <th className="px-6 py-3.5">Nº de Orden</th>
                <th className="px-6 py-3.5">Fecha Presentación</th>
                <th className="px-6 py-3.5">Total Neto a Pagar</th>
                <th className="px-6 py-3.5">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
              <tr className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">Mayo 2026</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">01239845</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">12/06/2026</td>
                <td className="px-6 py-4 font-medium text-zinc-950 dark:text-zinc-100">S/. 12,450.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30 rounded-md">Presentado</span>
                </td>
              </tr>
              <tr className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">Abril 2026</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">01235612</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">14/05/2026</td>
                <td className="px-6 py-4 font-medium text-zinc-950 dark:text-zinc-100">S/. 11,820.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30 rounded-md">Presentado</span>
                </td>
              </tr>
              <tr className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">Marzo 2026</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">01229043</td>
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">11/04/2026</td>
                <td className="px-6 py-4 font-medium text-zinc-950 dark:text-zinc-100">S/. 11,940.00</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30 rounded-md">Presentado</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  );
}
