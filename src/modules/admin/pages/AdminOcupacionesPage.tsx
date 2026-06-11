"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminOcupacionModal } from "../components/AdminOcupacionModal";
import { type OcupacionFormType } from "../schemas/ocupacion.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, OcupacionData } from "@/interface/response.interface";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiBriefcase,
} from "react-icons/fi";

export function AdminOcupacionesPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOcupacion, setSelectedOcupacion] = useState<OcupacionData | undefined>(undefined);

  // 1. Fetch Occupations List using React Query
  const {
    data: ocupacionesApiResponse,
    isLoading: isLoadingOcupaciones,
    refetch: refetchOcupaciones,
  } = useQuery<ApiResponse<OcupacionData[]>>({
    queryKey: ["admin-ocupaciones", token],
    queryFn: async () => {
      const res = await Api.get("/ocupacion?page=1&limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const ocupacionesList = ocupacionesApiResponse?.body || [];

  // Filter occupations based on search query
  const filteredOcupaciones = ocupacionesList.filter((ocu) => {
    return ocu.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 2. Create Occupation Mutation
  const { mutate: createOcupacion, isPending: isCreating } = useMutation({
    mutationFn: async (formData: OcupacionFormType) => {
      const res = await Api.post("/ocupacion", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ocupación registrada exitosamente");
      refetchOcupaciones();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la ocupación");
    },
  });

  // 3. Edit Occupation Mutation
  const { mutate: editOcupacion, isPending: isEditing } = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: OcupacionFormType }) => {
      const res = await Api.patch(`/ocupacion/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ocupación actualizada exitosamente");
      refetchOcupaciones();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la ocupación");
    },
  });

  // 4. Delete Occupation Mutation
  const { mutate: deleteOcupacion, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const res = await Api.delete(`/ocupacion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Ocupación eliminada exitosamente");
      refetchOcupaciones();
    },
    onError: () => {
      toast.error("Error al eliminar la ocupación");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedOcupacion(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (ocupacionData: OcupacionData) => {
    setSelectedOcupacion(ocupacionData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: OcupacionFormType) => {
    if (selectedOcupacion) {
      editOcupacion({ id: selectedOcupacion.id, formData });
    } else {
      createOcupacion(formData);
    }
  };

  const handleDeleteOcupacion = (id: number) => {
    if (window.confirm("¿Está seguro de eliminar esta ocupación?")) {
      deleteOcupacion(id);
    }
  };

  return (
    <AdminLayout title="Ocupaciones">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">

        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
              <FiBriefcase className="text-zinc-550" />
              <span>Listado de Ocupaciones</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Ocupaciones laborales registradas en el sistema</p>
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
                placeholder="Buscar por nombre..."
                className="block w-full sm:w-64 text-xs bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50 h-9 pl-9 pr-3"
              />
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-bento-secondary hover:opacity-95 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-bento-control shadow-md transition-all cursor-pointer border border-zinc-900/10 shrink-0"
            >
              <FiPlus className="text-sm" />
              <span>Registrar Ocupación</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingOcupaciones ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de ocupaciones...
            </div>
          ) : filteredOcupaciones.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron ocupaciones coincidentes." : "No hay ocupaciones registradas."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5 w-24">ID</th>
                  <th className="px-6 py-3.5">Nombre de la Ocupación</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredOcupaciones.map((ocu) => (
                  <tr
                    key={ocu.id}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      #{ocu.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {ocu.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(ocu)}
                          title="Editar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteOcupacion(ocu.id)}
                          title="Eliminar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Ocupacion Form Modal */}
      <AdminOcupacionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        ocupacionToEdit={selectedOcupacion}
        isLoading={isCreating || isEditing || isDeleting}
      />
    </AdminLayout>
  );
}
