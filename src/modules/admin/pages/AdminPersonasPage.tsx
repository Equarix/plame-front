"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminPersonaModal } from "../components/AdminPersonaModal";
import { type PersonaFormType } from "../schemas/persona.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, PersonaData } from "@/interface/response.interface";
import { formatDireccion } from "@/utils/address";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiUsers,
} from "react-icons/fi";

export function AdminPersonasPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaData | undefined>(undefined);

  // 1. Fetch Personas List using React Query
  const {
    data: personasApiResponse,
    isLoading: isLoadingPersonas,
    refetch: refetchPersonas,
  } = useQuery<ApiResponse<PersonaData[]>>({
    queryKey: ["admin-personas", token],
    queryFn: async () => {
      const res = await Api.get("/persona?page=1&limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const personasList = personasApiResponse?.body || [];

  // Filter personas based on search query
  const filteredPersonas = personasList.filter((per) => {
    const dniMatch = per.dni.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = per.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const telMatch = per.telefono?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const nacMatch = per.nacionalidad.toLowerCase().includes(searchQuery.toLowerCase());
    return dniMatch || emailMatch || telMatch || nacMatch;
  });

  // 2. Create Persona Mutation
  const { mutate: createPersona, isPending: isCreating } = useMutation({
    mutationFn: async (formData: PersonaFormType) => {
      const res = await Api.post("/persona", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Persona registrada exitosamente");
      refetchPersonas();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la persona");
    },
  });

  // 3. Edit Persona Mutation
  const { mutate: editPersona, isPending: isEditing } = useMutation({
    mutationFn: async ({ personaId, formData }: { personaId: number; formData: PersonaFormType }) => {
      const res = await Api.patch(`/persona/${personaId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Persona actualizada exitosamente");
      refetchPersonas();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la persona");
    },
  });

  // 4. Delete Persona Mutation
  const { mutate: deletePersona, isPending: isDeleting } = useMutation({
    mutationFn: async (personaId: number) => {
      const res = await Api.delete(`/persona/${personaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Persona eliminada exitosamente");
      refetchPersonas();
    },
    onError: () => {
      toast.error("Error al eliminar la persona");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedPersona(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (personaData: PersonaData) => {
    setSelectedPersona(personaData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: PersonaFormType) => {
    if (selectedPersona) {
      editPersona({ personaId: selectedPersona.personaId, formData });
    } else {
      createPersona(formData);
    }
  };

  const handleDeletePersona = (personaId: number) => {
    if (window.confirm("¿Está seguro de eliminar esta persona del T-Registro?")) {
      deletePersona(personaId);
    }
  };

  return (
    <AdminLayout title="Gestión de Personas">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">

        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
              <FiUsers className="text-zinc-500" />
              <span>Listado de Personas</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Personas registradas en el T-Registro</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input - Bento Styled */}
            <div className="relative flex items-center">
              <span className="absolute left-3 text-zinc-400 dark:text-zinc-500">
                <FiSearch className="text-sm" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por DNI, correo o teléfono..."
                className="block w-full sm:w-64 text-xs bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50 h-9 pl-9 pr-3"
              />
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-bento-secondary hover:opacity-95 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-bento-control shadow-md transition-all cursor-pointer border border-zinc-900/10 shrink-0"
            >
              <FiPlus className="text-sm" />
              <span>Registrar Persona</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingPersonas ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de personas...
            </div>
          ) : filteredPersonas.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron personas coincidentes." : "No hay personas registradas."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5">DNI</th>
                  <th className="px-6 py-3.5">F. Nacimiento</th>
                  <th className="px-6 py-3.5">Sexo</th>
                  <th className="px-6 py-3.5">Nacionalidad</th>
                  <th className="px-6 py-3.5">Teléfono / Email</th>
                  <th className="px-6 py-3.5">Dirección Principal</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredPersonas.map((per) => {
                  let birthDateStr = per.fechaNacimiento;
                  try {
                    birthDateStr = new Date(per.fechaNacimiento).toLocaleDateString("es-ES", {
                      timeZone: "UTC",
                    });
                  } catch {
                    // Fallback to raw string
                  }

                  return (
                    <tr
                      key={per.personaId}
                      className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {per.dni}
                      </td>
                      <td className="px-6 py-4 text-zinc-650 dark:text-zinc-300">
                        {birthDateStr}
                      </td>
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 rounded">
                          {per.sexo}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-650 dark:text-zinc-300">
                        {per.nacionalidad}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-zinc-900 dark:text-zinc-200 font-medium">{per.telefono}</span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{per.email}</span>
                        </div>
                      </td>
                      <td
                        className="px-6 py-4 text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]"
                        title={
                          per.direcciones && per.direcciones.length > 0
                            ? formatDireccion(per.direcciones[0])
                            : "Sin dirección"
                        }
                      >
                        {per.direcciones && per.direcciones.length > 0
                          ? formatDireccion(per.direcciones[0])
                          : "Sin dirección"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(per)}
                            title="Editar"
                            className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                          >
                            <FiEdit className="text-sm" />
                          </button>
                          <button
                            onClick={() => handleDeletePersona(per.personaId)}
                            title="Eliminar"
                            className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Persona Form Modal */}
      <AdminPersonaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        personaToEdit={selectedPersona}
        isLoading={isCreating || isEditing || isDeleting}
      />
    </AdminLayout>
  );
}
