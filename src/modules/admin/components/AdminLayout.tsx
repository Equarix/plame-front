"use client";

import { useAuth } from "@/components/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUsers,
  FiLogOut,
  FiHome,
  FiShield,
  FiBriefcase,
  FiPlusSquare,
  FiBookOpen,
} from "react-icons/fi";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex text-zinc-900 dark:text-zinc-50 overflow-hidden">
      
      {/* ASIDE (Sidebar) - Bento Styled */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
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
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-bento-control text-xs font-bold transition-all cursor-pointer ${
                pathname === "/admin/situaciones-academicas"
                  ? "bg-bento-secondary text-zinc-950 shadow-sm border border-zinc-900/5"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-850"
              }`}
            >
              <FiBookOpen className="text-base" />
              <span>Situaciones Académicas</span>
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
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-30 p-4 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger Indicator */}
            <div className="w-7 h-7 rounded-bento-control bg-bento-primary text-zinc-950 flex md:hidden items-center justify-center font-bold">
              A
            </div>
            <h2 className="text-base font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex md:hidden items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer"
            >
              <FiLogOut />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
}
