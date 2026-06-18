import { NextResponse } from "next/server";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ConceptValue {
  code: string;
  name: string;
  devengado: number;
  pagado: number;
}

interface DescuentoValue {
  code: string;
  name: string;
  monto: number;
}

interface TributoValue {
  code: string;
  name: string;
  base: number;
  monto: number;
}

interface AportacionTrabajadorValue {
  code: string;
  name: string;
  base: number;
  monto: number;
}

interface PlamePersonaPDFPayload {
  periodo: string;
  sustitutoria: boolean;
  numeroOrden: string | null;
  empresa: {
    ruc: string;
    name: string;
  };
  trabajador: {
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    categoria: string;
    ocupacion: string;
    remuneracionBase: number;
  };
  jornada: {
    diasLaborados: number;
    diasSubsidiados: number;
    diasNoLaborados: number;
    horasOrdinarias: string;
    horasSobretiempo: string;
  };
  ingresos: ConceptValue[];
  descuentos: DescuentoValue[];
  tributos: TributoValue[];
  aportacionesTrabajador: AportacionTrabajadorValue[];
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 7,
    color: "#000",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
  },
  headerSubInfo: {
    fontSize: 7,
    marginTop: 2,
  },
  headerRight: {
    textAlign: "right",
    fontSize: 7,
    lineHeight: 1.3,
  },
  boxPanel: {
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#dbeafe",
    padding: 4,
    marginBottom: 15,
  },
  boxRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  boxLabel: {
    width: 60,
  },
  boxValue: {
    flex: 1,
  },
  boxLabelWide: {
    width: 140,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
    justifyContent: "center",
  },
  tableCellNoBorder: {
    padding: 3,
    justifyContent: "center",
  },
  textCenter: {
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
  bgLightBlue: {
    backgroundColor: "#e0f2fe",
  },
  bgLightGray: {
    backgroundColor: "#f3f4f6",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
  },
  footerText: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number | string): string => {
  const num = Number(n);
  return isNaN(num) ? "0.00" : num.toFixed(2);
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return new Date().toLocaleDateString("es-PE");
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};
const formatTime = (): string => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
};

