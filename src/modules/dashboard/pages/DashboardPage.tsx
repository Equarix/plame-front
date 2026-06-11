"use client";

import { useState, useEffect } from "react";

import { useAuth } from "@/components/context/AuthContext";
import { useRouter } from "next/navigation";
import { FiLogOut, FiUsers, FiFileText, FiCheck, FiSettings, FiActivity } from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { ThemeToggle } from "@/components/ThemeToggle";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const displayName = mounted && user ? `${user.name} ${user.lastName}` : "Usuario";
  const displayUsername = mounted && user ? user.username : "";
  const displayRole = mounted && user ? user.role : "USUARIO";

  return (
    <div className="min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col gap-6">
        
        {/* ROW 1: Header / Top Navbar (Bento Card Layout) */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 sm:p-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-bento-control bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 shadow-md">
              <FaShieldAlt className="text-xl" />
            </div>
            <div>
              <span className="font-bold text-bento-text dark:text-zinc-50 text-lg tracking-tight leading-none block">
                Portal PLAME
              </span>
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-1 block">
                SUNAT • Planilla Electrónica
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-bento-text dark:text-zinc-50">
                {displayName}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-bento-primary dark:bg-zinc-800 text-zinc-900 dark:text-bento-primary rounded-md uppercase tracking-wider">
                {displayRole}
              </span>
            </div>
            
            <ThemeToggle />
            
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-bento-danger/30 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-bento-danger hover:bg-bento-danger/5 transition-all duration-200 cursor-pointer"
            >
              <FiLogOut className="text-sm" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </header>

        {/* ROW 2: Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: T-Registro (Large Card spanning 2 columns) */}
          <div
            onClick={() => handleNavigate("/t-registro")}
            className="md:col-span-2 group relative bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-bento-primary dark:hover:border-bento-primary rounded-bento-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Top-right decorative background patch */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-bento-primary/10 rounded-bl-full group-hover:bg-bento-primary/20 transition-colors" />

            <div>
              <div className="w-12 h-12 rounded-bento-control bg-bento-primary text-zinc-900 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <FiUsers className="text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-bento-text dark:text-zinc-50 tracking-tight mb-2">
                T-Registro
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                Registro Laboral obligatorio donde se inscribe a empleadores, trabajadores, pensionistas, prestadores de servicios y derechohabientes.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Sincronización activa
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 group-hover:translate-x-1.5 transition-transform duration-300">
                Ingresar al Registro &rarr;
              </span>
            </div>
          </div>

          {/* Bento Card 2: User Profile Metadata (1 column) */}
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">
                Información Fiscal
              </span>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">Contribuyente</p>
                  <p className="text-sm font-bold text-bento-text dark:text-zinc-100">{displayName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">Nombre de usuario</p>
                  <p className="text-sm font-mono text-zinc-600 dark:text-zinc-300">{displayUsername}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase">Rol del Sistema</p>
                  <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{displayRole}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
              <FiSettings className="text-xs shrink-0" />
              <span>Configuraciones del portal habilitadas</span>
            </div>
          </div>

          {/* Bento Card 3: System Status (1 column) */}
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-4">
                Estado del Servicio
              </span>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-bento-control bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                  <FiActivity className="text-lg animate-pulse" />
                </div>
                <div>
                  <p className="text-sm font-bold text-bento-text dark:text-zinc-100">Servidores SUNAT</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Operando normalmente</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                La firma digital y el envío de declaraciones PLAME se encuentran disponibles para el periodo actual.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400 font-semibold">
              <FiCheck className="text-sm shrink-0" />
              <span>Conexión SSL Segura</span>
            </div>
          </div>

          {/* Bento Card 4: PLAME (Large Card spanning 2 columns) */}
          <div
            onClick={() => handleNavigate("/plame")}
            className="md:col-span-2 group relative bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 hover:border-bento-secondary dark:hover:border-bento-secondary rounded-bento-card p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
          >
            {/* Top-right decorative background patch */}
            <div className="absolute top-0 right-0 w-28 h-28 bg-bento-secondary/10 rounded-bl-full group-hover:bg-bento-secondary/20 transition-colors" />

            <div>
              <div className="w-12 h-12 rounded-bento-control bg-bento-secondary text-zinc-950 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                <FiFileText className="text-xl" />
              </div>
              <h3 className="text-2xl font-bold text-bento-text dark:text-zinc-50 tracking-tight mb-2">
                PLAME
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                Planilla Mensual de Pagos. Permite declarar las remuneraciones de los trabajadores e importaciones directas de la información registrada en el T-Registro.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Declaración de Junio 2026 activa
              </span>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 group-hover:translate-x-1.5 transition-transform duration-300">
                Ingresar a PLAME &rarr;
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
