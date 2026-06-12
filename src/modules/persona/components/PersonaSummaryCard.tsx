import React from "react";
import { FiUser, FiPlus } from "react-icons/fi";
import type { PersonaData } from "@/interface/response.interface";
import { formatDireccion } from "@/utils/address";

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function DetailField({
  label,
  value,
  className = "",
  valueClassName = "text-zinc-800 dark:text-zinc-200 uppercase",
}: DetailFieldProps) {
  return (
    <div className={className}>
      <span className="font-semibold text-zinc-400 dark:text-zinc-500 block mb-0.5">{label}</span>
      <span className={`font-bold ${valueClassName}`}>{value}</span>
    </div>
  );
}

interface PersonaSummaryCardProps {
  persona: PersonaData;
  onCambiarPersona?: () => void;
  telefono?: string;
  onChangeTelefono?: (val: string) => void;
  email?: string;
  onChangeEmail?: (val: string) => void;
  onAddAddress?: () => void;
}

export function PersonaSummaryCard({
  persona,
  onCambiarPersona,
  telefono,
  onChangeTelefono,
  email,
  onChangeEmail,
  onAddAddress,
}: PersonaSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200/40 dark:border-zinc-800/40 pb-3.5 mb-5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-bento-control bg-bento-secondary/15 text-bento-secondary flex items-center justify-center shrink-0">
            <FiUser className="text-base" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none text-sm">
              Datos de Identificación de la Persona
            </h4>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 leading-none">
              Información actual registrada en el sistema
            </p>
          </div>
        </div>
        {onCambiarPersona && (
          <button
            onClick={onCambiarPersona}
            className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-bento-secondary/50 rounded-bento-control text-xs font-bold text-zinc-650 dark:text-zinc-300 hover:text-bento-secondary transition-all cursor-pointer shadow-sm"
          >
            Cambiar Persona
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-xs">
        <DetailField
          label="Tipo y Número de Documento"
          value={`L.E / DNI - ${persona.dni}`}
          valueClassName="text-zinc-800 dark:text-zinc-200"
        />
        <DetailField
          label="Fecha de Nacimiento"
          value={persona.fechaNacimiento
            ? new Date(persona.fechaNacimiento).toLocaleDateString("es-PE", { timeZone: "UTC" })
            : "-"}
        />
        <DetailField
          label="País emisor de Documento"
          value="PERÚ"
          valueClassName="text-zinc-800 dark:text-zinc-200"
        />

        <div className="sm:col-span-2 md:col-span-3 border-t border-zinc-150/40 dark:border-zinc-800/40 my-1"></div>

        <DetailField
          label="Apellidos y Nombres"
          value={`${persona.apellidoPaterno} ${persona.apellidoMaterno}, ${persona.nombres}`}
          valueClassName="text-zinc-850 dark:text-zinc-100 uppercase"
        />
        <DetailField
          label="Sexo"
          value={persona.sexo}
        />
        <DetailField
          label="Estado Civil"
          value={persona.estadoCivil}
        />

        <div className="sm:col-span-2 md:col-span-3 border-t border-zinc-150/40 dark:border-zinc-800/40 my-1"></div>

        <DetailField
          label="Nacionalidad"
          value={persona.nacionalidad}
        />

        {onChangeTelefono ? (
          <div>
            <span className="font-semibold text-zinc-400 dark:text-zinc-500 block mb-0.5">Teléfono (código y número)</span>
            <input
              type="text"
              value={telefono || ""}
              onChange={(e) => onChangeTelefono(e.target.value)}
              placeholder="e.g. 999999999"
              className="mt-0.5 block w-full text-xs font-bold bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 px-2.5 h-8 focus:outline-none focus:ring-1 focus:ring-bento-secondary focus:border-bento-secondary"
            />
          </div>
        ) : (
          <DetailField
            label="Teléfono (código y número)"
            value={persona.telefono || "-"}
            valueClassName="text-zinc-800 dark:text-zinc-200"
          />
        )}

        {onChangeEmail ? (
          <div>
            <span className="font-semibold text-zinc-400 dark:text-zinc-500 block mb-0.5">Correo electrónico</span>
            <input
              type="email"
              value={email || ""}
              onChange={(e) => onChangeEmail(e.target.value)}
              placeholder="e.g. prestador@ejemplo.com"
              className="mt-0.5 block w-full text-xs font-bold bg-white/70 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-bento-control text-zinc-900 dark:text-zinc-100 px-2.5 h-8 focus:outline-none focus:ring-1 focus:ring-bento-secondary focus:border-bento-secondary"
            />
          </div>
        ) : (
          <DetailField
            label="Correo electrónico"
            value={persona.email || "-"}
            valueClassName="text-zinc-800 dark:text-zinc-200"
          />
        )}

        <div className="sm:col-span-2 md:col-span-3 border-t border-zinc-150/40 dark:border-zinc-800/40 my-1"></div>

        <DetailField
          label="Primera dirección"
          value={persona.direcciones && persona.direcciones.length > 0
            ? formatDireccion(persona.direcciones[0])
            : "-"}
          className="sm:col-span-2"
          valueClassName="text-zinc-850 dark:text-zinc-100 break-words block"
        />
        {persona.direcciones && persona.direcciones.length > 1 ? (
          <DetailField
            label="Segunda dirección"
            value={formatDireccion(persona.direcciones[1])}
            valueClassName="text-zinc-850 dark:text-zinc-100 block"
          />
        ) : (
          <div>
            <span className="font-semibold text-zinc-400 dark:text-zinc-500 block mb-0.5">Segunda dirección</span>
            {onAddAddress ? (
              <button
                type="button"
                onClick={onAddAddress}
                className="mt-1 px-3 py-1.5 border border-dashed border-zinc-300 hover:border-bento-secondary/70 rounded-bento-control text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-bento-secondary transition-all cursor-pointer shadow-sm w-full text-center flex items-center justify-center gap-1.5 bg-zinc-50/50 dark:bg-zinc-850/50"
              >
                <FiPlus className="text-sm" /> Añadir Dirección
              </button>
            ) : (
              <span className="font-bold text-zinc-850 dark:text-zinc-100 block">-</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
