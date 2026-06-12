import React from "react";
import { FormCardRadioGroup } from "@/components/forms/FormCardRadioGroup";
import type { CategoriaType } from "../hooks/useTRegistroForm";

interface ResumenTabProps {
  categoria: CategoriaType;
  setCategoria: (val: CategoriaType) => void;
  categoriesList: { value: CategoriaType; label: string; desc: string }[];
}

export function ResumenTab({ categoria, setCategoria, categoriesList }: ResumenTabProps) {
  return (
    <FormCardRadioGroup
      label="Seleccione el tipo de prestador que desea registrar para esta persona:"
      name="categoriaPrestador"
      value={categoria}
      onChange={(val) => setCategoria(val as CategoriaType)}
      options={categoriesList}
    />
  );
}
