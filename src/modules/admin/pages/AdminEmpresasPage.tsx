"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminEmpresaModal } from "../components/AdminEmpresaModal";
import { type EmpresaFormType } from "../schemas/empresa.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, EmpresaData } from "@/interface/response.interface";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiBriefcase,
} from "react-icons/fi";

export function AdminEmpresasPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<EmpresaData | undefined>(undefined);

  // 1. Fetch Companies List using React Query
  const {
    data: empresasApiResponse,
    isLoading: isLoadingEmpresas,
    refetch: refetchEmpresas,
  } = useQuery<ApiResponse<EmpresaData[]>>({
    queryKey: ["admin-t-empresa", token],
    queryFn: async () => {
      const res = await Api.get("/t-empresa?page=1&limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const empresasList = empresasApiResponse?.body || [];

  // Filter companies based on search query
  const filteredEmpresas = empresasList.filter((emp) => {
    const nameMatch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
    const rucMatch = emp.ruc.toLowerCase().includes(searchQuery.toLowerCase());
    const addressMatch = emp.address.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || rucMatch || addressMatch;
  });

  // 2. Create Company Mutation
  const { mutate: createEmpresa, isPending: isCreating } = useMutation({
    mutationFn: async (formData: EmpresaFormType) => {
      const res = await Api.post("/t-empresa", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Empresa registrada exitosamente");
      refetchEmpresas();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar la empresa");
    },
  });

  // 3. Edit Company Mutation
  const { mutate: editCompany, isPending: isEditing } = useMutation({
    mutationFn: async ({ companyId, formData }: { companyId: number; formData: EmpresaFormType }) => {
      const res = await Api.put(`/t-empresa/${companyId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Empresa actualizada exitosamente");
      refetchEmpresas();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar la empresa");
    },
  });

  // 4. Delete Company Mutation
  const { mutate: deleteEmpresa, isPending: isDeleting } = useMutation({
    mutationFn: async (companyId: number) => {
      const res = await Api.delete(`/t-empresa/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Empresa eliminada exitosamente");
      refetchEmpresas();
    },
    onError: () => {
      toast.error("Error al eliminar la empresa");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedEmpresa(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (empresaData: EmpresaData) => {
    setSelectedEmpresa(empresaData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: EmpresaFormType) => {
    if (selectedEmpresa) {
      editCompany({ companyId: selectedEmpresa.companyId, formData });
    } else {
      createEmpresa(formData);
    }
  };

  const handleDeleteEmpresa = (companyId: number) => {
    if (window.confirm("¿Está seguro de eliminar esta empresa?")) {
      deleteEmpresa(companyId);
    }
  };

  return (
    <AdminLayout title="Gestión de Empresas">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">

        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base flex items-center gap-2">
              <FiBriefcase className="text-zinc-500" />
              <span>Listado de Empresas</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Empresas registradas en la planilla electrónica</p>
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
                placeholder="Buscar por nombre, RUC..."
                className="block w-full sm:w-64 text-xs bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50 h-9 pl-9 pr-3"
              />
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-bento-secondary hover:opacity-95 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-bento-control shadow-md transition-all cursor-pointer border border-zinc-900/10 shrink-0"
            >
              <FiPlus className="text-sm" />
              <span>Registrar Empresa</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingEmpresas ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de empresas...
            </div>
          ) : filteredEmpresas.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron empresas coincidentes." : "No hay empresas registradas."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5">Razón Social / Nombre</th>
                  <th className="px-6 py-3.5">Número de RUC</th>
                  <th className="px-6 py-3.5">Dirección Fiscal</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredEmpresas.map((emp) => (
                  <tr
                    key={emp.companyId}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {emp.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">
                      {emp.ruc}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {emp.address}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(emp)}
                          title="Editar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteEmpresa(emp.companyId)}
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

      {/* Empresa Form Modal */}
      <AdminEmpresaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        empresaToEdit={selectedEmpresa}
        isLoading={isCreating || isEditing || isDeleting}
      />
    </AdminLayout>
  );
}
