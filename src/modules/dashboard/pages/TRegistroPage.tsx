"use client";

import { FiUsers, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../components/DashboardLayout";

export function TRegistroPage() {
  const router = useRouter();

  // Mock data for the table
  const mockPersonas = [
    { id: 1, name: "Juan Pérez Gómez", document: "DNI 45789123" },
    { id: 2, name: "Maria Rodriguez Ruiz", document: "DNI 72145698" },
  ];

  return (
    <DashboardLayout title="T-Registro" icon={<FiUsers className="text-sm" />}>
      {/* Container Bento Card for Table */}
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">
        {/* Table Header Section */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base">Trabajadores Registrados</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Listado de personal activo e inscripto en el T-Registro</p>
          </div>
          <button
            onClick={() => router.push("/t-registro/crear")}
            className="flex items-center gap-2 px-3 py-1.5 bg-bento-secondary hover:bg-bento-secondary/95 text-zinc-950 text-xs font-bold rounded-bento-control shadow-sm transition-all duration-200 cursor-pointer border border-zinc-900/5"
          >
            <FiPlus className="text-sm shrink-0" />
            <span>Registrar Persona</span>
          </button>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                <th className="px-6 py-3.5">Nombre Completo</th>
                <th className="px-6 py-3.5">Documento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
              {mockPersonas.map((persona) => (
                <tr key={persona.id} className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-bento-text dark:text-zinc-200">{persona.name}</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">{persona.document}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
