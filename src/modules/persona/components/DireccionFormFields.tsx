import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useUbigeo } from "@/hooks/useUbigeo";
import { useEffect } from "react";
import { PersonaFormType } from "../../admin/schemas/persona.schema";

export function DireccionFormFields() {
  const {
    setValue,
    control,
    formState: { errors },
  } = useFormContext<PersonaFormType>();

  const departamentoId = useWatch({
    control,
    name: "direccion.departamentoId",
  });

  const provinciaId = useWatch({
    control,
    name: "direccion.provinciaId",
  });

  const refiereEssalud = useWatch({
    control,
    name: "direccion.refiereEssalud",
  });

  const { departamentos, provincias, distritos } = useUbigeo(
    departamentoId ? Number(departamentoId) : undefined,
    provinciaId ? Number(provinciaId) : undefined,
  );

  // When departamento changes, clear selected province and district
  useEffect(() => {
    if (!departamentoId) {
      setValue("direccion.provinciaId", 0);
      setValue("direccion.distritoId", 0);
    }
  }, [departamentoId, setValue]);

  // When provincia changes, clear selected district
  useEffect(() => {
    if (!provinciaId) {
      setValue("direccion.distritoId", 0);
    }
  }, [provinciaId, setValue]);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest border-b border-zinc-200/40 dark:border-zinc-800/40 pb-2">
        Registro de Dirección
      </h4>

      {/* Ubigeo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Controller
          name="direccion.departamentoId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Departamento"
              name="direccion.departamentoId"
              error={errors.direccion?.departamentoId?.message}
              options={departamentos.map((d) => ({
                value: d.idDepartamento,
                label: d.departamento,
              }))}
              value={field.value}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" || e.target.value === undefined
                    ? 0
                    : Number(e.target.value),
                )
              }
            />
          )}
        />

        <Controller
          name="direccion.provinciaId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Provincia"
              name="direccion.provinciaId"
              error={errors.direccion?.provinciaId?.message}
              options={provincias.map((p) => ({
                value: p.idProvincia,
                label: p.provincia,
              }))}
              disabled={!departamentoId || Number(departamentoId) === 0}
              value={field.value}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" || e.target.value === undefined
                    ? 0
                    : Number(e.target.value),
                )
              }
            />
          )}
        />

        <Controller
          name="direccion.distritoId"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Distrito"
              name="direccion.distritoId"
              error={errors.direccion?.distritoId?.message}
              options={distritos.map((d) => ({
                value: d.idDistrito,
                label: d.distrito,
              }))}
              disabled={!provinciaId || Number(provinciaId) === 0}
              value={field.value}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" || e.target.value === undefined
                    ? 0
                    : Number(e.target.value),
                )
              }
            />
          )}
        />
      </div>

      {/* Tipo de vía y Nombre de vía */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Controller
          name="direccion.tipoVia"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Tipo de vía"
              error={errors.direccion?.tipoVia?.message}
              options={[
                { value: "AVENIDA", label: "Avenida" },
                { value: "CALLE", label: "Calle" },
                { value: "JIRON", label: "Jirón" },
                { value: "PASAJE", label: "Pasaje" },
                { value: "OTRO", label: "Otro" },
              ]}
              {...field}
            />
          )}
        />

        <div className="sm:col-span-2">
          <Controller
            name="direccion.nombreVia"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Nombre de vía"
                error={errors.direccion?.nombreVia?.message}
                placeholder="Ingrese nombre de vía..."
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>

      {/* Dirección detallada */}
      <div className="grid grid-cols-2 sm:grid-cols-8 gap-4">
        <div className="sm:col-span-2">
          <Controller
            name="direccion.numero"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Número"
                error={errors.direccion?.numero?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="direccion.dpto"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Dpto"
                error={errors.direccion?.dpto?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="direccion.interior"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Interior"
                error={errors.direccion?.interior?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="direccion.manzana"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Manzana"
                error={errors.direccion?.manzana?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="direccion.lote"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Lote"
                error={errors.direccion?.lote?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="direccion.block"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Block"
                error={errors.direccion?.block?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="direccion.etapa"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Etapa"
                error={errors.direccion?.etapa?.message}
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>

      {/* Tipo de zona y Nombre de zona */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Controller
          name="direccion.tipoZona"
          control={control}
          render={({ field }) => (
            <FormSelect
              label="Tipo de zona"
              error={errors.direccion?.tipoZona?.message}
              options={[
                { value: "URBANA", label: "Urbana" },
                { value: "RURAL", label: "Rural" },
                { value: "OTRO", label: "Otro" },
              ]}
              {...field}
            />
          )}
        />

        <div className="sm:col-span-2">
          <Controller
            name="direccion.nombreZona"
            control={control}
            render={({ field }) => (
              <FormInput
                label="Nombre de zona"
                error={errors.direccion?.nombreZona?.message}
                placeholder="Ingrese nombre de la zona..."
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>
      </div>

      {/* Referencia */}
      <Controller
        name="direccion.referencia"
        control={control}
        render={({ field }) => (
          <FormInput
            label="Referencia"
            error={errors.direccion?.referencia?.message}
            placeholder="Ingrese alguna referencia..."
            {...field}
            value={field.value ?? ""}
          />
        )}
      />

      {/* Referente EsSalud */}
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 select-none">
          Referente para Centro Asistencial EsSalud
        </label>
        <div className="flex items-center gap-4">
          <Controller
            name="direccion.refiereEssalud"
            control={control}
            render={({ field }) => (
              <>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    value="true"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    className="text-bento-secondary focus:ring-bento-secondary"
                  />
                  Sí
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input
                    type="radio"
                    value="false"
                    checked={field.value === false || field.value === undefined}
                    onChange={() => field.onChange(false)}
                    className="text-bento-secondary focus:ring-bento-secondary"
                  />
                  No
                </label>
              </>
            )}
          />
        </div>
        {errors.direccion?.refiereEssalud && (
          <p className="text-xs text-bento-danger font-medium animate-fadeIn">
            <span className="inline-block w-1 h-1 rounded-full bg-bento-danger"></span>
            {errors.direccion?.refiereEssalud?.message}
          </p>
        )}
      </div>
    </div>
  );
}
