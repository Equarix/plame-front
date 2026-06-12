import { useFormContext, useWatch } from "react-hook-form";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { useUbigeo } from "@/hooks/useUbigeo";
import { useEffect } from "react";
import { PersonaFormType } from "../../admin/schemas/persona.schema";

export function DireccionFormFields() {
  const {
    register,
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

  console.log("DireccionFormFields values (useWatch):", {
    departamentoId,
    typeofDepto: typeof departamentoId,
    provinciaId,
    typeofProv: typeof provinciaId,
  });

  const { departamentos, provincias, distritos } = useUbigeo(
    departamentoId ? Number(departamentoId) : undefined,
    provinciaId ? Number(provinciaId) : undefined
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect
          label="Departamento"
          name="direccion.departamentoId"
          register={register("direccion.departamentoId", {
            setValueAs: (v) => (v === "" || v === undefined ? 0 : Number(v)),
          })}
          error={errors.direccion?.departamentoId?.message}
          options={departamentos.map((d) => ({ value: d.idDepartamento, label: d.departamento }))}
        />

        <FormSelect
          label="Provincia"
          name="direccion.provinciaId"
          register={register("direccion.provinciaId", {
            setValueAs: (v) => (v === "" || v === undefined ? 0 : Number(v)),
          })}
          error={errors.direccion?.provinciaId?.message}
          options={provincias.map((p) => ({ value: p.idProvincia, label: p.provincia }))}
          disabled={!departamentoId || Number(departamentoId) === 0}
        />

        <FormSelect
          label="Distrito"
          name="direccion.distritoId"
          register={register("direccion.distritoId", {
            setValueAs: (v) => (v === "" || v === undefined ? 0 : Number(v)),
          })}
          error={errors.direccion?.distritoId?.message}
          options={distritos.map((d) => ({ value: d.idDistrito, label: d.distrito }))}
          disabled={!provinciaId || Number(provinciaId) === 0}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect
          label="Tipo de vía"
          name="direccion.tipoVia"
          register={register("direccion.tipoVia")}
          error={errors.direccion?.tipoVia?.message}
          options={[
            { value: "AVENIDA", label: "Avenida" },
            { value: "CALLE", label: "Calle" },
            { value: "JIRON", label: "Jirón" },
            { value: "PASAJE", label: "Pasaje" },
            { value: "OTRO", label: "Otro" },
          ]}
        />

        <div className="sm:col-span-2">
          <FormInput
            label="Nombre de vía"
            name="direccion.nombreVia"
            register={register("direccion.nombreVia")}
            error={errors.direccion?.nombreVia?.message}
            placeholder="Ingrese nombre de vía..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-8 gap-4">
        <div className="sm:col-span-2">
          <FormInput
            label="Número"
            name="direccion.numero"
            register={register("direccion.numero")}
            error={errors.direccion?.numero?.message}
          />
        </div>
        <div>
          <FormInput
            label="Dpto"
            name="direccion.dpto"
            register={register("direccion.dpto")}
            error={errors.direccion?.dpto?.message}
          />
        </div>
        <div>
          <FormInput
            label="Interior"
            name="direccion.interior"
            register={register("direccion.interior")}
            error={errors.direccion?.interior?.message}
          />
        </div>
        <div>
          <FormInput
            label="Manzana"
            name="direccion.manzana"
            register={register("direccion.manzana")}
            error={errors.direccion?.manzana?.message}
          />
        </div>
        <div>
          <FormInput
            label="Lote"
            name="direccion.lote"
            register={register("direccion.lote")}
            error={errors.direccion?.lote?.message}
          />
        </div>
        <div>
          <FormInput
            label="Block"
            name="direccion.block"
            register={register("direccion.block")}
            error={errors.direccion?.block?.message}
          />
        </div>
        <div>
          <FormInput
            label="Etapa"
            name="direccion.etapa"
            register={register("direccion.etapa")}
            error={errors.direccion?.etapa?.message}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormSelect
          label="Tipo de zona"
          name="direccion.tipoZona"
          register={register("direccion.tipoZona")}
          error={errors.direccion?.tipoZona?.message}
          options={[
            { value: "URBANA", label: "Urbana" },
            { value: "RURAL", label: "Rural" },
            { value: "OTRO", label: "Otro" },
          ]}
        />

        <div className="sm:col-span-2">
          <FormInput
            label="Nombre de zona"
            name="direccion.nombreZona"
            register={register("direccion.nombreZona")}
            error={errors.direccion?.nombreZona?.message}
            placeholder="Ingrese nombre de la zona..."
          />
        </div>
      </div>

      <FormInput
        label="Referencia"
        name="direccion.referencia"
        register={register("direccion.referencia")}
        error={errors.direccion?.referencia?.message}
        placeholder="Ingrese alguna referencia..."
      />

      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold text-bento-text/80 dark:text-bento-text/90 select-none">
          Referente para Centro Asistencial EsSalud
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            <input
              type="radio"
              value="true"
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("direccion.refiereEssalud", true);
                }
              }}
              checked={refiereEssalud}
              className="text-bento-secondary focus:ring-bento-secondary"
            />
            Sí
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            <input
              type="radio"
              value="false"
              onChange={(e) => {
                if (e.target.checked) {
                  setValue("direccion.refiereEssalud", false);
                }
              }}
              checked={!refiereEssalud}
              className="text-bento-secondary focus:ring-bento-secondary"
            />
            No
          </label>
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
