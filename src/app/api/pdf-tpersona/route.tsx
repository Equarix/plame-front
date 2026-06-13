import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  pdf,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import React from "react";

const logoPath = path.join(process.cwd(), "public", "logo-sunat.png");
let logoDataUri = "";
try {
  const logoBuffer = fs.readFileSync(logoPath);
  logoDataUri = `data:image/png;base64,${logoBuffer.toString("base64")}`;
} catch (e) {
  console.error("Failed to read logo-sunat.png:", e);
}

// Define strict types for the payload
interface EstudiosPDFInput {
  formacionCompleta: string;
  estudioPeru: boolean;
  privado: boolean;
  tipoEducacion: string;
  nombreInstitucion: string;
  nombreCarrera: string;
  añoEgreso: number;
}

interface TPersonaPDFPayload {
  tPersonaId?: number;
  createAt?: string;
  empleador: {
    ruc: string;
    name: string;
    direccion: string;
  };
  trabajador: {
    dni: string;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    fechaNacimiento: string;
    sexo: string;
    estadoCivil: string;
    nacionalidad: string;
    telefono: string;
    email: string;
    direccion: string;
  };
  laborales: {
    fechaInicio: string;
    tipoTrabajador: string;
    regimenLaboral: string;
    ocupacion: string;
    tipoContrato: string;
    tipoPago: string;
    periodoIngreso: string;
    montoRemuneracion: number;
    codlocal: string;
    discapacidad: boolean;
    sindicalizado: boolean;
    jornadaLaboral: string;
    situacionEspecial: string;
  };
  seguridadSocial: {
    regimenSalud: string;
    fechaInicioSalud: string;
    fechaFinSalud?: string;
    regimenPensionario: string;
    fechaInicioPensionario: string;
    fechaFinPensionario?: string;
    CUSPP?: string;
    sctr: boolean;
    pension?: string;
    salud?: string;
    fechaInicioSaludPension?: string;
    fechaFinSaludPension?: string;
  };
  educacion: {
    situacionEducativa: string;
    estudios: EstudiosPDFInput[];
  };
  adicionales: {
    quintaCategoriaExonerada: boolean;
    evitaDobleImposicion: boolean;
  };
}

