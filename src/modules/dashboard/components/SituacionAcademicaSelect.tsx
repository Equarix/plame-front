import React, { useCallback } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import type {
  ApiResponse,
  SituacionAcademicaData,
} from "@/interface/response.interface";
import type { EstudiosInput } from "@/modules/dashboard/hooks/useTRegistroForm";
import { EstudiosModal } from "./EstudiosModal";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface SituacionAcademicaSelectProps {
  estudios: EstudiosInput[];
  onEstudiosChange: (estudios: EstudiosInput[]) => void;
}

export function SituacionAcademicaSelect({
  estudios,
  onEstudiosChange,
}: SituacionAcademicaSelectProps) {
  const { token } = useAuth();
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const selectedId = useWatch({
    name: "situacionEducativaId",
    control,
  });

  const { data, isLoading } = useQuery<ApiResponse<SituacionAcademicaData[]>>({
    queryKey: ["situaciones-academicas-public"],
    queryFn: async () => {
      const res = await Api.get("/situaciones-academicas/public", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const situaciones = data?.body || [];

  const selectedSituacion = situaciones.find(
    (s) => s.situacionEducativaId === Number(selectedId),
  );
  const requiereEstudios = selectedSituacion?.requiereEstudios === true;
  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  const handleRemove = (index: number) => {
    onEstudiosChange(estudios.filter((_, i) => i !== index));
  };

  const handleAddEstudio = (nuevo: EstudiosInput) => {
    onEstudiosChange([...estudios, nuevo]);
  };

  return (
    <>
      <div className="space-y-4">
        {/* ── Situación Educativa Select ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 select-none">
            Situación Educativa
          </label>
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center h-11 px-3.5 border border-zinc-200 dark:border-zinc-800 rounded-bento-control bg-white/70 dark:bg-zinc-900/50">
                <span className="w-4 h-4 border-2 border-bento-secondary border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-xs text-zinc-400">
                  Cargando situaciones...
                </span>
              </div>
            ) : (
              <Controller
                name="situacionEducativaId"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                    className={`block w-full text-sm bg-white/70 dark:bg-zinc-900/50 border rounded-bento-control text-zinc-900 dark:text-zinc-100 pl-3.5 pr-9 h-11 focus:outline-none focus:ring-2 transition-all duration-200 appearance-none ${
                      errors.situacionEducativaId
                        ? "border-bento-danger focus:ring-bento-danger/20"
                        : "border-zinc-200 dark:border-zinc-800 focus:ring-bento-secondary/20 focus:border-bento-secondary"
                    }`}
                  >
                    <option value="">
                      -- Seleccione la situación educativa --
                    </option>
                    {situaciones.map((s) => (
                      <option
                        key={s.situacionEducativaId}
                        value={s.situacionEducativaId}
                      >
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                )}
              />
            )}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
          {errors.situacionEducativaId && (
            <p className="text-xs text-bento-danger font-medium flex items-center gap-1.5 animate-fadeIn">
              <span className="inline-block w-1 h-1 rounded-full bg-bento-danger" />
              {errors.situacionEducativaId.message as string}
            </p>
          )}
        </div>

        {/* ── Tabla de estudios (inline, solo si requiereEstudios) ── */}
        {requiereEstudios && (
          <div className="animate-fadeIn space-y-2">
            {/* Header de la sección */}
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
                  Relación de Estudios Concluidos
                </p>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                  Sólo puede incluir hasta cinco registros de formación superior
                  completa.
                </p>
              </div>
              {estudios.length < 5 && (
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-bento-secondary hover:opacity-90 text-zinc-950 rounded-bento-control text-xs font-extrabold shadow-sm transition-all cursor-pointer border border-zinc-900/10 shrink-0"
                >
                  <FiPlus className="text-xs" />
                  Adicionar
                </button>
              )}
            </div>

            {/* Tabla */}
            <div className="rounded-bento-card border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-850 border-b border-zinc-200/50 dark:border-zinc-800/50">
                      {[
                        "N°",
                        "Formación",
                        "¿Perú?",
                        "Régimen",
                        "Tipo",
                        "Institución",
                        "Carrera",
                        "Año Egr.",
                        "",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-3 py-2.5 text-left font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {estudios.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-3 py-6 text-center text-xs text-zinc-400 dark:text-zinc-500 italic"
                        >
                          No se han registrado estudios. Haga clic en
                          &ldquo;Adicionar&rdquo; para agregar.
                        </td>
                      </tr>
                    ) : (
                      estudios.map((e, i) => (
                        <tr
                          key={i}
                          className="border-b border-zinc-100 dark:border-zinc-800/50 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-850/50 transition-colors"
                        >
                          <td className="px-3 py-2.5 text-zinc-500 dark:text-zinc-400 font-mono">
                            {i + 1}
                          </td>
                          <td className="px-3 py-2.5 font-semibold text-zinc-800 dark:text-zinc-200 max-w-[160px] truncate">
                            {e.formacionCompleta === "SUPERIOR_COMPLETA"
                              ? "SUPERIOR COMPLETA"
                              : "UNIVERSITARIA COMPLETA"}
                          </td>
                          <td className="px-3 py-2.5 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            {e.estudioPeru ? "Sí" : "No"}
                          </td>
                          <td className="px-3 py-2.5 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            {e.privado ? "Privado" : "Público"}
                          </td>
                          <td className="px-3 py-2.5 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                            {e.tipoEducacion}
                          </td>
                          <td className="px-3 py-2.5 text-zinc-800 dark:text-zinc-200 max-w-[140px] truncate">
                            {e.nombreInstitucion}
                          </td>
                          <td className="px-3 py-2.5 text-zinc-800 dark:text-zinc-200 max-w-[140px] truncate">
                            {e.nombreCarrera}
                          </td>
                          <td className="px-3 py-2.5 text-zinc-600 dark:text-zinc-400 whitespace-nowrap font-mono">
                            {e.añoEgreso}
                          </td>
                          <td className="px-3 py-2.5">
                            <button
                              type="button"
                              onClick={() => handleRemove(i)}
                              className="p-1 hover:bg-bento-danger/10 text-zinc-400 hover:text-bento-danger rounded transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <FiTrash2 className="text-sm" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {estudios.length >= 5 && (
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 italic text-right">
                Se alcanzó el máximo de 5 registros.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal solo para agregar un nuevo estudio */}
      {isModalOpen && (
        <EstudiosModal onClose={handleCloseModal} onAdd={handleAddEstudio} />
      )}
    </>
  );
}
