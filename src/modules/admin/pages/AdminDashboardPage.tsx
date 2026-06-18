"use client";

import { useAuth } from "@/components/context/AuthContext";
import { AdminLayout } from "../components/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import type { ApiResponse, UserData } from "@/interface/response.interface";
import {
  FiUsers,
  FiActivity,
  FiInfo,
} from "react-icons/fi";

export function AdminDashboardPage() {
  const { token } = useAuth();

  // Fetch Users List (just for counting total users)
  const {
    data: usersApiResponse,
    isLoading: isLoadingUsers,
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

  return (
    <AdminLayout title="Panel de Control Administrador">
      <div className="flex flex-col gap-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Stat 1: Total Users */}
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Cuentas Activas</span>
              <div className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex items-center justify-center">
                <FiUsers className="text-base" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-zinc-950 dark:text-zinc-100">
                {isLoadingUsers ? "..." : usersList.length}
              </p>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 font-semibold">Usuarios registrados en PLAME</p>
            </div>
          </div>

          {/* Stat 2: Version Info */}
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Versión del Sistema</span>
              <div className="w-8 h-8 rounded-bento-control bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FiInfo className="text-base" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black text-blue-600 dark:text-blue-400">v1.0.0</p>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-semibold">Versión actual de PLAME</p>
            </div>
          </div>

        </div>

        {/* Bento Row 2: Information and logs */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Large Info Card */}
          <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">Seguridad Administrativa y Auditoría</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                El panel de administración permite registrar nuevos usuarios contribuyentes al sistema, así como editar o inactivar cuentas según las solicitudes de los usuarios o las auditorías internas de SUNAT. Cada operación realizada en este panel requiere autenticación JWT con firma de administrador.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-bento-secondary dark:text-bento-secondary bg-bento-secondary/10 w-fit px-3 py-1.5 rounded-bento-control">
              <FiActivity className="text-sm" />
              <span>Registro de logs activo en base de datos central</span>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