// ── PDF Component ─────────────────────────────────────────────────────────────
function PlamePersonaPDF({ data }: { data: PlamePersonaPDFPayload }) {
  const nombreCompleto =
    `${data.trabajador.apellidoPaterno} ${data.trabajador.apellidoMaterno} ${data.trabajador.nombres}`.toUpperCase();

  const totalIngresos = data.ingresos.reduce((s, i) => s + i.devengado, 0);
  // Total deducciones: Aportaciones del trabajador + Descuentos
  const totalDescuentosGenerales = data.descuentos.reduce((s, d) => s + d.monto, 0);
  const totalAportaciones = data.aportacionesTrabajador.reduce((s, a) => s + a.monto, 0);
  const totalDescuentos = totalDescuentosGenerales + totalAportaciones;
  
  const netoAPagar = totalIngresos - totalDescuentos;

  const nowDate = formatDate(new Date().toISOString());
  const nowTime = formatTime();

  // Split hours and minutes
  const [ordH, ordM] = data.jornada.horasOrdinarias.split(":");
  const [sobH, sobM] = data.jornada.horasSobretiempo.split(":");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header Block */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>R08: Trabajador - Datos de boleta de pago</Text>
            <Text style={styles.headerSubInfo}>(Contiene datos mínimos de una boleta de pago)</Text>
          </View>
          <View style={styles.headerRight}>
            <Text>Página 1</Text>
            <Text>{nowDate}</Text>
            <Text>{nowTime}</Text>
          </View>
        </View>

        {/* Employer Info Block */}
        <View style={styles.boxPanel}>
          <View style={styles.boxRow}>
            <Text style={styles.boxLabel}>RUC:</Text>
            <Text style={styles.boxValue}>{data.empresa.ruc}</Text>
          </View>
          <View style={styles.boxRow}>
            <Text style={styles.boxLabel}>Empleador:</Text>
            <Text style={styles.boxValue}>{data.empresa.name.toUpperCase()}</Text>
          </View>
          <View style={styles.boxRow}>
            <Text style={styles.boxLabel}>Periodo:</Text>
            <Text style={styles.boxValue}>{data.periodo}</Text>
          </View>
          <View style={[styles.boxRow, { marginTop: 4 }]}>
            <Text style={styles.boxLabelWide}>PDT Planilla Electrónica - PLAME</Text>
            <Text style={styles.boxValue}>Número de Orden: {data.numeroOrden || ""}</Text>
          </View>
        </View>

        {/* Worker Info Table */}
        <View style={styles.table}>
          {/* Row 1 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "25%", borderBottomWidth: 1 }]}><Text style={styles.textCenter}>Documento de Identidad</Text></View>
            <View style={[styles.tableCell, { width: "50%", justifyContent: "flex-end" }]}><Text style={styles.textCenter}>Nombres y Apellidos</Text></View>
            <View style={[styles.tableCellNoBorder, { width: "25%", justifyContent: "flex-end" }]}><Text style={styles.textCenter}>Situación</Text></View>
          </View>
          {/* Row 2 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "12.5%" }]}><Text style={styles.textCenter}>Tipo</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "12.5%" }]}><Text style={styles.textCenter}>Número</Text></View>
            <View style={[styles.tableCell, { width: "50%" }]}><Text style={styles.textCenter}>{nombreCompleto}</Text></View>
            <View style={[styles.tableCellNoBorder, { width: "25%" }]}><Text style={styles.textCenter}>ACTIVO O SUBSIDIADO</Text></View>
          </View>
          {/* Row 3 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "12.5%" }]}><Text style={styles.textCenter}>DNI</Text></View>
            <View style={[styles.tableCell, { width: "12.5%" }]}><Text style={styles.textCenter}>{data.trabajador.dni}</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "25%" }]}><Text style={styles.textCenter}>Tipo de Trabajador</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "25%" }]}><Text style={styles.textCenter}>Régimen Pensionario</Text></View>
            <View style={[styles.tableCellNoBorder, styles.bgLightGray, { width: "25%" }]}><Text style={styles.textCenter}>CUSPP</Text></View>
          </View>
          {/* Row 4 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "25%" }]}><Text style={styles.textCenter}>Fecha de Ingreso</Text></View>
            <View style={[styles.tableCell, { width: "25%" }]}><Text style={styles.textCenter}>{data.trabajador.categoria.toUpperCase()}</Text></View>
            <View style={[styles.tableCell, { width: "25%" }]}><Text style={styles.textCenter}>DL 19990 - SIST NAC DE PENS - ONP</Text></View>
            <View style={[styles.tableCellNoBorder, { width: "25%" }]}><Text style={styles.textCenter}></Text></View>
          </View>
          {/* Row 5 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "25%" }]}><Text style={styles.textCenter}></Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "12.5%" }]}><Text style={styles.textCenter}>Condición</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "37.5%" }]}><Text style={styles.textCenter}>Jornada Ordinaria</Text></View>
            <View style={[styles.tableCellNoBorder, styles.bgLightGray, { width: "25%" }]}><Text style={styles.textCenter}>Sobretiempo</Text></View>
          </View>
          {/* Row 6 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "8.33%" }]}><Text style={styles.textCenter}>Días{'\n'}Laborados</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "8.33%" }]}><Text style={styles.textCenter}>Días No{'\n'}Laborados</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "8.34%" }]}><Text style={styles.textCenter}>Días{'\n'}Subsidiados</Text></View>
            <View style={[styles.tableCell, { width: "12.5%" }]}><Text style={styles.textCenter}>Domiciliado</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "18.75%" }]}><Text style={styles.textCenter}>Total Horas</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "18.75%" }]}><Text style={styles.textCenter}>Minutos</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "12.5%" }]}><Text style={styles.textCenter}>Total Horas</Text></View>
            <View style={[styles.tableCellNoBorder, styles.bgLightGray, { width: "12.5%" }]}><Text style={styles.textCenter}>Minutos</Text></View>
          </View>
          {/* Row 7 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, { width: "8.33%" }]}><Text style={styles.textCenter}>{data.jornada.diasLaborados}</Text></View>
            <View style={[styles.tableCell, { width: "8.33%" }]}><Text style={styles.textCenter}>{data.jornada.diasNoLaborados}</Text></View>
            <View style={[styles.tableCell, { width: "8.34%" }]}><Text style={styles.textCenter}>{data.jornada.diasSubsidiados}</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "12.5%", padding: 0 }]}><Text style={styles.textCenter}></Text></View>
            <View style={[styles.tableCell, { width: "18.75%" }]}><Text style={styles.textCenter}>{ordH}</Text></View>
            <View style={[styles.tableCell, { width: "18.75%" }]}><Text style={styles.textCenter}>{ordM}</Text></View>
            <View style={[styles.tableCell, { width: "12.5%" }]}><Text style={styles.textCenter}>{sobH}</Text></View>
            <View style={[styles.tableCellNoBorder, { width: "12.5%" }]}><Text style={styles.textCenter}>{sobM}</Text></View>
          </View>
          {/* Row 8 */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "75%", borderBottomWidth: 1 }]}><Text style={styles.textCenter}>Motivo de Suspensión de Labores</Text></View>
            <View style={[styles.tableCellNoBorder, styles.bgLightGray, { width: "25%" }]}><Text style={styles.textCenter}>Otros empleadores por{'\n'}Rentas de 5ta categoría</Text></View>
          </View>
          {/* Row 9 */}
          <View style={{ flexDirection: "row" }}>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "16.66%" }]}><Text style={styles.textCenter}>Tipo</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "41.67%" }]}><Text style={styles.textCenter}>Motivo</Text></View>
            <View style={[styles.tableCell, styles.bgLightGray, { width: "16.67%" }]}><Text style={styles.textCenter}>N.º Días</Text></View>
            <View style={[styles.tableCellNoBorder, { width: "25%" }]}><Text style={styles.textCenter}>No tiene</Text></View>
          </View>
        </View>

        {/* Remuneration Details Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.bgLightBlue]}>
            <View style={[styles.tableCell, { width: "10%" }]}><Text>Código</Text></View>
            <View style={[styles.tableCell, { width: "50%" }]}><Text>Conceptos</Text></View>
            <View style={[styles.tableCell, { width: "15%" }]}><Text style={styles.textCenter}>Ingresos S/.</Text></View>
            <View style={[styles.tableCell, { width: "15%" }]}><Text style={styles.textCenter}>Descuentos S/.</Text></View>
            <View style={[styles.tableCellNoBorder, { width: "10%" }]}><Text style={styles.textCenter}>Neto S/.</Text></View>
          </View>

          {/* Ingresos Section */}
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}><Text style={{ padding: 3, width: "100%" }}>Ingresos</Text></View>
          {data.ingresos.map((ing) => (
            <View key={ing.code} style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.tableCell, { width: "10%", borderRightWidth: 0 }]}><Text>{ing.code}</Text></View>
              <View style={[styles.tableCell, { width: "50%", borderRightWidth: 0 }]}><Text>{ing.name}</Text></View>
              <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text style={styles.textRight}>{fmt(ing.devengado)}</Text></View>
              <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text></Text></View>
              <View style={[styles.tableCellNoBorder, { width: "10%" }]}><Text></Text></View>
            </View>
          ))}

          {/* Descuentos Section */}
          <View style={[styles.tableRow, { borderBottomWidth: 0, marginTop: 5 }]}><Text style={{ padding: 3, width: "100%" }}>Descuentos</Text></View>
          {data.descuentos.map((desc) => (
            <View key={desc.code} style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.tableCell, { width: "10%", borderRightWidth: 0 }]}><Text>{desc.code}</Text></View>
              <View style={[styles.tableCell, { width: "50%", borderRightWidth: 0 }]}><Text>{desc.name}</Text></View>
              <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text></Text></View>
              <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text style={styles.textRight}>{fmt(desc.monto)}</Text></View>
              <View style={[styles.tableCellNoBorder, { width: "10%" }]}><Text></Text></View>
            </View>
          ))}

          <View style={[styles.tableRow, { borderBottomWidth: 0, marginTop: 5 }]}><Text style={{ padding: 3, width: "100%" }}>Aportes del Trabajador</Text></View>
          {data.aportacionesTrabajador.map((ap) => (
            <View key={ap.code} style={[styles.tableRow, { borderBottomWidth: 0 }]}>
              <View style={[styles.tableCell, { width: "10%", borderRightWidth: 0 }]}><Text>{ap.code}</Text></View>
              <View style={[styles.tableCell, { width: "50%", borderRightWidth: 0 }]}><Text>{ap.name}</Text></View>
              <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text></Text></View>
              <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text style={styles.textRight}>{fmt(ap.monto)}</Text></View>
              <View style={[styles.tableCellNoBorder, { width: "10%" }]}><Text></Text></View>
            </View>
          ))}

          {/* Neto a Pagar */}
          <View style={[styles.tableRow, styles.bgLightBlue, { marginTop: 5 }]}>
            <View style={[styles.tableCell, { width: "60%", borderRightWidth: 0 }]}><Text>Neto a Pagar</Text></View>
            <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text></Text></View>
            <View style={[styles.tableCell, { width: "15%", borderRightWidth: 0 }]}><Text></Text></View>
            <View style={[styles.tableCellNoBorder, { width: "10%" }]}><Text style={styles.textRight}>{fmt(netoAPagar)}</Text></View>
          </View>
        </View>

        {/* Employer Contributions Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.bgLightBlue]}>
            <View style={[styles.tableCellNoBorder, { width: "100%" }]}><Text>Aportes de Empleador</Text></View>
          </View>
          
          {data.tributos.map((trib, idx) => (
            <View key={trib.code} style={idx === data.tributos.length - 1 ? { flexDirection: "row" } : styles.tableRow}>
              <View style={[styles.tableCell, { width: "10%", borderRightWidth: 0 }]}><Text>{trib.code}</Text></View>
              <View style={[styles.tableCell, { width: "80%", borderRightWidth: 0 }]}><Text>{trib.name}</Text></View>
              <View style={[styles.tableCellNoBorder, { width: "10%" }]}><Text style={styles.textRight}>{fmt(trib.monto)}</Text></View>
            </View>
          ))}
        </View>

        <Text style={styles.footerText}>Generado por el PDT Planilla Electrónica PLAME. Página 1 /1</Text>
      </Page>
    </Document>
  );
}

// ── Next.js POST handler ──────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as PlamePersonaPDFPayload;

    const pdfBlob = await pdf(<PlamePersonaPDF data={payload} />).toBlob();

    const safeName = `boleta_plame_${payload.periodo.replace("/", "-")}_${payload.trabajador.dni}.pdf`;

    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${safeName}`,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PLAME PDF generation failed:", error);
    return NextResponse.json(
      { message: "Error generando el PDF", error: error.message },
      { status: 500 },
    );
  }
}
