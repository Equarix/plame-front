"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminConceptoModal } from "../components/AdminConceptoModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { type ConceptoFormType } from "../schemas/concepto.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, ConceptoData } from "@/interface/response.interface";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiSliders,
} from "react-icons/fi";

export function AdminConceptosPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"TODOS" | "INGRESO" | "DESCUENTO" | "TRIBUTO">("TODOS");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConcepto, setSelectedConcepto] = useState<ConceptoData | undefined>(undefined);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; idToDelete: number | null }>({
    isOpen: false,
    idToDelete: null,
  });

  // 1. Fetch Concepts List using React Query
  const {
    data: conceptosApiResponse,
    isLoading: isLoadingConceptos,
    refetch: refetchConceptos,
  } = useQuery<ApiResponse<ConceptoData[]>>({
    queryKey: ["admin-conceptos", token],
    queryFn: async () => {
      const res = await Api.get("/conceptos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const conceptosList = conceptosApiResponse?.body || [];

  // Filter concepts based on search query and active tab
  const filteredConceptos = conceptosList.filter((con) => {
    const matchesSearch =
      con.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      con.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "TODOS" || con.tipo === activeTab;
    return matchesSearch && matchesTab;
  });

  // 2. Create Concept Mutation
  const { mutate: createConcepto, isPending: isCreating } = useMutation({
    mutationFn: async (formData: ConceptoFormType) => {
      // Map form fields to backend DTO structure
      const payload = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        tipo: formData.tipo,
        subConcepto: formData.tipo === "TRIBUTO" ? formData.subConcepto : undefined,
        porcentaje: formData.porcentaje ?? undefined,
      };
      const res = await Api.post("/conceptos", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Concepto registrado exitosamente");
      refetchConceptos();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar el concepto");
    },
  });

  // 3. Edit Concept Mutation
  const { mutate: editConcepto, isPending: isEditing } = useMutation({
    mutationFn: async ({ conceptoId, formData }: { conceptoId: number; formData: ConceptoFormType }) => {
      const payload = {
        nombre: formData.nombre,
        codigo: formData.codigo,
        tipo: formData.tipo,
        subConcepto: formData.tipo === "TRIBUTO" ? formData.subConcepto : null,
        porcentaje: formData.porcentaje ?? null,
      };
      const res = await Api.patch(`/conceptos/${conceptoId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Concepto actualizado exitosamente");
      refetchConceptos();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar el concepto");
    },
  });

  // 4. Delete Concept Mutation
  const { mutate: deleteConcepto, isPending: isDeleting } = useMutation({
    mutationFn: async (conceptoId: number) => {
      const res = await Api.delete(`/conceptos/${conceptoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Concepto eliminado exitosamente");
      refetchConceptos();
    },
    onError: () => {
      toast.error("Error al eliminar el concepto");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedConcepto(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (conceptoData: ConceptoData) => {
    setSelectedConcepto(conceptoData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: ConceptoFormType) => {
    if (selectedConcepto) {
      editConcepto({ conceptoId: selectedConcepto.conceptoId, formData });
    } else {
      createConcepto(formData);
    }
  };

  const handleDeleteConcepto = (conceptoId: number) => {
    setConfirmModal({ isOpen: true, idToDelete: conceptoId });
  };

  return (
    <AdminLayout title="Conceptos">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">
        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
              <FiSliders className="text-zinc-550" />
              <span>Listado de Conceptos</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Conceptos de remuneración, descuento y tributos del sistema
            </p>
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
                placeholder="Buscar por código o nombre..."
                className="block w-full sm:w-64 text-xs bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-888 rounded-bento-control text-zinc-950 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50 h-9 pl-9 pr-3"
              />
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-bento-secondary hover:opacity-95 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-bento-control shadow-md transition-all cursor-pointer border border-zinc-900/10 shrink-0"
            >
              <FiPlus className="text-sm" />
              <span>Registrar Concepto</span>
            </button>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-zinc-200/30 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-950/20 px-6 py-2.5 gap-2 overflow-x-auto">
          {(["TODOS", "INGRESO", "DESCUENTO", "TRIBUTO"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold rounded-bento-control transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-bento-secondary text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850"
              }`}
            >
              {tab === "TODOS"
                ? "Todos"
                : tab === "INGRESO"
                  ? "Ingresos"
                  : tab === "DESCUENTO"
                    ? "Descuentos"
                    : "Tributos"}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingConceptos ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de conceptos...
            </div>
          ) : filteredConceptos.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery || activeTab !== "TODOS"
                ? "No se encontraron conceptos coincidentes con los filtros seleccionados."
                : "No hay conceptos registrados."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5 w-24">Código</th>
                  <th className="px-6 py-3.5">Nombre del Concepto</th>
                  <th className="px-6 py-3.5">Tipo</th>
                  <th className="px-6 py-3.5">Subconcepto / Destino</th>
                  <th className="px-6 py-3.5 text-center">Porcentaje</th>
                  <th className="px-6 py-3.5 text-center">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredConceptos.map((con) => (
                  <tr
                    key={con.conceptoId}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-zinc-650 dark:text-zinc-300">
                      {con.codigo}
                    </td>
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {con.nombre}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          con.tipo === "INGRESO"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : con.tipo === "DESCUENTO"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {con.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400 font-medium">
                      {con.subTipo || "-"}
                    </td>
                    <td className="px-6 py-4 text-center font-mono font-medium text-zinc-700 dark:text-zinc-300">
                      {con.porcentaje !== null && con.porcentaje !== undefined
                        ? `${con.porcentaje}%`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          con.estado
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {con.estado ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(con)}
                          title="Editar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteConcepto(con.conceptoId)}
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

      {/* Concepto Form Modal */}
      <AdminConceptoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        conceptoToEdit={selectedConcepto}
        isLoading={isCreating || isEditing || isDeleting}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message="¿Está seguro de eliminar este concepto?"
        onConfirm={() => {
          if (confirmModal.idToDelete !== null) {
            deleteConcepto(confirmModal.idToDelete);
            setConfirmModal({ isOpen: false, idToDelete: null });
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, idToDelete: null })}
      />
    </AdminLayout>
  );
}
