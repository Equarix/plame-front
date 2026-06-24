"use client";

import Link from "next/link";
import {
  FiUsers,
  FiLogOut,
  FiHome,
  FiShield,
  FiBriefcase,
  FiPlusSquare,
  FiBookOpen,
  FiSliders,
} from "react-icons/fi";
import type { AuthResponse } from "@/interface/response.interface";

interface AdminSidebarContentProps {
  pathname: string;
  user: AuthResponse | undefined;
  logout: () => void;
  onLinkClick?: () => void;
}

export function AdminSidebarContent({
  pathname,
  user,
  logout,
  onLinkClick,
}: AdminSidebarContentProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-8">
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-bento-control bg-zinc-950 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-950 shadow-md">
            <FiShield className="text-lg" />
          </div>
          <div>
            <span className="font-extrabold text-zinc-900 dark:text-zinc-50 text-base tracking-tight block">
              Área Admin
            </span>
            <span className="text-[9px] font-bold text-bento-secondary dark:text-bento-secondary/80 uppercase tracking-widest block mt-0.5">
              Consola Central
            </span>
          </div>
        </div>

        {/* Navigation Options */}
        <nav className="flex flex-col gap-1.5">
          <Link
            href="/admin"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiHome className="text-base" />
            <span>Inicio</span>
          </Link>
          <Link
            href="/admin/usuarios"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/usuarios"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiUsers className="text-base" />
            <span>Gestión de Usuarios</span>
          </Link>
          <Link
            href="/admin/personas"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/personas"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiUsers className="text-base" />
            <span>Gestión de Personas</span>
          </Link>
          <Link
            href="/admin/empresas"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/empresas"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiBriefcase className="text-base" />
            <span>Gestión de Empresas</span>
          </Link>
          <Link
            href="/admin/entidades-bancarias"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/entidades-bancarias"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiPlusSquare className="text-base" />
            <span>Entidades Bancarias</span>
          </Link>
          <Link
            href="/admin/ocupaciones"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/ocupaciones"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiBriefcase className="text-base" />
            <span>Ocupaciones</span>
          </Link>
          <Link
            href="/admin/situaciones-academicas"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/situaciones-academicas"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiBookOpen className="text-base" />
            <span>Situaciones Académicas</span>
          </Link>
          <Link
            href="/admin/conceptos"
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
              pathname === "/admin/conceptos"
                ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
            }`}
          >
            <FiSliders className="text-base" />
            <span>Gestión de Conceptos</span>
          </Link>
        </nav>
      </div>

      {/* Aside Footer / User Info */}
      <div className="pt-4 border-t border-zinc-200/40 dark:border-zinc-800/40 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-bento-control bg-bento-primary flex items-center justify-center text-zinc-900 font-black text-xs">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {user ? `${user.name} ${user.lastName}` : "Administrador"}
            </p>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate uppercase">
              {user ? user.role : "ADMIN"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full py-2 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-bold text-zinc-500 hover:text-bento-danger hover:border-bento-danger/30 hover:bg-bento-danger/5 transition-all cursor-pointer"
        >
          <FiLogOut className="text-sm" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
