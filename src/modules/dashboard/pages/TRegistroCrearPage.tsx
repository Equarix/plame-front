"use client";

import { FiPlus } from "react-icons/fi";
import { DashboardLayout } from "../components/DashboardLayout";

export function TRegistroCrearPage() {
  return (
    <DashboardLayout title="Registrar Persona" icon={<FiPlus className="text-sm" />}>
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col">
        {/* Empty form space for user implementation */}
        <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base mb-4">
          Nuevo Registro de Personal
        </h3>
        
        <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-bento-card p-12 flex flex-col items-center justify-center text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Formulario de Registro - Espacio para implementación
          </p>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-505 mt-1 max-w-sm">
            Rellene este espacio utilizando React Hook Form y esquemas de validación Zod según el modelo TPersona.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
