"use client";

import { AdminLoginForm } from "../components/AdminLoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from "next/image";
import { FaUserShield, FaServer, FaUserCog, FaKey } from "react-icons/fa";
import Logo from "@/assets/logo-instituto.jpeg";

export function AdminLoginPage() {
  return (
    <div className="relative min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-[450px] h-[450px] bg-bento-secondary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 w-[450px] h-[450px] bg-bento-primary/10 rounded-full blur-[90px]" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tile 1: Formulario de Login (Large Card - spans 2 columns) */}
          <div className="md:col-span-2 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-zinc-900/5 dark:shadow-black/20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-bento-control bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950">
                  <FaKey className="text-sm" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-bento-text dark:text-zinc-50 tracking-tight leading-none">
                    Acceso de Administrador
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Panel administrativo para la gestión de usuarios y planillas
                  </p>
                </div>
              </div>

              <AdminLoginForm />
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                © {new Date().getFullYear()} SUNAT. Área de Sistemas e
                Infraestructura.
              </span>
              <span className="text-[11px] font-semibold text-bento-primary dark:text-bento-primary/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bento-primary animate-pulse" />
                Área Restringida
              </span>
            </div>
          </div>

          {/* Right Side Column Bento Tiles */}
          <div className="flex flex-col gap-5">
            {/* Tile 2: Brand & Title Card (Minimalist Style) */}
            <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 flex flex-col justify-between shadow-md h-full min-h-[300px] text-zinc-900 dark:text-zinc-50">
              <div className="flex flex-col items-center text-center gap-4">
                <Image
                  src={Logo}
                  width={1200}
                  height={1200}
                  alt="Logo IESTP Florencia de Mora"
                  className="w-auto h-full object-contain "
                />
                <span className="text-[9px] uppercase font-bold tracking-widest bg-bento-secondary/10 text-bento-secondary dark:bg-bento-secondary/20 dark:text-bento-secondary/90 px-3 py-1 rounded-full border border-bento-secondary/20">
                  IESTP Florencia de Mora
                </span>
              </div>
              <div className="mt-4 text-center">
                <h1 className="text-xl font-black tracking-tight leading-none text-bento-text dark:text-zinc-50 mb-2">
                  SIMULADOR PLAME
                </h1>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Plataforma académica y simulador de la Planilla Electrónica
                  Mensual de Pagos (PLAME) para el Instituto de Educación
                  Superior Tecnológico Público "Florencia de Mora".
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
