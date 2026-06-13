import React, { useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { OcupacionAutocomplete } from "@/components/forms/OcupacionAutocomplete";
import { BancoAutocomplete } from "@/components/forms/BancoAutocomplete";
import { SituacionAcademicaSelect } from "./SituacionAcademicaSelect";
import { useFormContext, useWatch } from "react-hook-form";
import { useAuth } from "@/components/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Api } from "@/lib/api";
import type { ApiResponse, EmpresaData } from "@/interface/response.interface";
import type { EstudiosInput } from "@/modules/dashboard/hooks/useTRegistroForm";
import {
  TIPOS_TRABAJADOR,
  REGIMENES_LABORALES,
  CATEGORIAS_PERSONA,
  TIPOS_CONTRATO,
  TIPOS_PAGO,
  PERIODOS_INGRESO,
  JORNADAS_LABORALES,
  REGIMENES_SALUD,
  REGIMENES_PENSIONARIOS,
} from "./utils/const-trabajador";

interface TrabajadorTabProps {
  estudios: EstudiosInput[];
  onEstudiosChange: (estudios: EstudiosInput[]) => void;
}

export function TrabajadorTab({ estudios, onEstudiosChange }: TrabajadorTabProps) {
  const { register, formState: { errors }, control, setValue, getValues } = useFormContext();
  const watchTipoPago = useWatch({ control, name: "tipoPago" });
  const watchRegimenPensionario = useWatch({ control, name: "regimenPensionario" });
  const watchSctr = useWatch({ control, name: "sctr" });

  const { token, companyId } = useAuth();

  // Fetch active company details to auto-populate the establishment
  const { data: publicCompaniesResponse } = useQuery<ApiResponse<EmpresaData[]>>({
    queryKey: ["public-companies", token],
    queryFn: async () => {
      const res = await Api.get("/t-empresa/public", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token && !!companyId,
  });

  const companiesList = publicCompaniesResponse?.body || [];
  const activeCompany = companiesList.find((c) => c.companyId === companyId);

  // Auto-populate establishment details and social security defaults on mount / activeCompany change
  useEffect(() => {
    // Skip setting default values if the form has already been initialized (like in Edit mode)
    if (getValues("fechaInicio")) {
      return;
    }

    if (activeCompany) {
      setValue("establecimiento", activeCompany.companyId);
    }
    setValue("codLocal", "0000");
    setValue("localTipo", "DOMICILIO FISCAL");
    setValue("situacion", "Activo");

    // Social Security default values
    const today = new Date().toISOString().split("T")[0];
    setValue("regimenSalud", "ESSALUD_REGULAR");
    setValue("fechaInicioSalud", today);
    setValue("regimenPensionario", "SIN_REGIMEN_PENSIONARIO");
    setValue("fechaInicioPensionario", today);
    setValue("sctr", "NO");
    setValue("fechaInicioSaludPension", today);

    // Datos tributarios — defaultean en No
    setValue("quintaCategoriaExonerada", "NO");
    setValue("evitaDobleImposicion", "NO");
  }, [activeCompany, setValue]);

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
                  <FormInput
                    label="Fecha de Inicio"
                    name="fechaInicio"
                    type="date"
                    register={register("fechaInicio")}
                    error={errors.fechaInicio?.message as string}
                  />
                  <FormInput
                    label="Fecha de Fin"
                    name="fechaFin"
                    type="date"
                    placeholder="dd/mm/aaaa"
                    register={register("fechaFin")}
                    error={errors.fechaFin?.message as string}
                  />
                </div>
                <FormSelect
                  label="Motivo de baja del registro"
                  name="motivoBaja"
                  register={register("motivoBaja")}
                  error={errors.motivoBaja?.message as string}
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
                    options={TIPOS_TRABAJADOR}
                    register={register("tipoTrabajador")}
                    error={errors.tipoTrabajador?.message as string}
                  />
                  <FormInput
                    label="Fecha de Inicio del Tipo"
                    name="fechaInicioTipo"
                    type="date"
                    register={register("fechaInicioTipo")}
                    error={errors.fechaInicioTipo?.message as string}
                  />
                </div>
              </div>

              {/* Régimen & Categoría */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Régimen laboral"
                  name="regimenLaboral"
                  options={REGIMENES_LABORALES}
                  register={register("regimenLaboral")}
                  error={errors.regimenLaboral?.message as string}
                  extraInputTriggerValue={"OTROS"}
                  extraInputName="rdb_descripcion_detalle"
                  extraInputLabel="Detalle del Régimen Laboral"
                  extraInputPlaceholder="Detalle del Régimen Laboral"
                  extraInputRegister={register("rdb_descripcion_detalle")}
                  extraInputError={errors.rdb_descripcion_detalle?.message as string}
                />
                <FormSelect
                  label="Categoría ocupacional"
                  name="categoriaOcupacional"
                  options={CATEGORIAS_PERSONA}
                  register={register("categoriaOcupacional")}
                  error={errors.categoriaOcupacional?.message as string}
                />
              </div>

              {/* Ocupación */}
              <OcupacionAutocomplete />

              {/* Tipo de contrato */}
              <FormSelect
                label="Tipo de contrato"
                name="tipoContrato"
                options={TIPOS_CONTRATO}
                register={register("tipoContrato")}
                error={errors.tipoContrato?.message as string}
              />

              {/* Pago & Entidad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Tipo de pago"
                  name="tipoPago"
                  options={TIPOS_PAGO}
                  register={register("tipoPago")}
                  error={errors.tipoPago?.message as string}
                />
                <FormSelect
                  label="Periodicidad de ingreso"
                  name="periodoIngreso"
                  options={PERIODOS_INGRESO}
                  register={register("periodoIngreso")}
                  error={errors.periodoIngreso?.message as string}
                />
              </div>
              {
                // if DEPOSITO_BANCARIO
                watchTipoPago == "DEPOSITO_BANCARIO"
                &&
                (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BancoAutocomplete />
                    <FormInput
                      label="Cuenta Bancaria"
                      name="cuenta"
                      register={register("cuenta")}
                      error={errors.cuenta?.message as string}
                    />
                  </div>
                )
              }
              <FormInput
                label="Monto de remuneración básica inicial"
                name="montoRemuneracion"
                type="number"
                register={register("montoRemuneracion")}
                error={errors.montoRemuneracion?.message as string}
              />
            </div>

            {/* Panel Derecho */}
            <div className="space-y-6">
              {/* Establecimiento */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Establecimiento donde labora</h4>
                <FormSelect
                  label="Establecimiento"
                  name="establecimiento"
                  options={
                    activeCompany
                      ? [{ value: activeCompany.companyId, label: activeCompany.name }]
                      : []
                  }
                  register={register("establecimiento")}
                  error={errors.establecimiento?.message as string}
                  disabled
                />
                <div className="grid grid-cols-3 gap-4">
                  <FormInput
                    label="Cod. Local"
                    name="codLocal"
                    register={register("codLocal")}
                    error={errors.codLocal?.message as string}
                    disabled
                  />
                  <div className="col-span-2">
                    <FormInput
                      label="Local"
                      name="localTipo"
                      register={register("localTipo")}
                      error={errors.localTipo?.message as string}
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Jornada Laboral */}
              <FormSelect
                label="Jornada laboral"
                name="jornadaLaboral"
                options={JORNADAS_LABORALES}
                register={register("jornadaLaboral")}
                error={errors.jornadaLaboral?.message as string}
              />

              {/* Situación Especial */}
              <FormInput
                label="Situación especial"
                name="situacionEspecial"
                register={register("situacionEspecial")}
                error={errors.situacionEspecial?.message as string}
                placeholder="Especifique si aplica"
              />

              {/* Discapacidad & Sindicalizado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none font-medium">
                    ¿Persona con discapacidad?
                  </label>
                  <div className="flex gap-4 items-center h-11">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        value="SI"
                        className="text-bento-secondary focus:ring-bento-secondary/20"
                        {...register("discapacidad")}
                      /> Sí
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        value="NO"
                        className="text-bento-secondary focus:ring-bento-secondary/20"
                        {...register("discapacidad")}
                      /> No
                    </label>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none font-medium">
                    ¿Sindicalizado?
                  </label>
                  <div className="flex gap-4 items-center h-11">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        value="SI"
                        className="text-bento-secondary focus:ring-bento-secondary/20"
                        {...register("sindicalizado")}
                      /> Sí
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        value="NO"
                        className="text-bento-secondary focus:ring-bento-secondary/20"
                        {...register("sindicalizado")}
                      /> No
                    </label>
                  </div>
                </div>
              </div>

              {/* Situación */}
              <FormInput
                label="Situación"
                name="situacion"
                register={register("situacion")}
                error={errors.situacion?.message as string}
                readOnly
                disabled
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="seguridad-social">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-bento-secondary rounded-full"></span>
            <span className="text-zinc-900 dark:text-zinc-50 font-bold">Datos de Seguridad Social</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-2">
            {/* Panel Izquierdo */}
            <div className="space-y-6">
              {/* Régimen de Salud */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Régimen de salud</h4>
                <FormSelect
                  label="Régimen de salud"
                  name="regimenSalud"
                  options={REGIMENES_SALUD}
                  register={register("regimenSalud")}
                  error={errors.regimenSalud?.message as string}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Fecha de Inicio"
                    name="fechaInicioSalud"
                    type="date"
                    register={register("fechaInicioSalud")}
                    error={errors.fechaInicioSalud?.message as string}
                  />
                  <FormInput
                    label="Fecha de Fin"
                    name="fechaFinSalud"
                    type="date"
                    placeholder="dd/mm/aaaa"
                    register={register("fechaFinSalud")}
                    error={errors.fechaFinSalud?.message as string}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <span className="text-xs font-semibold text-zinc-400 hover:text-bento-secondary transition-colors cursor-pointer select-none">
                    Detalle
                  </span>
                </div>
              </div>

              {/* Régimen Pensionario */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Régimen pensionario</h4>
                  <a
                    href="https://www.sbs.gob.pe/usuarios/consultas-en-linea"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-bento-secondary hover:underline cursor-pointer flex items-center gap-1 select-none"
                  >
                    Consulta SBS
                  </a>
                </div>
                <FormSelect
                  label="Régimen pensionario"
                  name="regimenPensionario"
                  options={REGIMENES_PENSIONARIOS}
                  register={register("regimenPensionario")}
                  error={errors.regimenPensionario?.message as string}
                />
                {watchRegimenPensionario && String(watchRegimenPensionario).startsWith("SPP_") && (
                  <FormInput
                    label="CUSPP"
                    name="CUSPP"
                    placeholder="Ingrese código CUSPP"
                    register={register("CUSPP")}
                    error={errors.CUSPP?.message as string}
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Fecha de Inicio"
                    name="fechaInicioPensionario"
                    type="date"
                    register={register("fechaInicioPensionario")}
                    error={errors.fechaInicioPensionario?.message as string}
                  />
                  <FormInput
                    label="Fecha de Fin"
                    name="fechaFinPensionario"
                    type="date"
                    placeholder="dd/mm/aaaa"
                    register={register("fechaFinPensionario")}
                    error={errors.fechaFinPensionario?.message as string}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <span className="text-xs font-semibold text-zinc-400 hover:text-bento-secondary transition-colors cursor-pointer select-none">
                    Detalle
                  </span>
                </div>
              </div>
            </div>

            {/* Panel Derecho */}
            <div className="space-y-6">
              {/* SCTR */}
              <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-850/5">
                <div className="flex flex-col">
                  <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none font-medium">
                    ¿Aporta al SCTR?
                  </label>
                  <div className="flex gap-4 items-center h-11">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        value="SI"
                        className="text-bento-secondary focus:ring-bento-secondary/20"
                        {...register("sctr")}
                      /> Sí
                    </label>
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        value="NO"
                        className="text-bento-secondary focus:ring-bento-secondary/20"
                        {...register("sctr")}
                      /> No
                    </label>
                  </div>
                </div>

                {watchSctr === "SI" && (
                  <div className="space-y-4 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none font-medium">
                          Cobertura Pensión
                        </label>
                        <div className="flex gap-4 items-center h-11">
                          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                            <input
                              type="radio"
                              value="ONP"
                              className="text-bento-secondary focus:ring-bento-secondary/20"
                              {...register("pension")}
                            /> ONP
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                            <input
                              type="radio"
                              value="PRIVADO"
                              className="text-bento-secondary focus:ring-bento-secondary/20"
                              {...register("pension")}
                            /> Seguro Privado
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 mb-2 select-none font-medium">
                          Cobertura Salud
                        </label>
                        <div className="flex gap-4 items-center h-11">
                          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                            <input
                              type="radio"
                              value="ESSALUD"
                              className="text-bento-secondary focus:ring-bento-secondary/20"
                              {...register("salud")}
                            /> EsSalud
                          </label>
                          <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer font-semibold">
                            <input
                              type="radio"
                              value="EPS"
                              className="text-bento-secondary focus:ring-bento-secondary/20"
                              {...register("salud")}
                            /> EPS
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput
                        label="Fecha de Inicio"
                        name="fechaInicioSaludPension"
                        type="date"
                        register={register("fechaInicioSaludPension")}
                        error={errors.fechaInicioSaludPension?.message as string}
                      />
                      <FormInput
                        label="Fecha de Fin"
                        name="fechaFinSaludPension"
                        type="date"
                        placeholder="dd/mm/aaaa"
                        register={register("fechaFinSaludPension")}
                        error={errors.fechaFinSaludPension?.message as string}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <span className="text-xs font-semibold text-zinc-400 hover:text-bento-secondary transition-colors cursor-pointer select-none">
                    Detalle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="situacion-educativa">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-bento-secondary rounded-full"></span>
            <span className="text-zinc-900 dark:text-zinc-50 font-bold">Datos de la Situación Educativa</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2 space-y-4">
            <div className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-bento-card p-4 bg-zinc-50/10 dark:bg-zinc-850/5">
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-4 leading-snug">
                La Situación Educativa que deberá consignar es la de mayor nivel alcanzado por el trabajador.
              </p>
              <SituacionAcademicaSelect
                estudios={estudios}
                onEstudiosChange={onEstudiosChange}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="datos-tributarios">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-bento-secondary rounded-full"></span>
            <span className="text-zinc-900 dark:text-zinc-50 font-bold">Datos Tributarios</span>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="pt-2">
            <div className="rounded-bento-card border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden">

              {/* Fila 1 — Quinta categoría exonerada */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800/50">
                <p className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300 max-w-sm leading-snug">
                  ¿Percibe rentas de 5ta exoneradas (Inc. e) Art. 19 de la LIR?
                </p>
                <div className="flex items-center gap-6 shrink-0 pl-6">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      value="SI"
                      {...register("quintaCategoriaExonerada")}
                      className="w-3.5 h-3.5 accent-bento-secondary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors select-none">
                      Sí
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      value="NO"
                      defaultChecked
                      {...register("quintaCategoriaExonerada")}
                      className="w-3.5 h-3.5 accent-bento-secondary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors select-none">
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* Fila 2 — Evita doble imposición */}
              <div className="flex items-center justify-between px-4 py-3.5">
                <p className="text-[12px] font-semibold text-zinc-700 dark:text-zinc-300 max-w-sm leading-snug">
                  ¿Aplica convenio para evitar doble imposición?
                </p>
                <div className="flex items-center gap-6 shrink-0 pl-6">
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      value="SI"
                      {...register("evitaDobleImposicion")}
                      className="w-3.5 h-3.5 accent-bento-secondary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors select-none">
                      Sí
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      value="NO"
                      defaultChecked
                      {...register("evitaDobleImposicion")}
                      className="w-3.5 h-3.5 accent-bento-secondary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors select-none">
                      No
                    </span>
                  </label>
                </div>
              </div>

            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
