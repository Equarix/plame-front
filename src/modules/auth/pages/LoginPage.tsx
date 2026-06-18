"use client";

import { LoginForm } from "../components/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FaShieldAlt, FaPhoneAlt, FaLock, FaBookOpen } from "react-icons/fa";

export function LoginPage() {
  return (
    <div className="relative min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[400px] h-[400px] bg-bento-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] bg-bento-secondary/10 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Tile 1: Formulario de Login (Large Card - spans 2 columns on medium screens) */}
          <div className="md:col-span-2 bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-zinc-900/5 dark:shadow-black/20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-bento-control bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950">
                  <FaLock className="text-sm" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-bento-text dark:text-zinc-50 tracking-tight leading-none">
                    Identificación del Contribuyente
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Ingrese a su cuenta de planilla electrónica
                  </p>
                </div>
              </div>
              <LoginForm />
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-200/40 dark:border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                © {new Date().getFullYear()} SUNAT. Todos los derechos reservados.
              </span>
              <span className="text-[11px] font-semibold text-bento-secondary dark:text-bento-secondary/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-bento-secondary animate-pulse" />
                Servidor Oficial Activo
              </span>
            </div>
          </div>

          {/* Right Side Column Bento Tiles */}
          <div className="flex flex-col gap-5">
            
            {/* Tile 2: Brand & Title Card (Peach Background) */}
            <div className="bg-bento-primary dark:bg-zinc-900 border border-zinc-900/5 dark:border-zinc-800 rounded-bento-card p-6 flex flex-col justify-between shadow-md h-full min-h-[160px] text-zinc-900 dark:text-zinc-50">
              <div className="w-10 h-10 rounded-bento-control bg-zinc-900 dark:bg-zinc-100/10 flex items-center justify-center text-white dark:text-zinc-50 shadow-sm">
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight leading-none text-zinc-950 dark:text-white mb-2">
                  PLAME
                </h1>
                <p className="text-xs text-zinc-800 dark:text-zinc-300 leading-relaxed font-medium">
                  Plataforma Integrada de la Planilla Electrónica Mensual de Pagos.
                </p>
              </div>
            </div>



          </div>

          {/* Bottom Row Bento Tiles */}
          {/* Tile 4: Informative Banner (Spans 3 columns) */}
          <div className="md:col-span-3 bg-white/40 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-5 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-white dark:bg-zinc-800 rounded-bento-control text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50 shadow-inner shrink-0 hidden sm:block">
              <FaBookOpen className="text-lg" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Declaración e Importación de T-Registro
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                El sistema sincroniza automáticamente los datos de alta y baja del T-Registro para facilitar la declaración mensual de su personal y aportes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
