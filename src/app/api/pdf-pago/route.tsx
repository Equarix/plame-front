import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToStream,
} from "@react-pdf/renderer";
import { NextResponse } from "next/server";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 15,
    border: "1px solid #000",
    padding: 10,
    paddingTop: 15,
    position: "relative",
  },
  sectionTitle: {
    position: "absolute",
    top: -6,
    left: 10,
    backgroundColor: "white",
    paddingHorizontal: 4,
    fontSize: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: "40%",
  },
  value: {
    width: "60%",
  },
  table: {
    width: "100%",
    border: "1px solid #000",
    marginTop: 5,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#63b3d3",
    borderBottom: "1px solid #000",
    padding: 3,
  },
  tableHeaderCol: {
    flex: 1,
    fontWeight: "bold",
  },
  tableHeaderColRight: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    padding: 3,
  },
  tableCol: {
    flex: 1,
  },
  tableColRight: {
    flex: 1,
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { declaracion, tributos, pago } = data;

    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={{ textAlign: "center", flex: 1 }}>
              Constancia Formulario - 0601
            </Text>
            <Text>
              Fecha: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Identificación de la Transacción:</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Formulario :</Text>
              <Text style={styles.value}>0601</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Orden :</Text>
              <Text style={styles.value}>{declaracion.numeroOrden || "1160814599"}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de presentación :</Text>
              <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos de la Declaración:</Text>
            <View style={styles.row}>
              <Text style={styles.label}>RUC :</Text>
              <Text style={styles.value}>{declaracion.ruc}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Nombre o Razón Social :</Text>
              <Text style={styles.value}>{declaracion.razonSocial}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Periodo :</Text>
              <Text style={styles.value}>{declaracion.periodo}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Semana :</Text>
              <Text style={styles.value}>0</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tipo de Declaración :</Text>
              <Text style={styles.value}>{declaracion.tipoDeclaracion}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Trabajadores :</Text>
              <Text style={styles.value}>{declaracion.numeroTrabajadores.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Pensionistas :</Text>
              <Text style={styles.value}>0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Personal Cuarta Categoría :</Text>
              <Text style={styles.value}>0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Personal Modalidad Formativa :</Text>
              <Text style={styles.value}>0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Terceros :</Text>
              <Text style={styles.value}>0.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Regímenes Especiales :</Text>
              <Text style={styles.value}>0.00</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle de Tributos:</Text>
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={[{ flex: 2 }, styles.bold]}>Tributos</Text>
                <Text style={styles.tableHeaderColRight}>Total Deuda</Text>
                <Text style={styles.tableHeaderColRight}>Monto Pago</Text>
              </View>
              {tributos.map((t: any, index: number) => (
                <View style={styles.tableRow} key={index}>
                  <Text style={{ flex: 2 }}>{t.nombre}</Text>
                  <Text style={styles.tableColRight}>S/. {t.deuda.toFixed(0)}</Text>
                  <Text style={styles.tableColRight}>S/. {t.pago.toFixed(0)}</Text>
                </View>
              ))}
              <View style={[styles.tableRow, { borderBottom: "none" }]}>
                <Text style={[{ flex: 2 }, styles.bold]}>Total a Pagar</Text>
                <Text style={styles.tableColRight}></Text>
                <Text style={styles.tableColRight}>
                  S/. {tributos.reduce((sum: number, t: any) => sum + t.pago, 0).toFixed(0)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalle de Pago:</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Banco :</Text>
              <Text style={styles.value}>{pago.banco}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Operación :</Text>
              <Text style={styles.value}>{pago.numeroOperacion}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Medio de Pago :</Text>
              <Text style={styles.value}>{pago.medioPago}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Fecha de Pago :</Text>
              <Text style={styles.value}>{pago.fechaPago}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );

    const stream = await renderToStream(<MyDocument />);
    const chunks: Buffer[] = [];
    for await (const chunk of stream as any) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Constancia_0601.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
