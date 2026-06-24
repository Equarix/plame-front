"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { AdminSidebarContent } from "./AdminSidebarContent";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close the mobile menu on path changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-bento-surface dark:bg-zinc-950 font-sans flex text-zinc-900 dark:text-zinc-50 overflow-hidden">
      
      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer container */}
          <div
            className="absolute top-0 bottom-0 left-0 w-64 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between border-r border-zinc-200/50 dark:border-zinc-800/50 transition-transform duration-300 ease-out transform translate-x-0"
          >
            {/* Close button inside drawer */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 rounded-bento-control hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-colors cursor-pointer"
              aria-label="Cerrar menú"
            >
              <FiX className="text-base" />
            </button>
            
            <AdminSidebarContent
              pathname={pathname}
              user={user}
              logout={logout}
              onLinkClick={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ASIDE (Sidebar) - Bento Styled Desktop */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-between p-5 shrink-0 hidden md:flex">
        <AdminSidebarContent
          pathname={pathname}
          user={user}
          logout={logout}
        />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto min-h-screen">
        
        {/* Top Header */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50 sticky top-0 z-30 p-4 sm:px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-8 h-8 rounded-bento-control bg-bento-primary text-zinc-950 flex md:hidden items-center justify-center font-bold cursor-pointer hover:bg-bento-primary/95 transition-all shadow-sm"
              aria-label="Abrir menú"
            >
              <FiMenu className="text-base" />
            </button>
            <h2 className="text-sm sm:text-base font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={logout}
              className="flex md:hidden items-center gap-1.5 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-xs font-semibold text-zinc-600 dark:text-zinc-300 cursor-pointer hover:text-bento-danger hover:bg-bento-danger/5 transition-all"
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