// React-PDF Stylesheet mimicking the SUNAT form layout
const styles = StyleSheet.create({
  page: {
    paddingTop: 25,
    paddingBottom: 40,
    paddingHorizontal: 35,
    fontFamily: "Helvetica",
    fontSize: 7.5,
    color: "#000",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    paddingBottom: 4,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "column",
  },
  logoImage: {
    width: 110,
    height: 35,
    objectFit: "contain",
  },
  sunatTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f2c59",
  },
  sunatSubText: {
    fontSize: 5,
    color: "#666",
    marginTop: 1,
  },
  headerRight: {
    fontSize: 7.5,
    fontWeight: "bold",
    textAlign: "right",
  },
  docTitleContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  docTitleMain: {
    fontSize: 10.5,
    fontWeight: "bold",
    textAlign: "center",
  },
  docTitleSub: {
    fontSize: 8.5,
    textAlign: "center",
    marginTop: 1.5,
  },
  docTitleBold: {
    fontSize: 10.5,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 1.5,
  },
  introText: {
    fontSize: 7,
    marginVertical: 8,
    lineHeight: 1.3,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontWeight: "bold",
    borderBottomWidth: 1.5,
    borderBottomColor: "#000",
    marginTop: 12,
    paddingBottom: 1.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  gridRow: {
    flexDirection: "row",
    width: "100%",
    marginVertical: 1.5,
  },
  gridField: {
    flexDirection: "row",
    width: "50%",
    paddingRight: 10,
  },
  gridFieldFull: {
    flexDirection: "row",
    width: "100%",
  },
  labelBold: {
    fontWeight: "bold",
    width: 140,
    fontSize: 7.2,
  },
  labelBoldShort: {
    fontWeight: "bold",
    width: 80,
    fontSize: 7.2,
  },
  valueText: {
    flex: 1,
    fontSize: 7.2,
  },
  subSectionLabel: {
    fontSize: 7.2,
    fontWeight: "bold",
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 3,
  },
  table: {
    width: "100%",
    borderWidth: 0.8,
    borderColor: "#000",
    marginVertical: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#d1d5db",
    borderBottomWidth: 0.8,
    borderBottomColor: "#000",
  },
  tableHeaderCell: {
    padding: 3,
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 0.8,
    borderRightColor: "#000",
    fontSize: 7,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.8,
    borderBottomColor: "#000",
  },
  tableCell: {
    padding: 3,
    textAlign: "left",
    borderRightWidth: 0.8,
    borderRightColor: "#000",
    fontSize: 7,
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  notesTitle: {
    fontSize: 7.2,
    fontWeight: "bold",
    marginTop: 8,
    textDecoration: "underline",
  },
  notesText: {
    fontSize: 6.2,
    color: "#333",
    marginTop: 2,
    lineHeight: 1.25,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 35,
    right: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.8,
    borderTopColor: "#9ca3af",
    paddingTop: 4,
    fontSize: 6.5,
    color: "#4b5563",
  },
});

// Helper formatting functions
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "-";
  try {
    const cleanDateStr = dateStr.split("T")[0];
    const [year, month, day] = cleanDateStr.split("-");
    if (year && month && day) return `${day}/${month}/${year}`;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

const formatTime = (dateStr?: string): string => {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  } catch {
    return "18:29:50";
  }
};

const getRegimenLabel = (code: string): string => {
  const map: Record<string, string> = {
    D_LEG_728: "D. LEG N.° 728",
    D_LEG_276: "D. LEG N.° 276",
    CAS: "C.A.S. (D. LEG N.° 1057)",
    MYPE: "MICRO/PEQUEÑA EMPRESA",
    OTROS: "OTROS REGIMENES",
  };
  return map[code] || code;
};

const getContratoLabel = (code: string): string => {
  const map: Record<string, string> = {
    PLAZO_INDETERMINADO: "A PLAZO INDET - D.LEG. 728",
    PLAZO_FIJO: "A PLAZO FIJO (SUJETO A MODALIDAD)",
    TIEMPO_PARCIAL: "A TIEMPO PARCIAL",
    CAS: "CONTRATO CAS (D. LEG 1057)",
  };
  return map[code] || code;
};

const getSaludLabel = (code: string): string => {
  const map: Record<string, string> = {
    ESSALUD_REGULAR: "ESSALUD REGULAR",
    ESSALUD_TRABAJADOR_PESQUERO: "ESSALUD TRABAJADOR PESQUERO",
    ESSALUD_AGRARIO: "ESSALUD AGRARIO",
    SIS_MICROEMPRESA: "SIS (MICROEMPRESA)",
  };
  return map[code] || code;
};

const getPensionLabel = (code: string): string => {
  const map: Record<string, string> = {
    ONP: "ONP (D.L. 19990)",
    SPP_INTEGRA: "SPP - INTEGRA",
    SPP_PRIMA: "SPP - PRIMA",
    SPP_PROFUTURO: "SPP - PROFUTURO",
    SPP_HABITAT: "SPP - HABITAT",
    SIN_REGIMEN_PENSIONARIO: "SIN REGIMEN PENSIONARIO/NO APLICA",
  };
  return map[code] || code;
};

// PDF Document Component
function TRegistroPDF({
  data,
  orderId,
  timestamp,
}: {
  data: TPersonaPDFPayload;
  orderId: string;
  timestamp: string;
}) {
  const formattedDob = formatDate(data.trabajador.fechaNacimiento);
  const formattedInicio = formatDate(data.laborales.fechaInicio);
  const formattedInicioSalud = formatDate(
    data.seguridadSocial.fechaInicioSalud,
  );
  const formattedInicioPension = formatDate(
    data.seguridadSocial.fechaInicioPensionario,
  );
  const formattedNowDate = formatDate(timestamp);
  const formattedNowTime = formatTime(timestamp);

  const workerFullName =
    `${data.trabajador.apellidoPaterno} ${data.trabajador.apellidoMaterno} ${data.trabajador.nombres}`.toUpperCase();

  return (
    <Document>
      {/* ── Page 1: Identificación y Datos Laborales ── */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image src={logoDataUri} style={styles.logoImage} />
          </View>
          <Text style={styles.headerRight}>
            T-Registro: Registro de Prestadores
          </Text>
        </View>

        {/* Document Title */}
        <View style={styles.docTitleContainer}>
          <Text style={styles.docTitleMain}>
            CONSTANCIA DE ALTA DEL TRABAJADOR
          </Text>
          <Text style={styles.docTitleSub}>Formulario 1604-1</Text>
          <Text style={styles.docTitleBold}>
            Comprobante de Información Registrada
          </Text>
        </View>

        {/* Intro */}
        <Text style={styles.introText}>
          Con el número de orden {orderId} se realizó satisfactoriamente el
          registro del trabajador el {formattedNowDate} a las {formattedNowTime}
          , según el siguiente detalle:
        </Text>

        {/* Section: Empleador */}
        <Text style={styles.sectionTitle}>EMPLEADOR</Text>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBoldShort}>Número de RUC:</Text>
              <Text style={styles.valueText}>{data.empleador.ruc}</Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBoldShort}>Nombre o razón social:</Text>
              <Text style={styles.valueText}>
                {data.empleador.name.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Trabajador Identificacion */}
        <Text style={styles.sectionTitle}>
          TRABAJADOR - Datos de identificación
        </Text>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Tipo y número de documento:</Text>
              <Text style={styles.valueText}>
                L.E / DNI - {data.trabajador.dni}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Fecha de nacimiento:</Text>
              <Text style={styles.valueText}>{formattedDob}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>País emisor del documento:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.nacionalidad.toUpperCase() || "PERÚ"}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Apellidos y nombres:</Text>
              <Text style={styles.valueText}>{workerFullName}</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Sexo:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.sexo.toUpperCase()}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Estado civil:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.estadoCivil.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Nacionalidad:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.nacionalidad.toUpperCase() || "PERUANA"}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Teléfono:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.telefono || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>Correo electrónico:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.email || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>Primera dirección:</Text>
              <Text style={styles.valueText}>
                {data.trabajador.direccion.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>Segunda dirección:</Text>
              <Text style={styles.valueText}>-</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>
                Referente para Centro Asistencial:
              </Text>
              <Text style={styles.valueText}>
                {data.trabajador.direccion.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Trabajador Datos Laborales */}
        <Text style={styles.sectionTitle}>TRABAJADOR - Datos laborales</Text>

        <Text style={styles.subSectionLabel}>Periodos laborales:</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
              Fecha de inicio
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
              Fecha de fin
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { width: "40%", borderRightWidth: 0 },
              ]}
            >
              Motivo de baja
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {formattedInicio}
            </Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>-</Text>
            <Text
              style={[styles.tableCell, { width: "40%", borderRightWidth: 0 }]}
            >
              -
            </Text>
          </View>
        </View>

        <Text style={styles.subSectionLabel}>Tipos de trabajador:</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
              Fecha de inicio
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
              Fecha de fin
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { width: "40%", borderRightWidth: 0 },
              ]}
            >
              Tipo de trabajador
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "30%" }]}>
              {formattedInicio}
            </Text>
            <Text style={[styles.tableCell, { width: "30%" }]}>-</Text>
            <Text
              style={[styles.tableCell, { width: "40%", borderRightWidth: 0 }]}
            >
              {data.laborales.tipoTrabajador.toUpperCase()}
            </Text>
          </View>
        </View>

        <Text style={styles.subSectionLabel}>
          Establecimientos donde labora:
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>
              RUC del empleador
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
              Codigo
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Tipo</Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { width: "40%", borderRightWidth: 0 },
              ]}
            >
              Establecimiento
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "25%" }]}>
              {data.empleador.ruc}
            </Text>
            <Text style={[styles.tableCell, { width: "15%" }]}>
              {data.laborales.codlocal}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              DOMICILIO FISCAL
            </Text>
            <Text
              style={[styles.tableCell, { width: "40%", borderRightWidth: 0 }]}
            >
              {data.empleador.direccion.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Other Labor Details */}
        <View style={[styles.grid, { marginTop: 6 }]}>
          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Régimen laboral:</Text>
              <Text style={styles.valueText}>
                {getRegimenLabel(data.laborales.regimenLaboral)}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Categoría:</Text>
              <Text style={styles.valueText}>EMPLEADO</Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Ocupación:</Text>
              <Text style={styles.valueText}>
                {data.laborales.ocupacion.toUpperCase()}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Tipo de contrato:</Text>
              <Text style={styles.valueText}>
                {getContratoLabel(data.laborales.tipoContrato)}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Tipo de pago y periodicidad:</Text>
              <Text style={styles.valueText}>
                {data.laborales.tipoPago.toUpperCase()} /{" "}
                {data.laborales.periodoIngreso.toUpperCase()}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Remuneración básica:</Text>
              <Text style={styles.valueText}>
                {data.laborales.montoRemuneracion}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>¿Persona con discapacidad?:</Text>
              <Text style={styles.valueText}>
                {data.laborales.discapacidad ? "SÍ" : "NO"}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>¿Sindicalizado?:</Text>
              <Text style={styles.valueText}>
                {data.laborales.sindicalizado ? "SÍ" : "NO"}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Jornada laboral:</Text>
              <Text style={styles.valueText}>
                {data.laborales.jornadaLaboral.toUpperCase()}
              </Text>
            </View>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Situación especial:</Text>
              <Text style={styles.valueText}>
                {data.laborales.situacionEspecial.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridField}>
              <Text style={styles.labelBold}>Situación:</Text>
              <Text style={styles.valueText}>Activo</Text>
            </View>
          </View>
        </View>

        {/* Footer Page 1 */}
        <View style={styles.footer}>
          <Text>
            Generado el {formattedNowDate} a las {formattedNowTime}
          </Text>
          <Text>Pag. 1 de 2</Text>
        </View>
      </Page>

      {/* ── Page 2: Seguridad Social, Educación y Adicionales ── */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Image src={logoDataUri} style={styles.logoImage} />
          </View>
          <Text style={styles.headerRight}>
            T-Registro: Registro de Prestadores
          </Text>
        </View>

        {/* Section: Seguridad Social */}
        <Text style={styles.sectionTitle}>
          TRABAJADOR - Datos de seguridad social
        </Text>

        <Text style={styles.subSectionLabel}>
          Régimen de aseguramiento de salud:
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "35%" }]}>
              Régimen de salud
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
              Fecha de inicio
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
              Fecha de fin
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { width: "25%", borderRightWidth: 0 },
              ]}
            >
              Entidad Prestadora de Salud
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "35%" }]}>
              {getSaludLabel(data.seguridadSocial.regimenSalud)}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {formattedInicioSalud}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {data.seguridadSocial.fechaFinSalud
                ? formatDate(data.seguridadSocial.fechaFinSalud)
                : "-"}
            </Text>
            <Text
              style={[styles.tableCell, { width: "25%", borderRightWidth: 0 }]}
            >
              -
            </Text>
          </View>
        </View>

        <Text style={styles.subSectionLabel}>Regimen pensionario:</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "40%" }]}>
              Régimen pensionario
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
              Fecha de inicio
            </Text>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
              Fecha de fin
            </Text>
            <Text
              style={[
                styles.tableHeaderCell,
                { width: "20%", borderRightWidth: 0 },
              ]}
            >
              CUSPP
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { width: "40%" }]}>
              {getPensionLabel(data.seguridadSocial.regimenPensionario)}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {formattedInicioPension}
            </Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>
              {data.seguridadSocial.fechaFinPensionario
                ? formatDate(data.seguridadSocial.fechaFinPensionario)
                : "-"}
            </Text>
            <Text
              style={[styles.tableCell, { width: "20%", borderRightWidth: 0 }]}
            >
              {data.seguridadSocial.CUSPP || "-"}
            </Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>Aporte al SCTR:</Text>
              <Text style={styles.valueText}>
                {data.seguridadSocial.sctr ? "SÍ" : "NO"}
              </Text>
            </View>
          </View>
          {data.seguridadSocial.sctr && (
            <>
              <View style={styles.gridRow}>
                <View style={styles.gridFieldFull}>
                  <Text style={styles.labelBold}>Cobertura pensión:</Text>
                  <Text style={styles.valueText}>
                    {data.seguridadSocial.pension
                      ? getPensionLabel(data.seguridadSocial.pension)
                      : "SÍ"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.gridFieldFull}>
                  <Text style={styles.labelBold}>Cobertura de salud:</Text>
                  <Text style={styles.valueText}>
                    {data.seguridadSocial.salud
                      ? getSaludLabel(data.seguridadSocial.salud)
                      : "SÍ"}
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Section: Educativa */}
        <Text style={styles.sectionTitle}>
          TRABAJADOR - Datos de la Situación Educativa
        </Text>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>Situación Educativa:</Text>
              <Text style={styles.valueText}>
                {data.educacion.situacionEducativa.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Estudios Table if studies present */}
        {data.educacion.estudios && data.educacion.estudios.length > 0 && (
          <View style={{ marginTop: 4 }}>
            <Text style={styles.subSectionLabel}>
              Relación de estudios concluidos:
            </Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { width: "15%" }]}>
                  Formación
                </Text>
                <Text style={[styles.tableHeaderCell, { width: "10%" }]}>
                  ¿Perú?
                </Text>
                <Text style={[styles.tableHeaderCell, { width: "10%" }]}>
                  Tipo
                </Text>
                <Text style={[styles.tableHeaderCell, { width: "20%" }]}>
                  Institución
                </Text>
                <Text style={[styles.tableHeaderCell, { width: "30%" }]}>
                  Carrera
                </Text>
                <Text
                  style={[
                    styles.tableHeaderCell,
                    { width: "15%", borderRightWidth: 0 },
                  ]}
                >
                  Año Egr.
                </Text>
              </View>
              {data.educacion.estudios.map((est, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { width: "15%" }]}>
                    {est.formacionCompleta === "UNIVERSITARIA_COMPLETA"
                      ? "UNIV COMP"
                      : "SUP COMP"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>
                    {est.estudioPeru ? "SÍ" : "NO"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "10%" }]}>
                    {est.privado ? "PRIV" : "PUB"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "20%" }]}>
                    {est.nombreInstitucion.toUpperCase()}
                  </Text>
                  <Text style={[styles.tableCell, { width: "30%" }]}>
                    {est.nombreCarrera.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      { width: "15%", borderRightWidth: 0 },
                    ]}
                  >
                    {est.añoEgreso}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Section: Adicionales */}
        <Text style={styles.sectionTitle}>
          TRABAJADOR - Datos adicionales referidos al ingreso
        </Text>
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>
                ¿Percibe rentas de 5ta exoneradas (inc. e) Art 19 de la LIR?:
              </Text>
              <Text style={styles.valueText}>
                {data.adicionales.quintaCategoriaExonerada ? "SÍ" : "NO"}
              </Text>
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridFieldFull}>
              <Text style={styles.labelBold}>
                ¿Aplica convenio para evitar doble imposición?:
              </Text>
              <Text style={styles.valueText}>
                {data.adicionales.evitaDobleImposicion ? "SÍ" : "NO"}
              </Text>
            </View>
          </View>
        </View>

        {/* SUNAT Legal Notes */}
        <Text style={styles.notesTitle}>Notas:</Text>
        <Text style={styles.notesText}>
          - Los trabajadores que por primera vez ingresen a trabajar a un centro
          laboral se encuentran obligados a elegir un sistema pensionario y
          comunicarlo a su empleador, a través de la presentación del
          &ldquo;Formato de Elección del Sistema Pensionario&rdquo;, dentro del
          plazo legal.{"\n"}- El Empleador deberá consignar en el T-Registro, el
          régimen pensionario que corresponda al sistema elegido por el
          trabajador o el que aplique ante la falta de presentación del citado
          Formato, una vez finalizado el plazo legal de elección.
        </Text>
        <Text style={[styles.notesTitle, { marginTop: 4 }]}>Base Legal:</Text>
        <Text style={styles.notesText}>
          Artículo 16° de la Ley N° 28991, modificado por el artículo 5° de la
          Ley N° 29903.
        </Text>

        {/* Footer Page 2 */}
        <View style={styles.footer}>
          <Text>
            Generado el {formattedNowDate} a las {formattedNowTime}
          </Text>
          <Text>Pag. 2 de 2</Text>
        </View>
      </Page>
    </Document>
  );
}

// Next.js POST handler
export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TPersonaPDFPayload;

    // Use tPersonaId (padded to 8 digits) as orderId, fallback to random if missing
    const orderId = payload.tPersonaId
      ? String(payload.tPersonaId).padStart(8, "0")
      : String(Math.floor(10000000 + Math.random() * 90000000));

    // Use createAt as timestamp, fallback to current time if missing
    const timestamp = payload.createAt || new Date().toISOString();

    // Render react-pdf to buffer
    const pdfStream = await pdf(
      <TRegistroPDF data={payload} orderId={orderId} timestamp={timestamp} />,
    ).toBlob();

    return new Response(pdfStream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          "inline; filename=comprobante_informacion_registrada.pdf",
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("PDF generation failed:", error);
    return NextResponse.json(
      { message: "Failed to generate PDF", error: error.message },
      { status: 500 },
    );
  }
}
