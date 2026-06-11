"use client";

import type { ReactNode } from "react";

export interface DashboardTableColumn<T> {
  header: string;
  render: (item: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface DashboardTableCardProps<T> {
  title: string;
  description?: string;
  action?: ReactNode;
  columns: DashboardTableColumn<T>[];
  data: T[];
  getRowKey: (item: T, index: number) => string | number;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function DashboardTableCard<T>({
  title,
  description,
  action,
  columns,
  data,
  getRowKey,
  emptyStateTitle = "Sin registros",
  emptyStateDescription = "No hay datos para mostrar en este momento.",
}: DashboardTableCardProps<T>) {
  return (
    <div className="bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-5 border-b border-zinc-200/30 dark:border-zinc-800/50 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-bold text-bento-text dark:text-zinc-50 text-base">
            {title}
          </h3>
          {description ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>

      <div className="overflow-x-auto">
        {data.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-100/40 dark:bg-zinc-950/30 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase border-b border-zinc-200/30 dark:border-zinc-800/50">
                {columns.map((column) => (
                  <th
                    key={column.header}
                    className={column.headerClassName ?? "px-6 py-3.5"}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/30 dark:divide-zinc-800/50 text-sm">
              {data.map((item, index) => (
                <tr
                  key={getRowKey(item, index)}
                  className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/20 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.header}
                      className={column.cellClassName ?? "px-6 py-4"}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-10 text-center">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {emptyStateTitle}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {emptyStateDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}