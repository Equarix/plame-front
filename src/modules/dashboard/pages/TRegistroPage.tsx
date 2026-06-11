"use client";

import { FiUsers, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  DashboardTableCard,
  type DashboardTableColumn,
} from "@/components/DashboardTableCard";
import { DashboardLayout } from "../components/DashboardLayout";

type PersonaRow = {
  id: number;
  name: string;
  document: string;
};

const mockPersonas: PersonaRow[] = [
  { id: 1, name: "Juan Pérez Gómez", document: "DNI 45789123" },
  { id: 2, name: "Maria Rodriguez Ruiz", document: "DNI 72145698" },
];

const personaColumns: DashboardTableColumn<PersonaRow>[] = [
  {
    header: "Nombre Completo",
    render: (persona) => (
      <span className="font-semibold text-bento-text dark:text-zinc-200">
        {persona.name}
      </span>
    ),
  },
  {
    header: "Documento",
    render: (persona) => (
      <span className="text-zinc-500 dark:text-zinc-400 font-mono">
        {persona.document}
      </span>
    ),
  },
];

export function TRegistroPage() {
  const router = useRouter();

  return (
    <DashboardLayout title="T-Registro" icon={<FiUsers className="text-sm" />}>
      <DashboardTableCard
        title="Trabajadores Registrados"
        description="Listado de personal activo e inscripto en el T-Registro"
        action={
          <button
            onClick={() => router.push("/t-registro/crear")}
            className="flex items-center gap-2 px-3 py-1.5 bg-bento-secondary hover:bg-bento-secondary/95 text-zinc-950 text-xs font-bold rounded-bento-control shadow-sm transition-all duration-200 cursor-pointer border border-zinc-900/5"
          >
            <FiPlus className="text-sm shrink-0" />
            <span>Registrar Persona</span>
          </button>
        }
        columns={personaColumns}
        data={mockPersonas}
        getRowKey={(persona) => persona.id}
      />
    </DashboardLayout>
  );
}
