// ── Shared primitives ─────────────────────────────────────────────────────────

export interface PlameConceptIngreso {
  code: string;
  name: string;
  devengado: number;
  pagado: number;
}

export interface PlameConceptDescuento {
  code: string;
  name: string;
  monto: number;
}

export interface PlameConceptTributo {
  code: string;
  name: string;
  base: number;
  monto: number;
}

export interface PlameConceptAportacionTrabajador {
  code: string;
  name: string;
  base: number;
  monto: number;
}

// ── Domain entities ───────────────────────────────────────────────────────────

export interface PlamePersona {
  personaId: number;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

export interface PlameOcupacion {
  ocupacionId: number;
  name: string;
}

export interface PlameTPersona {
  tPersonaId: number;
  categoria: string;
  montoRemuneracionInicial: number;
  persona: PlamePersona;
  ocupacion: PlameOcupacion | null;
}

export interface PlameDetalle {
  detalleId: number;
  tPersonaId: number;
  tPersona: PlameTPersona;
  diasLaborados: number;
  diasSubsidiados: number;
  diasNoLaborados: number;
  horasOrdinarias: string;
  horasSobretiempo: string;
  ingresos: PlameConceptIngreso[];
  descuentos: PlameConceptDescuento[];
  tributos: PlameConceptTributo[];
}

export interface PlameDeclaracion {
  plameDeclaracionId: number;
  companyId: number;
  periodo: string;
  sustitutoria: boolean;
  numeroOrden: string | null;
  fechaPresentacion: string | null;
  estado: string;
  totalNetoAPagar: number;
  creditoEps602: number;
  creditoEps612: number;
  otrasDeducciones605: number;
  pagosPreviosSNP: number;
  pagosPreviosEsSalud: number;
  pagosPreviosRenta: number;
  interesSNP: number;
  interesEsSalud: number;
  interesRenta: number;
  importePagarSNP: number;
  importePagarEsSalud: number;
  importePagarRenta: number;
  formaPago: string | null;
  banco: string | null;
  numeroCheque: string | null;
  createdAt: string;
  detalles: PlameDetalle[];
  empresa?: PlameEmpresa;
}

export interface PlameEmpresa {
  companyId: number;
  ruc: string;
  name: string;
  address: string;
}

// ── Form value types (RHF) ────────────────────────────────────────────────────

export interface PlameGeneralFormValues {
  sustitutoria: string; // "true" | "false" — radio value
  numeroOrden: string;
}

export interface PlameDetalleFormValues {
  diasLaborados: number;
  diasSubsidiados: number;
  diasNoLaborados: number;
  horasOrdinarias: string;
  horasSobretiempo: string;
}

// ── API payload types ─────────────────────────────────────────────────────────

export interface PlameUpdateDetallePayload {
  diasLaborados: number;
  diasSubsidiados: number;
  diasNoLaborados: number;
  horasOrdinarias: string;
  horasSobretiempo: string;
  ingresos: PlameConceptIngreso[];
  descuentos: PlameConceptDescuento[];
}
