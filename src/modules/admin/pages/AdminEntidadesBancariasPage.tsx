"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminEntidadBancariaModal } from "../components/AdminEntidadBancariaModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { type EntidadBancariaFormType } from "../schemas/entidad-bancaria.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, EntidadBancariaData } from "@/interface/response.interface";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiPlusSquare,
} from "react-icons/fi";

export function AdminEntidadesBancariasPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEntidad, setSelectedEntidad] = useState<EntidadBancariaData | undefined>(undefined);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; idToDelete: number | null }>({ isOpen: false, idToDelete: null });

  // 1. Fetch Bank Entities List using React Query
  const {
    data: entidadesApiResponse,
    isLoading: isLoadingEntidades,
    refetch: refetchEntidades,
  } = useQuery<ApiResponse<EntidadBancariaData[]>>({
    queryKey: ["admin-entidades-bancarias", token],
    queryFn: async () => {
      const res = await Api.get("/entidad-bancaria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const entidadesList = entidadesApiResponse?.body || [];

  // Filter bank entities based on search query
  const filteredEntidades = entidadesList.filter((ent) => {
    return ent.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 2. Create Bank Mutation
  const { mutate: createEntidad, isPending: isCreating } = useMutation({
    mutationFn: async (formData: EntidadBancariaFormType) => {
      const res = await Api.post("/entidad-bancaria", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Entidad bancaria registrada exitosamente");
      refetchEntidades();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la entidad bancaria");
    },
  });

  // 3. Edit Bank Mutation
  const { mutate: editEntidad, isPending: isEditing } = useMutation({
    mutationFn: async ({ entidadId, formData }: { entidadId: number; formData: EntidadBancariaFormType }) => {
      const res = await Api.patch(`/entidad-bancaria/${entidadId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Entidad bancaria actualizada exitosamente");
      refetchEntidades();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la entidad bancaria");
    },
  });

  // 4. Delete Bank Mutation
  const { mutate: deleteEntidad, isPending: isDeleting } = useMutation({
    mutationFn: async (entidadId: number) => {
      const res = await Api.delete(`/entidad-bancaria/${entidadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Entidad bancaria eliminada exitosamente");
      refetchEntidades();
    },
    onError: () => {
      toast.error("Error al eliminar la entidad bancaria");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedEntidad(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (entidadData: EntidadBancariaData) => {
    setSelectedEntidad(entidadData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: EntidadBancariaFormType) => {
    if (selectedEntidad) {
      editEntidad({ entidadId: selectedEntidad.entidadId, formData });
    } else {
      createEntidad(formData);
    }
  };

  const handleDeleteEntidad = (entidadId: number) => {
    setConfirmModal({ isOpen: true, idToDelete: entidadId });
  };

  return (
    <AdminLayout title="Entidades Bancarias">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">

        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
              <FiPlusSquare className="text-zinc-550" />
              <span>Listado de Entidades Bancarias</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Entidades financieras registradas en el sistema</p>
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
              <span>Registrar Entidad</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingEntidades ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de entidades...
            </div>
          ) : filteredEntidades.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron entidades coincidentes." : "No hay entidades bancarias registradas."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5 w-24">ID</th>
                  <th className="px-6 py-3.5">Nombre de la Entidad</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredEntidades.map((ent) => (
                  <tr
                    key={ent.entidadId}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      #{ent.entidadId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {ent.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(ent)}
                          title="Editar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntidad(ent.entidadId)}
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

      {/* Entidad Form Modal */}
      <AdminEntidadBancariaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        entidadToEdit={selectedEntidad}
        isLoading={isCreating || isEditing || isDeleting}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message="¿Está seguro de eliminar esta entidad bancaria?"
        onConfirm={() => {
          if (confirmModal.idToDelete !== null) {
            deleteEntidad(confirmModal.idToDelete);
            setConfirmModal({ isOpen: false, idToDelete: null });
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, idToDelete: null })}
      />
    </AdminLayout>
  );
}
