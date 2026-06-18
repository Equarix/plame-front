import React, { useState } from "react";
import { FiCheckCircle, FiSave } from "react-icons/fi";
import { toast } from "sonner";
import type { PlameDeclaracion } from "../types/plame.types";

interface DeudaPanelProps {
  declaracion: PlameDeclaracion;
  companyRuc: string;
  companyName: string;
  onClose: () => void;
  onSaveDeuda: (data: any) => void;
  onFinalize: (data: any) => void;
}

interface DeudaEditable {
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
}

function CeldaCodigo({ code }: { code: string }) {
  return (
    <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded px-1 py-0.5 mr-1.5 leading-none">
      {code}
    </span>
  );
}

function CeldaEditable({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      step="0.01"
      value={value === 0 ? "" : value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      placeholder="0.00"
      className="w-full text-right text-xs p-1.5 border border-zinc-200 rounded focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 bg-white dark:bg-zinc-900 dark:border-zinc-700"
    />
  );
}

function CeldaReadonly({ value }: { value: number }) {
  return (
    <div className="text-right text-xs font-bold text-zinc-700 dark:text-zinc-200 py-1.5 px-2 bg-zinc-50 dark:bg-zinc-800/60 rounded border border-zinc-100 dark:border-zinc-700">
      {value.toFixed(2)}
    </div>
  );
}

function CeldaVacia() {
  return <div className="py-1.5" />;
}

export function DeudaPanel({ declaracion, companyRuc, companyName, onClose, onSaveDeuda, onFinalize }: DeudaPanelProps) {
  // ── Computed bases ─────────────────────────────────────────────────────────
  const baseImponibleSNP = declaracion.detalles.reduce((sum, d) => {
    return sum + d.ingresos.reduce((s, i) => s + i.devengado, 0);
  }, 0);

  const baseImponibleEsSalud = declaracion.detalles.reduce((sum, d) => {
    const devengado = d.ingresos.reduce((s, i) => s + i.devengado, 0);
    return sum + (devengado < 1130 ? 1130 : devengado);
  }, 0);

  const baseImponibleRenta = baseImponibleSNP;

  const impuestoSNP = Number((baseImponibleSNP * 0.13).toFixed(2));
  const impuestoEsSalud = Number((baseImponibleEsSalud * 0.09).toFixed(2));
  const impuestoRenta = 0;

  // ── Editable state ─────────────────────────────────────────────────────────
  const [campos, setCampos] = useState<DeudaEditable>({
    creditoEps602: declaracion.creditoEps602 || 0,
    creditoEps612: declaracion.creditoEps612 || 0,
    otrasDeducciones605: declaracion.otrasDeducciones605 || 0,
    pagosPreviosSNP: declaracion.pagosPreviosSNP || 0,
    pagosPreviosEsSalud: declaracion.pagosPreviosEsSalud || 0,
    pagosPreviosRenta: declaracion.pagosPreviosRenta || 0,
    interesSNP: declaracion.interesSNP || 0,
    interesEsSalud: declaracion.interesEsSalud || 0,
    interesRenta: declaracion.interesRenta || 0,
    importePagarSNP: declaracion.importePagarSNP || 0,
    importePagarEsSalud: declaracion.importePagarEsSalud || 0,
    importePagarRenta: declaracion.importePagarRenta || 0,
  });

  const set = (key: keyof DeudaEditable) => (v: number) =>
    setCampos((prev) => ({ ...prev, [key]: v }));

  // ── Saldo a Pagar (auto-computed) ──────────────────────────────────────────
  const saldoSNP = Math.max(
    0,
    impuestoSNP - campos.pagosPreviosSNP + campos.interesSNP,
  );
  const saldoEsSalud = Math.max(
    0,
    impuestoEsSalud -
      campos.creditoEps602 -
      campos.creditoEps612 -
      campos.pagosPreviosEsSalud +
      campos.interesEsSalud,
  );
  const saldoRenta = Math.max(
    0,
    impuestoRenta -
      campos.otrasDeducciones605 -
      campos.pagosPreviosRenta +
      campos.interesRenta,
  );

  const importeTotalAPagar =
    campos.importePagarSNP +
    campos.importePagarEsSalud +
    campos.importePagarRenta;

  // ── Forma de pago ──────────────────────────────────────────────────────────
  const [formaPago, setFormaPago] = useState<"efectivo" | "cheque">(
    (declaracion.formaPago as "efectivo" | "cheque") || "efectivo",
  );
  const [banco, setBanco] = useState(declaracion.banco || "");
  const [numeroCheque, setNumeroCheque] = useState(declaracion.numeroCheque || "");

  const handleGeneratePdf = async () => {
    const loadingToast = toast.loading("Generando constancia PDF...");
    try {
      const payload = {
        declaracion: {
          ruc: companyRuc || "20603081294",
          razonSocial: companyName || "Empresa S.A.C.",
          periodo: declaracion.periodo,
          numeroOrden: declaracion.numeroOrden || "1160814599",
          tipoDeclaracion: declaracion.sustitutoria ? "Sustitutoria" : "Original",
          numeroTrabajadores: declaracion.detalles.length,
        },
        tributos: [
          { nombre: "3052 RENTA 5TA. CATEG. RETENCIONES", deuda: saldoRenta, pago: campos.importePagarRenta },
          { nombre: "5210 ESSALUD SEG REGULAR", deuda: saldoEsSalud, pago: campos.importePagarEsSalud },
          { nombre: "5310 SNP - LEY 19990", deuda: saldoSNP, pago: campos.importePagarSNP },
        ],
        pago: {
          banco: banco || "Banco de la Nación",
          numeroOperacion: numeroCheque || "00000000000000",
          medioPago: formaPago === "efectivo" ? "Efectivo" : "Cheque",
          fechaPago: new Date().toLocaleString(),
        }
      };

      const response = await fetch("/api/pdf-pago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error generating PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast.success("Constancia generada", { id: loadingToast });
    } catch (err) {
      console.error(err);
      toast.error("Error al procesar el PDF", { id: loadingToast });
    }
  };

  // ── Column header style ────────────────────────────────────────────────────
  const thCol = "px-3 py-2.5 text-center text-[10px] font-bold uppercase text-white bg-indigo-700 border-r border-indigo-600 last:border-r-0";
  const thLabel = "px-3 py-2.5 text-left text-[10px] font-bold uppercase text-white bg-indigo-900 border-r border-indigo-700";
  const tdLabel = "px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-indigo-50/40 dark:bg-zinc-800/40 border-r border-zinc-200 dark:border-zinc-700 whitespace-nowrap";
  const tdCell = "px-2 py-1.5 border-r border-zinc-200 dark:border-zinc-700 last:border-r-0 align-middle";
  const trRow = "border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors";

  return (
    <div className="space-y-5">
      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-200/50 pb-2">
        Determinación de la Deuda
      </h3>

      {/* ── Main grid table ── */}
      <div className="overflow-x-auto rounded-bento-card border border-zinc-200 dark:border-zinc-700 shadow-sm">
        <table className="w-full border-collapse text-xs min-w-[700px]">
          <thead>
            <tr>
              <th className={thLabel}>Determinación Deuda</th>
              <th className={thCol}>
                Sist. Nac. Pens.<br />DL19990
              </th>
              <th className={thCol}>
                EsSalud Seguro<br />Regular – Trab.
              </th>
              <th className={thCol}>
                Renta 5ta Cat.<br />Retenciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">

            {/* Base Imponible */}
            <tr className={trRow}>
              <td className={tdLabel}>Base Imponible</td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="451" />
                  <CeldaReadonly value={baseImponibleSNP} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="452" />
                  <CeldaReadonly value={baseImponibleEsSalud} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="455" />
                  <CeldaReadonly value={baseImponibleRenta} />
                </div>
              </td>
            </tr>

            {/* Impuesto Resultante */}
            <tr className={trRow}>
              <td className={tdLabel}>Impuesto Resultante</td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="411" />
                  <CeldaReadonly value={impuestoSNP} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="412" />
                  <CeldaReadonly value={impuestoEsSalud} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="415" />
                  <CeldaReadonly value={impuestoRenta} />
                </div>
              </td>
            </tr>

            {/* Compensaciones */}
            <tr className={trRow}>
              <td className={tdLabel}>Compensaciones (saldo a favor exp.)</td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}><CeldaVacia /></td>
            </tr>

            {/* Crédito EPS 602 */}
            <tr className={trRow}>
              <td className={tdLabel}>Crédito EPS-Ley N° 26790</td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="602" />
                  <CeldaEditable value={campos.creditoEps602} onChange={set("creditoEps602")} />
                </div>
              </td>
              <td className={tdCell}><CeldaVacia /></td>
            </tr>

            {/* Crédito EPS 612 */}
            <tr className={trRow}>
              <td className={tdLabel}>Crédito EPS periodos anteriores Ley N°26790</td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="612" />
                  <CeldaEditable value={campos.creditoEps612} onChange={set("creditoEps612")} />
                </div>
              </td>
              <td className={tdCell}><CeldaVacia /></td>
            </tr>

            {/* Otras deducciones 605 */}
            <tr className={trRow}>
              <td className={tdLabel}>Otras deducciones permitidas por ley</td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="605" />
                  <CeldaEditable value={campos.otrasDeducciones605} onChange={set("otrasDeducciones605")} />
                </div>
              </td>
            </tr>

            {/* Pagos previos */}
            <tr className={trRow}>
              <td className={tdLabel}>Pagos previos (&ldquo;Descarga pagos&rdquo;)</td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="501" />
                  <CeldaEditable value={campos.pagosPreviosSNP} onChange={set("pagosPreviosSNP")} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="502" />
                  <CeldaEditable value={campos.pagosPreviosEsSalud} onChange={set("pagosPreviosEsSalud")} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="505" />
                  <CeldaEditable value={campos.pagosPreviosRenta} onChange={set("pagosPreviosRenta")} />
                </div>
              </td>
            </tr>

            {/* Interés Moratorio */}
            <tr className={trRow}>
              <td className={tdLabel}>Interés Moratorio</td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="701" />
                  <CeldaEditable value={campos.interesSNP} onChange={set("interesSNP")} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="702" />
                  <CeldaEditable value={campos.interesEsSalud} onChange={set("interesEsSalud")} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="705" />
                  <CeldaEditable value={campos.interesRenta} onChange={set("interesRenta")} />
                </div>
              </td>
            </tr>

            {/* Saldo a Pagar — auto-computed */}
            <tr className="border-b border-zinc-200 dark:border-zinc-700 bg-indigo-50/30 dark:bg-indigo-950/20">
              <td className={`${tdLabel} font-bold text-indigo-800 dark:text-indigo-300`}>Saldo a Pagar</td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="711" />
                  <CeldaReadonly value={saldoSNP} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="712" />
                  <CeldaReadonly value={saldoEsSalud} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="715" />
                  <CeldaReadonly value={saldoRenta} />
                </div>
              </td>
            </tr>

            {/* Importe a Pagar */}
            <tr className={trRow}>
              <td className={tdLabel}>Importe a Pagar</td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="801" />
                  <CeldaEditable value={campos.importePagarSNP} onChange={set("importePagarSNP")} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="802" />
                  <CeldaEditable value={campos.importePagarEsSalud} onChange={set("importePagarEsSalud")} />
                </div>
              </td>
              <td className={tdCell}>
                <div className="flex items-center gap-1">
                  <CeldaCodigo code="805" />
                  <CeldaEditable value={campos.importePagarRenta} onChange={set("importePagarRenta")} />
                </div>
              </td>
            </tr>

            {/* IGV */}
            <tr className="border-b border-zinc-200 dark:border-zinc-700">
              <td className={tdLabel}>IGV</td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}><CeldaVacia /></td>
              <td className={tdCell}><CeldaVacia /></td>
            </tr>

          </tbody>
        </table>
      </div>

      {/* ── Forma de Pago + Importe Total ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-bento-card border border-zinc-200/50 dark:border-zinc-800/50 p-4">
        {/* Forma de pago */}
        <div>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
            Forma de Pago:
          </span>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="formaPago"
                value="efectivo"
                checked={formaPago === "efectivo"}
                onChange={() => setFormaPago("efectivo")}
                className="accent-indigo-600"
              />
              Efectivo
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
              <input
                type="radio"
                name="formaPago"
                value="cheque"
                checked={formaPago === "cheque"}
                onChange={() => setFormaPago("cheque")}
                className="accent-indigo-600"
              />
              Cheque
            </label>
          </div>
        </div>

        {/* Importe Total a Pagar */}
        <div>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
            Importe Total a Pagar:&nbsp;
            <span className="text-indigo-700 dark:text-indigo-400 font-black text-sm">
              S/. {importeTotalAPagar.toFixed(2)}
            </span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 block mb-1">Banco</label>
              <select
                value={banco}
                onChange={(e) => setBanco(e.target.value)}
                className="w-full text-xs p-1.5 border rounded focus:ring-1 focus:ring-indigo-400 bg-white dark:bg-zinc-800 dark:border-zinc-700"
              >
                <option value="">Seleccionar</option>
                <option value="BCP">BCP</option>
                <option value="BBVA">BBVA</option>
                <option value="INTERBANK">INTERBANK</option>
                <option value="SCOTIABANK">SCOTIABANK</option>
                <option value="BANBIF">BANBIF</option>
                <option value="NATION">BANCO DE LA NACIÓN</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-zinc-500 block mb-1">N° de Cheque</label>
              <input
                type="text"
                value={numeroCheque}
                onChange={(e) => setNumeroCheque(e.target.value)}
                disabled={formaPago === "efectivo"}
                placeholder="—"
                className="w-full text-xs p-1.5 border rounded focus:ring-1 focus:ring-indigo-400 bg-white dark:bg-zinc-800 dark:border-zinc-700 disabled:bg-zinc-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-200/50">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-bento-control hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-all"
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => onSaveDeuda({ ...campos, totalNetoAPagar: importeTotalAPagar, formaPago, banco, numeroCheque })}
            className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 dark:bg-zinc-700 text-white rounded-bento-control text-xs font-bold hover:opacity-90 transition-all"
          >
            <FiSave className="text-sm" /> Guardar
          </button>
          <button
            type="button"
            onClick={handleGeneratePdf}
            className="px-4 py-2 border border-indigo-300 text-indigo-700 dark:text-indigo-400 dark:border-indigo-700 rounded-bento-control text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
          >
            Descarga pagos
          </button>
        </div>

        <button
          type="button"
          onClick={async () => {
            await handleGeneratePdf();
            onFinalize({ ...campos, totalNetoAPagar: importeTotalAPagar, formaPago, banco, numeroCheque });
          }}
          className="flex items-center gap-2 px-5 py-2 bg-bento-secondary hover:bg-bento-secondary/95 text-zinc-950 font-bold rounded-bento-control shadow-md transition-all text-xs"
        >
          <FiCheckCircle className="text-sm" /> Presentar Declaración
        </button>
      </div>
    </div>
  );
}
