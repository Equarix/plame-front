import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";

export function TrabajadorTab() {
  return (
    <Accordion type="single" defaultValue="datos-laborales" className="mt-2">
      <AccordionItem value="datos-laborales">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-bento-secondary rounded-full"></span>
            <span className="text-zinc-900 dark:text-zinc-50 font-bold">Datos laborales</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
            {/* Panel Izquierdo */}
            <div className="space-y-6">
              {/* Periodo Laboral */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Periodo laboral</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput label="Fecha de Inicio" name="fechaInicio" type="date" value="2025-03-01" readOnly />
                  <FormInput label="Fecha de Fin" name="fechaFin" type="date" placeholder="dd/mm/aaaa" />
                </div>
                <FormSelect
                  label="Motivo de baja del registro"
                  name="motivoBaja"
                  options={[
                    { value: "RENUNCIA", label: "RENUNCIA" },
                    { value: "DESPIDO", label: "DESPIDO" },
                    { value: "MUTUO_DISENSO", label: "MUTUO DISENSO" },
                    { value: "JUBILACION", label: "JUBILACIÓN" },
                  ]}
                />
              </div>

              {/* Tipo de Trabajador */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Clasificación de Puesto</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormSelect
                    label="Tipo de trabajador"
                    name="tipoTrabajador"
                    options={[
                      { value: "EMPLEADO", label: "EMPLEADO" },
                      { value: "OBRERO", label: "OBRERO" },
                      { value: "EJECUTIVO", label: "EJECUTIVO" },
                    ]}
                    value="EMPLEADO"
                    disabled
                  />
                  <FormInput label="Fecha de Inicio del Tipo" name="fechaInicioTipo" type="date" value="2025-03-01" readOnly />
                </div>
              </div>

              {/* Régimen & Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Régimen laboral"
                  name="regimenLaboral"
                  options={[
                    { value: "MICROEMPRESA", label: "MICROEMPRESA" },
                    { value: "PEQUEÑA_EMPRESA", label: "PEQUEÑA EMPRESA" },
                    { value: "REGIMEN_GENERAL", label: "RÉGIMEN GENERAL (DECRETO LEG. 728)" },
                  ]}
                  value="MICROEMPRESA"
                  disabled
                />
                <FormSelect
                  label="Categoría ocupacional"
                  name="categoriaOcupacional"
                  options={[
                    { value: "EMPLEADO", label: "EMPLEADO" },
                    { value: "OBRERO", label: "OBRERO" },
                    { value: "FUNCIONARIO", label: "FUNCIONARIO/DIRECTIVO" },
                  ]}
                  value="EMPLEADO"
                  disabled
                />
              </div>

              {/* Ocupación */}
              <div className="grid grid-cols-3 gap-4">
                <FormInput label="Código" name="ocupacionCod" value="268001" readOnly />
                <div className="col-span-2">
                  <FormSelect
                    label="Nombre de Ocupación"
                    name="ocupacionNombre"
                    options={[{ value: "268001", label: "PSICOLOGO" }]}
                    value="268001"
                    disabled
                  />
                </div>
              </div>

              {/* Tipo de contrato */}
              <FormSelect
                label="Tipo de contrato"
                name="tipoContrato"
                options={[
                  { value: "POR_INICIO_DE_ACTIVIDAD", label: "POR INICIO O INCREM DE ACTIV" },
                  { value: "PLAZO_INDETERMINADO", label: "CONTRATO A PLAZO INDETERMINADO" },
                ]}
                value="POR_INICIO_DE_ACTIVIDAD"
                disabled
              />

              {/* Pago & Entidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Tipo de pago"
                  name="tipoPago"
                  options={[{ value: "DEPOSITO", label: "DEPÓSITO EN CUENTA" }]}
                  value="DEPOSITO"
                  disabled
                />
                <FormSelect
                  label="Periodicidad de ingreso"
                  name="periodoIngreso"
                  options={[{ value: "MENSUAL", label: "MENSUAL" }]}
                  value="MENSUAL"
                  disabled
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Entidad y cuenta bancaria"
                  name="banco"
                  options={[{ value: "BCP", label: "BANCO DE CREDITO DEL PERU" }]}
                  value="BCP"
                  disabled
                />
                <FormInput label="Cuenta Bancaria" name="cuenta" value="19306186256042" readOnly />
              </div>
              <FormInput label="Monto de remuneración básica inicial" name="montoRemuneracion" type="number" value="1130" readOnly />
            </div>

            {/* Panel Derecho */}
            <div className="space-y-6">
              {/* Establecimiento */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Establecimiento donde labora</h4>
                <FormSelect
                  label="Establecimiento"
                  name="establecimiento"
                  options={[{ value: "PRINCIPAL", label: "SEDE PRINCIPAL - LIMA" }]}
                  value="PRINCIPAL"
                  disabled
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormInput label="Cod. Local" name="codLocal" value="0000" readOnly />
                  <div className="col-span-2">
                    <FormInput label="Local" name="localTipo" value="DOMICILIO FISCAL" readOnly />
                  </div>
                </div>
              </div>

              {/* Jornada Laboral */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-3 bg-zinc-50/10 dark:bg-zinc-850/5">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Jornada laboral</h4>
                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-350 font-semibold cursor-pointer">
                  <input type="checkbox" defaultChecked disabled className="rounded border-zinc-350 dark:border-zinc-700 text-bento-secondary focus:ring-bento-secondary/20" />
                  Jornada de trabajo máxima
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-350 font-semibold cursor-pointer">
                  <input type="checkbox" disabled className="rounded border-zinc-350 dark:border-zinc-700 text-bento-secondary focus:ring-bento-secondary/20" />
                  Jornada atípica o acumulativa
                </label>
                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-350 font-semibold cursor-pointer">
                  <input type="checkbox" disabled className="rounded border-zinc-350 dark:border-zinc-700 text-bento-secondary focus:ring-bento-secondary/20" />
                  Trabajo en horario nocturno
                </label>
              </div>

              {/* Situación Especial */}
              <FormSelect
                label="Situación especial"
                name="situacionEspecial"
                options={[{ value: "NINGUNA", label: "NINGUNA" }]}
                value="NINGUNA"
                disabled
              />

              {/* Discapacidad & Sindicalizado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none">
                    ¿Persona con discapacidad?
                  </label>
                  <div className="flex gap-4 items-center h-11">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input type="radio" name="discapacidad" value="SI" disabled className="text-bento-secondary focus:ring-bento-secondary/20" /> Sí
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input type="radio" name="discapacidad" value="NO" defaultChecked disabled className="text-bento-secondary focus:ring-bento-secondary/20" /> No
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none">
                    ¿Sindicalizado?
                  </label>
                  <div className="flex gap-4 items-center h-11">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input type="radio" name="sindicalizado" value="SI" disabled className="text-bento-secondary focus:ring-bento-secondary/20" /> Sí
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                      <input type="radio" name="sindicalizado" value="NO" defaultChecked disabled className="text-bento-secondary focus:ring-bento-secondary/20" /> No
                    </label>
                  </div>
                </div>
              </div>

              {/* Situación */}
              <FormInput label="Situación" name="situacion" value="Activo" readOnly disabled />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
