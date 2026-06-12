import { DireccionData } from "@/interface/response.interface";

export const formatDireccion = (direccion: DireccionData): string => {
  const parts = [
    `${direccion.tipoVia} ${direccion.nombreVia}`,
    direccion.numero ? `N° ${direccion.numero}` : null,
    direccion.dpto ? `Dpto. ${direccion.dpto}` : null,
    direccion.interior ? `Int. ${direccion.interior}` : null,
    direccion.manzana ? `Mz. ${direccion.manzana}` : null,
    direccion.lote ? `Lt. ${direccion.lote}` : null,
    direccion.block ? `Block ${direccion.block}` : null,
    direccion.etapa ? `Etapa ${direccion.etapa}` : null,
    `${direccion.tipoZona} ${direccion.nombreZona}`,
  ].filter(Boolean);

  const ubigeoParts: string[] = [];
  if (direccion.distrito?.distrito) ubigeoParts.push(direccion.distrito.distrito);
  if (direccion.provincia?.provincia) ubigeoParts.push(direccion.provincia.provincia);
  if (direccion.departamento?.departamento) ubigeoParts.push(direccion.departamento.departamento);

  const ubigeoStr = ubigeoParts.length > 0 ? ` (${ubigeoParts.join(" - ")})` : "";

  return `${parts.join(", ")}${ubigeoStr}`;
};
