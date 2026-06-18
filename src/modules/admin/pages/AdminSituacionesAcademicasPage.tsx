"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminSituacionAcademicaModal } from "../components/AdminSituacionAcademicaModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { type SituacionAcademicaFormType } from "../schemas/situacion-academica.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, SituacionAcademicaData } from "@/interface/response.interface";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiBookOpen,
} from "react-icons/fi";

export function AdminSituacionesAcademicasPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSituacion, setSelectedSituacion] = useState<SituacionAcademicaData | undefined>(undefined);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; idToDelete: number | null }>({ isOpen: false, idToDelete: null });

  // 1. Fetch Academic Situations List using React Query
  const {
    data: situacionesApiResponse,
    isLoading: isLoadingSituaciones,
    refetch: refetchSituaciones,
  } = useQuery<ApiResponse<SituacionAcademicaData[]>>({
    queryKey: ["admin-situaciones-academicas", token],
    queryFn: async () => {
      const res = await Api.get("/situaciones-academicas?page=1&limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const situacionesList = situacionesApiResponse?.body || [];

  // Filter based on search query
  const filteredSituaciones = situacionesList.filter((sit) => {
    return sit.nombre.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 2. Create Mutation
  const { mutate: createSituacion, isPending: isCreating } = useMutation({
    mutationFn: async (formData: SituacionAcademicaFormType) => {
      const res = await Api.post("/situaciones-academicas", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Situación académica registrada exitosamente");
      refetchSituaciones();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la situación académica");
    },
  });

  // 3. Edit Mutation
  const { mutate: editSituacion, isPending: isEditing } = useMutation({
    mutationFn: async ({
      situacionEducativaId,
      formData,
    }: {
      situacionEducativaId: number;
      formData: SituacionAcademicaFormType;
    }) => {
      const res = await Api.patch(`/situaciones-academicas/${situacionEducativaId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Situación académica actualizada exitosamente");
      refetchSituaciones();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la situación académica");
    },
  });

  // 4. Delete Mutation
  const { mutate: deleteSituacion, isPending: isDeleting } = useMutation({
    mutationFn: async (situacionEducativaId: number) => {
      const res = await Api.delete(`/situaciones-academicas/${situacionEducativaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Situación académica eliminada exitosamente");
      refetchSituaciones();
    },
    onError: () => {
      toast.error("Error al eliminar la situación académica");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedSituacion(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (situacionData: SituacionAcademicaData) => {
    setSelectedSituacion(situacionData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: SituacionAcademicaFormType) => {
    if (selectedSituacion) {
      editSituacion({
        situacionEducativaId: selectedSituacion.situacionEducativaId,
        formData,
      });
    } else {
      createSituacion(formData);
    }
  };

  const handleDeleteSituacion = (situacionEducativaId: number) => {
    setConfirmModal({ isOpen: true, idToDelete: situacionEducativaId });
  };

  return (
    <AdminLayout title="Situaciones Académicas">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">

        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
              <FiBookOpen className="text-zinc-550" />
              <span>Listado de Situaciones Académicas</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Situaciones educativas de contribuyentes en T-Registro</p>
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
              <span>Registrar Situación</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingSituaciones ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de situaciones...
            </div>
          ) : filteredSituaciones.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron situaciones coincidentes." : "No hay situaciones académicas registradas."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5 w-24">ID</th>
                  <th className="px-6 py-3.5">Nombre de la Situación</th>
                  <th className="px-6 py-3.5 w-48">Requiere Estudios Concluidos</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredSituaciones.map((sit) => (
                  <tr
                    key={sit.situacionEducativaId}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-zinc-400 dark:text-zinc-500">
                      #{sit.situacionEducativaId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {sit.nombre}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                          sit.requiereEstudios
                            ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/30"
                            : "text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800/50"
                        }`}
                      >
                        {sit.requiereEstudios ? "SÍ" : "NO"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(sit)}
                          title="Editar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteSituacion(sit.situacionEducativaId)}
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

      {/* Form Modal */}
      <AdminSituacionAcademicaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        situacionToEdit={selectedSituacion}
        isLoading={isCreating || isEditing || isDeleting}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message="¿Está seguro de eliminar esta situación académica?"
        onConfirm={() => {
          if (confirmModal.idToDelete !== null) {
            deleteSituacion(confirmModal.idToDelete);
            setConfirmModal({ isOpen: false, idToDelete: null });
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, idToDelete: null })}
      />
    </AdminLayout>
  );
}
