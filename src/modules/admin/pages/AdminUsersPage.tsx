"use client";

import { useState } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { AdminUserModal } from "../components/AdminUserModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { type UserFormType } from "../schemas/user.schema";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { toast } from "sonner";
import type { ApiResponse, UserData } from "@/interface/response.interface";
import {
  FiUsers,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";

export function AdminUsersPage() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | undefined>(undefined);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; idToDelete: number | null }>({ isOpen: false, idToDelete: null });

  // 1. Fetch Users List using React Query
  const {
    data: usersApiResponse,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery<ApiResponse<UserData[]>>({
    queryKey: ["admin-all-users", token],
    queryFn: async () => {
      const res = await Api.get("/auth/all-users?page=1&limit=100", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const usersList = usersApiResponse?.body || [];

  // Filter users based on search query
  const filteredUsers = usersList.filter((usr) => {
    const fullName = `${usr.name} ${usr.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      usr.username.toLowerCase().includes(query) ||
      usr.role.toLowerCase().includes(query)
    );
  });

  // 2. Create User Mutation
  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: async (formData: UserFormType) => {
      const res = await Api.post("/auth/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Usuario registrado exitosamente");
      refetchUsers();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al registrar el usuario");
    },
  });

  // 3. Edit User Mutation
  const { mutate: editUser, isPending: isEditing } = useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: UserFormType }) => {
      const res = await Api.patch(`/auth/edit/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Usuario actualizado exitosamente");
      refetchUsers();
      setModalOpen(false);
    },
    onError: () => {
      toast.error("Error al actualizar el usuario");
    },
  });

  // 4. Inactivate (Delete) User Mutation
  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: async (id: number) => {
      const res = await Api.delete(`/auth/delete-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Usuario marcado como inactivo");
      refetchUsers();
    },
    onError: () => {
      toast.error("Error al inactivar el usuario");
    },
  });

  const handleOpenCreateModal = () => {
    setSelectedUser(undefined);
    setModalOpen(true);
  };

  const handleOpenEditModal = (userData: UserData) => {
    setSelectedUser(userData);
    setModalOpen(true);
  };

  const handleModalSubmit = (formData: UserFormType) => {
    if (selectedUser) {
      editUser({ id: selectedUser.userId, formData });
    } else {
      createUser(formData);
    }
  };

  const handleDeleteUser = (id: number) => {
    setConfirmModal({ isOpen: true, idToDelete: id });
  };

  return (
    <AdminLayout title="Gestión de Cuentas">
      <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">

        {/* Header inside bento card */}
        <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">Cuentas de Contribuyentes</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Listado general de usuarios activos y administradores</p>
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
                placeholder="Buscar por nombre, usuario..."
                className="block w-full sm:w-64 text-xs bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-bento-secondary/20 focus:border-bento-secondary dark:focus:border-bento-secondary/50 h-9 pl-9 pr-3"
              />
            </div>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-bento-secondary hover:opacity-95 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-bento-control shadow-md transition-all cursor-pointer border border-zinc-900/10 shrink-0"
            >
              <FiPlus className="text-sm" />
              <span>Registrar Usuario</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {isLoadingUsers ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Cargando listado de usuarios...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 dark:text-zinc-500">
              {searchQuery ? "No se encontraron usuarios coincidentes." : "No hay usuarios registrados en el sistema."}
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                  <th className="px-6 py-3.5">Nombre Completo</th>
                  <th className="px-6 py-3.5">Nombre de Usuario</th>
                  <th className="px-6 py-3.5">Rol</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
                {filteredUsers.map((usr) => (
                  <tr
                    key={usr.userId}
                    className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-200">
                      {usr.name} {usr.lastName}
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 font-mono">
                      {usr.username}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${usr.role === "ADMIN"
                          ? "text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/30"
                          : "text-blue-700 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/30"
                          }`}
                      >
                        {usr.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(usr.status !== false && usr.estado !== false) ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 uppercase tracking-wider">
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 uppercase tracking-wider">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(usr)}
                          title="Editar"
                          className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control hover:border-bento-secondary hover:bg-bento-secondary/5 text-zinc-500 hover:text-bento-secondary transition-colors cursor-pointer"
                        >
                          <FiEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usr.userId)}
                          title="Inactivar / Eliminar"
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

      {/* User Management Form Modal */}
      <AdminUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        userToEdit={selectedUser}
        isLoading={isCreating || isEditing || isDeleting}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        message="¿Está seguro de marcar a este usuario como inactivo?"
        onConfirm={() => {
          if (confirmModal.idToDelete !== null) {
            deleteUser(confirmModal.idToDelete);
            setConfirmModal({ isOpen: false, idToDelete: null });
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, idToDelete: null })}
      />
    </AdminLayout>
  );
}
